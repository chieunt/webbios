# Platform Database Schema (plt_* Suite)

> **Version:** 1.0.0
> **Ngày tạo:** 2026-06-04
> **Cập nhật:** 2026-06-05
> **Tác giả:** WebbiOS Team

## 1. Kiến trúc Platform Suite

Webbi Platform là một **Platform Suite** chạy trên chính một bản WebbiOS Core. Các bảng nghiệp vụ của Webbi Platform sử dụng prefix `plt_`, nằm chung database D1 với Core (`wb_*`).

**Lợi ích:**
- Tận dụng `wb_users` (Identity Hub) — không cần bảng user/auth riêng
- Tận dụng `wb_roles`, `wb_permissions` — phân quyền cho Webbi Team
- Tận dụng `wb_menus` — đăng ký menu nghiệp vụ Platform
- Tận dụng `wb_audit_logs` — ghi nhật ký hoạt động
- Nhất quán 100% với mô hình Suite (giống Commerce thêm `com_*`, Platform thêm `plt_*`)

### Cơ chế Bootstrap (God Instance)

Webbi Platform là **God Instance** — bản WebbiOS duy nhất không cần kiểm tra license vì chính nó là nguồn quản lý license. Việc này được cấu hình thông qua **Environment Variable** (`INSTANCE_TYPE`) trong file `wrangler.toml` khi deploy Worker, thay vì lưu trong database để đảm bảo an toàn tuyệt đối.

```toml
# wrangler.toml của Webbi Platform (God Instance)
[vars]
INSTANCE_TYPE = "platform"

# wrangler.toml của shop khách hàng (deploy bởi Platform API)
[vars]
INSTANCE_TYPE = "shop"
```

Khi Core API đọc biến môi trường `INSTANCE_TYPE = 'platform'`, nó sẽ bỏ qua toàn bộ luồng heartbeat/license check. Việc cấu hình qua Env Var ngăn chặn tuyệt đối rủi ro khách hàng can thiệp vào Database để tự cấp quyền cho mình.

---

## 2. Tổng quan Database

```
┌─────────────────────────────────────────────────┐
│  Cloudflare D1 (1 database duy nhất)            │
│                                                 │
│  ── Core Kernel (wb_*) ──────────────────────── │
│  wb_users              ← Webbi Team members     │
│  wb_roles              ← owner, admin, staff    │
│  wb_permissions        ← Core + Platform perms  │
│  wb_role_permissions   ← Gán quyền vào vai trò  │
│  wb_sessions           ← Phiên đăng nhập        │
│  wb_menus              ← Core + Platform menus  │
│  wb_settings           ← Cấu hình hệ thống     │
│  wb_audit_logs         ← Nhật ký hoạt động      │
│  wb_media              ← Quản lý file           │
│  wb_api_keys           ← Khóa API               │
│  wb_installed_apps     ← Platform Suite record   │
│                                                 │
│  ── Platform Suite (plt_*) ──────────────────── │
│  plt_core_versions     ← Phiên bản Core         │
│  plt_announcements     ← Thông báo hệ thống     │
│  plt_announcement_logs ← Theo dõi gửi/đọc       │
│  plt_blueprints        ← Công thức đóng gói     │
│  plt_shops             ← Shop đã đăng ký        │
│  plt_partners          ← Developer/Partner       │
│  plt_app_listings      ← Marketplace listings    │
│  plt_app_versions      ← Phiên bản App           │
│  plt_licenses          ← Bản quyền              │
│  plt_transactions      ← Giao dịch, doanh thu   │
│  plt_affiliates        ← Affiliate partners      │
│  plt_referrals         ← Referral tracking       │
│  plt_affiliate_commissions ← Hoa hồng           │
└─────────────────────────────────────────────────┘
```

**Những gì ĐÃ BỎ (dùng Core thay thế):**
- ~~platform_partners.email, password_hash, role~~ → dùng `wb_users` + `wb_roles`
- ~~Hệ thống auth riêng~~ → dùng `wb_sessions`
- ~~Hệ thống quyền riêng~~ → dùng `wb_permissions` + `wb_role_permissions`

**Thay đổi với `plt_partners`:**
Partners/Developers giờ là user trong `wb_users` với role `partner`. Bảng `plt_partners` chỉ lưu thông tin profile mở rộng (doanh thu, thanh toán), liên kết về `wb_users.id` qua Identity Hub — giống cách `com_customers` hoạt động.

---

## 3. Table Schemas (plt_*)

### 3.1. plt_core_versions
Quản lý các phiên bản phát hành của WebbiOS Core.

```sql
CREATE TABLE plt_core_versions (
  id TEXT PRIMARY KEY,
  version TEXT NOT NULL UNIQUE,
  release_notes TEXT,
  is_latest INTEGER DEFAULT 0,
  is_critical INTEGER DEFAULT 0,
  released_at TEXT DEFAULT (datetime('now')),
  created_at TEXT DEFAULT (datetime('now'))
);
```

### 3.2. plt_announcements
Thông báo hệ thống từ Webbi Team gửi tới các shop.

```sql
CREATE TABLE plt_announcements (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  link TEXT,
  is_critical INTEGER DEFAULT 0,
  target_audience TEXT DEFAULT 'all',
  channels TEXT DEFAULT '["dashboard"]',
  scheduled_for TEXT,
  status TEXT DEFAULT 'draft',
  created_at TEXT DEFAULT (datetime('now'))
);
```

### 3.3. plt_announcement_logs
Theo dõi trạng thái gửi và đọc thông báo.

```sql
CREATE TABLE plt_announcement_logs (
  id TEXT PRIMARY KEY,
  announcement_id TEXT NOT NULL REFERENCES plt_announcements(id),
  shop_id TEXT NOT NULL REFERENCES plt_shops(id),
  channel TEXT NOT NULL,
  delivery_status TEXT DEFAULT 'pending',
  read_status TEXT DEFAULT 'unread',
  sent_at TEXT,
  read_at TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_plt_al_announcement ON plt_announcement_logs(announcement_id);
CREATE INDEX idx_plt_al_shop ON plt_announcement_logs(shop_id);
```

### 3.4. plt_blueprints
Công thức đóng gói 1-click (Blueprint Registry).

```sql
CREATE TABLE plt_blueprints (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  suites TEXT NOT NULL DEFAULT '[]',
  addons TEXT DEFAULT '[]',
  theme TEXT,
  suite_config TEXT DEFAULT '{}',
  seed_pages TEXT DEFAULT '[]',
  is_active INTEGER DEFAULT 1,
  display_order INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_plt_blueprints_slug ON plt_blueprints(slug);
CREATE INDEX idx_plt_blueprints_active ON plt_blueprints(is_active, display_order);
```

### 3.5. plt_shops
Danh sách shop (WebbiOS instances) đã đăng ký.

```sql
CREATE TABLE plt_shops (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  domain TEXT UNIQUE,
  subdomain TEXT UNIQUE,
  shop_name TEXT,
  blueprint TEXT,
  plan TEXT NOT NULL DEFAULT 'free',
  core_version TEXT,
  cf_account_id TEXT,
  cf_worker_name TEXT,
  cf_d1_id TEXT,
  license_key TEXT UNIQUE,
  registered_via TEXT,
  suspended_reason TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_plt_shops_email ON plt_shops(email);
CREATE INDEX idx_plt_shops_domain ON plt_shops(domain);
CREATE INDEX idx_plt_shops_subdomain ON plt_shops(subdomain);
CREATE INDEX idx_plt_shops_status ON plt_shops(status);
CREATE INDEX idx_plt_shops_plan ON plt_shops(plan);
CREATE INDEX idx_plt_shops_via ON plt_shops(registered_via);
```

### 3.6. plt_partners
Profile mở rộng cho Developer/Partner. Liên kết về `wb_users.id` (Identity Hub).

> ⚠️ Auth (email, password) nằm ở `wb_users`. Bảng này chỉ lưu thông tin nghiệp vụ.

```sql
CREATE TABLE plt_partners (
  id TEXT PRIMARY KEY,
  user_id TEXT UNIQUE REFERENCES wb_users(id),
  company TEXT,
  website TEXT,
  total_earned REAL DEFAULT 0,
  total_paid REAL DEFAULT 0,
  balance REAL DEFAULT 0,
  payout_info TEXT,
  status TEXT DEFAULT 'active',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_plt_partners_user ON plt_partners(user_id);
CREATE INDEX idx_plt_partners_status ON plt_partners(status);
```

### 3.7. plt_app_listings
Danh sách App/Suite/Theme trên Marketplace.

```sql
CREATE TABLE plt_app_listings (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  author_id TEXT NOT NULL REFERENCES plt_partners(id),
  icon_url TEXT,
  type TEXT NOT NULL DEFAULT 'app',
  category TEXT,
  pricing_type TEXT NOT NULL,
  price REAL DEFAULT 0,
  subscription_period TEXT,
  visibility TEXT NOT NULL DEFAULT 'public',
  is_published INTEGER DEFAULT 0,
  is_official INTEGER DEFAULT 0,
  download_count INTEGER DEFAULT 0,
  rating_avg REAL DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_plt_app_slug ON plt_app_listings(slug);
CREATE INDEX idx_plt_app_type ON plt_app_listings(type);
CREATE INDEX idx_plt_app_category ON plt_app_listings(category);
CREATE INDEX idx_plt_app_visibility ON plt_app_listings(visibility);
CREATE INDEX idx_plt_app_official ON plt_app_listings(is_official);
```

> **Cột `visibility` mới (v3.0):**
> | Giá trị | Ý nghĩa |
> |---|---|
> | `public` | Hiển thị trên Marketplace cho mọi khách hàng |
> | `unlisted` | Không hiển thị nhưng có thể cài bằng link trực tiếp |
> | `internal` | Chỉ dành cho Webbi Team, hoàn toàn ẩn |

### 3.8. plt_app_versions
Phiên bản mã nguồn của mỗi App.

```sql
CREATE TABLE plt_app_versions (
  id TEXT PRIMARY KEY,
  app_id TEXT NOT NULL REFERENCES plt_app_listings(id),
  version TEXT NOT NULL,
  changelog TEXT,
  bundle_url TEXT NOT NULL,
  bundle_checksum TEXT NOT NULL,
  min_core_version TEXT,
  is_latest INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_plt_app_version ON plt_app_versions(app_id, version);
```

### 3.9. plt_licenses
Bản quyền sử dụng App cho từng shop.

```sql
CREATE TABLE plt_licenses (
  id TEXT PRIMARY KEY,
  shop_id TEXT NOT NULL REFERENCES plt_shops(id),
  app_id TEXT NOT NULL REFERENCES plt_app_listings(id),
  license_key TEXT NOT NULL UNIQUE,
  status TEXT DEFAULT 'active',
  purchased_at TEXT,
  expires_at TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_plt_license_shop ON plt_licenses(shop_id);
CREATE INDEX idx_plt_license_key ON plt_licenses(license_key);
CREATE INDEX idx_plt_license_status ON plt_licenses(status);
```

### 3.10. plt_transactions
Giao dịch mua App/Theme.

```sql
CREATE TABLE plt_transactions (
  id TEXT PRIMARY KEY,
  license_id TEXT REFERENCES plt_licenses(id),
  shop_id TEXT NOT NULL REFERENCES plt_shops(id),
  app_id TEXT NOT NULL,
  amount REAL NOT NULL,
  currency TEXT DEFAULT 'VND',
  payment_method TEXT,
  status TEXT DEFAULT 'pending',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_plt_txn_shop ON plt_transactions(shop_id);
CREATE INDEX idx_plt_txn_status ON plt_transactions(status);
```

### 3.11. plt_affiliates
Đối tác tiếp thị liên kết.

```sql
CREATE TABLE plt_affiliates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  affiliate_code TEXT NOT NULL UNIQUE,
  source_client TEXT NOT NULL,
  commission_rate REAL NOT NULL DEFAULT 10,
  tier TEXT DEFAULT 'standard',
  total_referrals INTEGER DEFAULT 0,
  total_earned REAL DEFAULT 0,
  total_paid REAL DEFAULT 0,
  balance REAL DEFAULT 0,
  payment_info TEXT,
  status TEXT DEFAULT 'active',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_plt_aff_code ON plt_affiliates(affiliate_code);
CREATE INDEX idx_plt_aff_source ON plt_affiliates(source_client);
CREATE INDEX idx_plt_aff_status ON plt_affiliates(status);
```

### 3.12. plt_referrals
Theo dõi lượt giới thiệu (affiliate → shop đăng ký).

```sql
CREATE TABLE plt_referrals (
  id TEXT PRIMARY KEY,
  affiliate_id TEXT NOT NULL REFERENCES plt_affiliates(id),
  referred_shop_id TEXT NOT NULL REFERENCES plt_shops(id),
  source_client TEXT NOT NULL,
  registered_via_client TEXT NOT NULL,
  blueprint TEXT,
  is_converted INTEGER DEFAULT 0,
  first_conversion_at TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_plt_ref_affiliate ON plt_referrals(affiliate_id);
CREATE INDEX idx_plt_ref_shop ON plt_referrals(referred_shop_id);
CREATE INDEX idx_plt_ref_source ON plt_referrals(source_client);
```

### 3.13. plt_affiliate_commissions
Hoa hồng từ giao dịch của shop được giới thiệu.

```sql
CREATE TABLE plt_affiliate_commissions (
  id TEXT PRIMARY KEY,
  affiliate_id TEXT NOT NULL REFERENCES plt_affiliates(id),
  referral_id TEXT NOT NULL REFERENCES plt_referrals(id),
  event_type TEXT NOT NULL,
  event_id TEXT,
  order_amount REAL NOT NULL,
  commission_rate REAL NOT NULL,
  commission_amount REAL NOT NULL,
  status TEXT DEFAULT 'pending',
  approved_at TEXT,
  paid_at TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_plt_afc_affiliate ON plt_affiliate_commissions(affiliate_id);
CREATE INDEX idx_plt_afc_referral ON plt_affiliate_commissions(referral_id);
CREATE INDEX idx_plt_afc_status ON plt_affiliate_commissions(status);
CREATE INDEX idx_plt_afc_event ON plt_affiliate_commissions(event_type);
```

---

## 4. Cài đặt / Gỡ Platform Suite

### Cài đặt (khi khởi tạo God Instance):
1. Deploy WebbiOS Core (tạo `wb_*` tables, seed roles/permissions/menus)
2. Set `wb_settings.system.instance_type = 'platform'`
3. Chạy Platform Suite migration → tạo `plt_*` tables
4. Đăng ký permissions: `shops:view`, `shops:manage`, `licenses:manage`, `marketplace:manage`, `partners:manage`, `affiliates:manage`, `announcements:manage`
5. Đăng ký menu items vào `wb_menus` (app_slug = 'platform')

### Gỡ cài đặt (lý thuyết, thực tế không bao giờ gỡ):
1. `DROP TABLE` tất cả `plt_*`
2. `DELETE FROM wb_permissions WHERE slug LIKE 'shops:%' OR slug LIKE 'licenses:%' OR ...`
3. `DELETE FROM wb_menus WHERE app_slug = 'platform'`
4. `DELETE FROM wb_installed_apps WHERE slug = 'platform'`

---

## 5. Indexes & Tối ưu

- Sử dụng `ULID` (26 ký tự, sortable, unique) cho tất cả Primary Key.
- API tra cứu Marketplace (`plt_app_listings`) kết hợp cache KV để tránh hit D1 liên tục.
- Query kiểm tra `plt_licenses` là tác vụ quan trọng, được cache tại Edge (KV) để phản hồi nhanh cho heartbeat từ Core API của khách.
