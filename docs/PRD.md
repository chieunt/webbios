# WebbiOS — Product Requirements Document (PRD)

> **Version:** 1.0.0-draft
> **Ngày tạo:** 2026-06-01
> **Cập nhật lần cuối:** 2026-06-01
> **Tác giả:** WebbiOS Team

---

## Mục lục

- [1. Tổng quan dự án](#1-tổng-quan-dự-án)
- [2. Tầm nhìn & Mục tiêu](#2-tầm-nhìn--mục-tiêu)
- [3. Đối tượng người dùng](#3-đối-tượng-người-dùng)
- [4. Kiến trúc hệ thống](#4-kiến-trúc-hệ-thống)
- [5. Công nghệ sử dụng](#5-công-nghệ-sử-dụng)
- [6. Cấu trúc Monorepo](#6-cấu-trúc-monorepo)
- [7. API Backend (Hono.js)](#7-api-backend-honojs)
- [8. Dashboard quản trị](#8-dashboard-quản-trị)
- [9. Storefront (Headless Commerce)](#9-storefront-headless-commerce)
- [10. Database Schema (D1)](#10-database-schema-d1)
- [11. Authentication & Authorization](#11-authentication--authorization)
- [12. Quản lý sản phẩm](#12-quản-lý-sản-phẩm)
- [13. Quản lý đơn hàng](#13-quản-lý-đơn-hàng)
- [14. Quản lý khách hàng](#14-quản-lý-khách-hàng)
- [15. Tích hợp thanh toán](#15-tích-hợp-thanh-toán)
- [16. Tích hợp vận chuyển](#16-tích-hợp-vận-chuyển)
- [17. Hệ thống Theme](#17-hệ-thống-theme)
- [18. Hệ thống Apps (Plugin)](#18-hệ-thống-apps-plugin)
- [19. Marketplace](#19-marketplace)
- [20. Đa ngôn ngữ (i18n)](#20-đa-ngôn-ngữ-i18n)
- [21. Quản lý phiên bản & Cập nhật](#21-quản-lý-phiên-bản--cập-nhật)
- [22. Tối ưu Cloudflare Free Tier](#22-tối-ưu-cloudflare-free-tier)
- [23. webbi.vn — Nền tảng SaaS Trial](#23-webbivn--nền-tảng-saas-trial)
- [24. Bảo mật](#24-bảo-mật)
- [25. Hiệu năng & Tối ưu](#25-hiệu-năng--tối-ưu)
- [26. Báo cáo & Phân tích](#26-báo-cáo--phân-tích)
- [27. SEO](#27-seo)
- [28. Lộ trình phát triển](#28-lộ-trình-phát-triển)
- [29. Phụ lục](#29-phụ-lục)

---

## 1. Tổng quan dự án

### 1.1. WebbiOS là gì?

**WebbiOS** là một nền tảng mã nguồn (open-core) giúp xây dựng website và ứng dụng quản lý bán hàng (mini ERP) cho doanh nghiệp nhỏ và vừa (SMB). WebbiOS được xây dựng **100% trên hạ tầng Cloudflare** (Workers, D1, R2, KV, Queues, Pages, CDN) với mục tiêu mang lại hiệu năng cao, chi phí duy trì cực thấp (thậm chí = 0), và khả năng mở rộng không giới hạn.

### 1.2. Mô hình phân phối

WebbiOS kết hợp mô hình phân phối của **WordPress** (bàn giao source code, self-hosted) với bộ tính năng e-commerce mạnh mẽ tương tự **Shopify** và khả năng quản lý của một **Mini ERP**:

| Đặc điểm | WordPress | Shopify | Haravan/Sapo | **WebbiOS** |
|---|---|---|---|---|
| Mô hình | Self-hosted | SaaS | SaaS | **Self-hosted** |
| Source code | ✅ Bàn giao | ❌ Không | ❌ Không | **✅ Bàn giao** |
| Tự chủ dữ liệu | ✅ Hoàn toàn | ❌ Không | ❌ Không | **✅ Hoàn toàn (Riêng tư)** |
| Infra | VPS/Hosting | Cloud | Cloud của hãng| **Cloudflare** |
| Chi phí duy trì | $5-50/tháng | $29-299/tháng| 300K-1M+/tháng| **$0-5/tháng** |
| E-commerce | Cần plugin | Built-in | Built-in | **Built-in** |
| Quản lý (ERP) | ❌ Yếu | ⚠️ Cơ bản | ✅ Tốt | **✅ Tốt (Module hóa)** |

### 1.3. USP (Unique Selling Proposition)

1. **Chi phí duy trì = 0** — Chạy trên Cloudflare Free Tier, không cần thuê VPS hay hosting.
2. **Sở hữu source code & Tự chủ dữ liệu** — Khách hàng toàn quyền kiểm soát data, tránh rủi ro lock-in và bảo mật pháp lý, thuế.
3. **Hiệu năng Edge & 3-Tier Cache** — Nhanh vô đối với CDN Cache, KV Cache và D1 Edge SQLite.
4. **Quản lý đa kênh (Mini ERP)** — Sẵn sàng mở rộng thành hệ thống quản lý bán hàng đa kênh, tồn kho, đối soát (không chỉ là web TMĐT).
5. **Cài đặt 1-Click Automation** — Dù self-hosted nhưng khách hàng không cần kiến thức IT, mọi thứ được deploy qua WebbiOS tự động cấu hình Cloudflare API.
6. **Kiến trúc App-as-Worker & Universal Storefront** — Cài app, đổi theme tức thì mà không cần rebuild/redeploy.

## 2. Tầm nhìn & Mục tiêu

### 2.1. Tầm nhìn

Biến WebbiOS trở thành **nền tảng xây dựng web/app e-commerce hàng đầu** cho thị trường Việt Nam và Đông Nam Á, với:

- Hiệu năng cao nhờ edge computing
- Chi phí duy trì rẻ nhất thị trường (= 0 với gói Free)
- Khả năng mở rộng không giới hạn
- Cập nhật phiên bản thường xuyên
- Hệ sinh thái theme/apps phong phú
- Bàn giao full source code

### 2.2. Mục tiêu kinh doanh

| Giai đoạn | Mục tiêu |
|---|---|
| **0-6 tháng** | Hoàn thiện WebbiOS 1.0, ra mắt beta cho 10-20 khách hàng đầu tiên |
| **6-12 tháng** | Ra mắt chính thức, 100+ khách hàng, marketplace có 5+ theme và 10+ apps |
| **12-24 tháng** | 500+ khách hàng, mở rộng ra thị trường Đông Nam Á |
| **24+ tháng** | 2000+ khách hàng, hệ sinh thái developer đóng góp theme/apps |

### 2.3. Thị trường mục tiêu

- **Giai đoạn 1:** Việt Nam — SMB có nhu cầu bán hàng online (thời trang, mỹ phẩm, F&B, phụ kiện...)
- **Giai đoạn 2:** Đông Nam Á và quốc tế — sau khi đã chứng minh hiệu quả tại Việt Nam

### 2.4. Nguồn doanh thu

| Nguồn thu | Mô tả | Ước tính |
|---|---|---|
| **Bán license WebbiOS** | Bán quyền sử dụng WebbiOS (one-time hoặc annual) | $50-200/license |
| **Theme trả phí** | Bán theme premium trên Marketplace | $20-50/theme |
| **Apps trả phí** | Bán apps premium trên Marketplace | $10-100/app |
| **webbi.vn SaaS** | Gói dịch vụ managed hosting cho khách không muốn tự quản lý | $5-20/tháng |
| **Dịch vụ tùy chỉnh** | Tư vấn, thiết kế, phát triển theo yêu cầu | Theo dự án |

---

## 3. Đối tượng người dùng

### 3.1. Personas

#### Persona 1: Chủ shop online (End User)
- **Tên:** Chị Lan — Chủ shop thời trang online
- **Nhu cầu:** Cần website bán hàng chuyên nghiệp, chi phí thấp, tự quản lý được
- **Kỹ năng IT:** Cơ bản — biết dùng Facebook, Zalo, Shopee
- **Pain point:** Shopify đắt ($29/tháng), Haravan giới hạn tính năng, WooCommerce phức tạp
- **Kỳ vọng:** Giao diện quản trị dễ dùng, tốc độ nhanh, chi phí rẻ

#### Persona 2: Developer / Agency (Builder)
- **Tên:** Anh Minh — Freelance developer
- **Nhu cầu:** Nền tảng để xây dựng website cho khách hàng, kiếm thêm thu nhập từ theme/apps
- **Kỹ năng IT:** Cao — React, TypeScript, API
- **Pain point:** WordPress + WooCommerce quá chậm, Shopify theme bị giới hạn
- **Kỳ vọng:** API mạnh, plugin system linh hoạt, SDK dễ dùng, tài liệu đầy đủ

#### Persona 3: Doanh nghiệp SMB (Business Owner)
- **Tên:** Anh Tuấn — Giám đốc công ty phân phối
- **Nhu cầu:** Website B2B/B2C, quản lý kho, đa kênh
- **Kỹ năng IT:** Trung bình — biết dùng ERP cơ bản
- **Pain point:** Giải pháp hiện tại đắt, không customize được, phụ thuộc vendor
- **Kỳ vọng:** Sở hữu source code, tự chủ dữ liệu, scalable

### 3.2. Vai trò trong hệ thống

| Vai trò | Mô tả | Quyền hạn |
|---|---|---|
| **Owner** | Chủ shop — người mua license WebbiOS | Toàn quyền: quản lý mọi thứ, xóa shop, mời thành viên |
| **Admin** | Quản lý — được Owner ủy quyền | Gần toàn quyền: quản lý sản phẩm, đơn hàng, khách hàng, cài đặt. Không thể xóa shop hoặc thay đổi quyền Owner |
| **Staff** | Nhân viên | Quyền hạn chế: xem đơn hàng, xử lý đơn, xem sản phẩm, chat với khách |
| **Viewer** | Người xem | Chỉ đọc: xem báo cáo, xem sản phẩm, xem đơn hàng |

---

## 4. Kiến trúc hệ thống

### 4.1. Tổng quan kiến trúc

WebbiOS áp dụng kiến trúc **API-first / Modular Architecture**, trong đó:
- **API Backend** là trung tâm xử lý, phân chia thành các Module (Core & Optional ERP).
- **Dashboard** là SPA giao tiếp với API.
- **Storefront** là kiến trúc "Universal Storefront" kết hợp Slot System (Theme là config-driven).
- **Apps** hoạt động theo mô hình "App-as-Worker" hoàn toàn độc lập.

```
┌─────────────────────────────────────────────────────────────────┐
│                    100% Cloudflare Infrastructure               │
│  ┌──────────────────┐     ┌──────────────────────────────────┐  │
│  │  Dashboard (SPA) │     │  Core API Worker (Hono.js)       │  │
│  │  ─────────────── │────▶│  ├── Core Modules (Auth, Order)  │  │
│  │  CF Pages (Free) │     │  ├── ERP Modules (POS, CRM)      │  │
│  └──────────────────┘     │  └── Automation / Orchestrator   │  │
│                           │  Bindings:                       │  │
│  ┌──────────────────┐     │  ├── D1 (Database)               │  │
│  │  Storefront      │────▶│  ├── R2 (Storage)                │  │
│  │  (Universal)     │     │  ├── KV (Cache/Session)          │  │
│  │  CF Pages (Free) │     │  └── Queues (Background Jobs)    │  │
│  └──────────────────┘     └──────────────────────────────────┘  │
│                                           │ fetch()             │
│  ┌──────────────────┐             ┌───────▼───────┐             │
│  │ Cloudflare CDN   │             │ App Workers   │             │
│  │ (Cache Tầng 1)   │             │ (Độc lập)     │             │
│  └──────────────────┘             └───────────────┘             │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2. Kiến trúc Module (Hướng tới Mini ERP)

WebbiOS được thiết kế để không chỉ là nền tảng e-commerce mà còn là Mini ERP:
- **Core Modules (Luôn bật):** Products, Orders, Customers, Payments, Shipping, Settings.
- **ERP Modules (Bật/tắt theo nhu cầu):** POS, CRM, Inventory (chuyển kho, đối soát), HRM, Finance (thu chi, công nợ).
- Khách hàng có thể dùng WebbiOS chỉ như phần mềm quản lý (chỉ dùng Dashboard) hoặc cả Storefront.

### 4.3. Yêu cầu Hạ tầng bắt buộc (Cloudflare DNS)

Để tối ưu hóa bảo mật và tự động hóa, WebbiOS **bắt buộc** khách hàng phải trỏ tên miền về **Cloudflare DNS**. WebbiOS sẽ gọi Cloudflare API để tự động cấu hình: Proxy (orange cloud), SSL (Full Strict), Cache Rules, và Route.

### 4.4. Chiến lược 3 Tầng Cache (3-Tier Caching)

Hệ thống tận dụng tối đa Cloudflare để đạt hiệu năng < 50ms:
1. **Tầng 1: CF CDN Cache (Edge)**: Cache toàn bộ API response (GET) và HTML tại edge. Quản lý invalidation bằng `Cache-Tag` (purge chính xác khi update).
2. **Tầng 2: KV Cache (Global)**: Lưu trữ settings, theme config, installed apps data. Đọc sub-ms.
3. **Tầng 3: D1 Database (Source of Truth)**: Fallback khi cache miss. Dùng `waitUntil` để write-back lên cache sau khi đọc D1.

## 5. Công nghệ sử dụng

### 5.1. Technology Stack

| Layer | Công nghệ | Phiên bản | Lý do chọn |
|---|---|---|---|
| **Runtime** | Cloudflare Workers | Latest | Edge computing, auto-scale, free tier |
| **API Framework** | Hono.js | 4.x | Native CF Workers, ~14KB, middleware mạnh |
| **Dashboard UI** | React | 19.x | Component-based, ecosystem lớn |
| **Dashboard Build** | Vite | 6.x | Build nhanh, HMR, ESM native |
| **Dashboard Routing** | React Router | 7.x | Mature, type-safe routing |
| **Dashboard Styling** | TailwindCSS | 4.x | Utility-first, responsive, customizable |
| **Storefront SDK** | React + TypeScript | Latest | Type-safe, reusable components |
| **Database** | Cloudflare D1 (SQLite) | Latest | Serverless SQL, free 5GB |
| **ORM** | Drizzle ORM | Latest | Lightweight, D1 native support, type-safe |
| **File Storage** | Cloudflare R2 | Latest | S3-compatible, no egress fees, free 10GB |
| **Cache / Session** | Cloudflare KV | Latest | Global edge, sub-ms reads |
| **Background Jobs** | Cloudflare Queues | Latest | Async processing |
| **Scheduled Tasks** | Cron Triggers | Latest | Periodic jobs (cleanup, reports) |
| **Static Hosting** | Cloudflare Pages | Latest | Unlimited bandwidth, free |
| **i18n** | i18next + react-i18next | Latest | Industry standard, lazy loading, namespaces |
| **Auth** | Self-built JWT | N/A | Web Crypto API, no external dependency |
| **Monorepo** | pnpm workspaces | Latest | Fast, disk-efficient |
| **Build Pipeline** | Turborepo | Latest | Incremental builds, caching |
| **Language** | TypeScript | 5.x | Type safety, DX |
| **Testing** | Vitest | Latest | Fast, Vite-native |
| **E2E Testing** | Playwright | Latest | Cross-browser |
| **Linting** | ESLint + Prettier | Latest | Code quality |
| **Deploy** | Wrangler CLI | Latest | Official CF deploy tool |
| **VCS** | Git + GitHub | Latest | Source control, CI/CD |

### 5.2. Tại sao KHÔNG dùng các công nghệ khác?

| Công nghệ | Lý do KHÔNG dùng |
|---|---|
| **Next.js (cho backend)** | API Routes không phải backend framework thực thụ, @opennextjs/cloudflare vẫn experimental, bundle size lớn |
| **Express.js** | Không chạy trên CF Workers (cần Node.js runtime) |
| **PostgreSQL / MySQL** | Cần VPS/managed service, vi phạm nguyên tắc "100% Cloudflare" |
| **Redis** | CF KV thay thế được cho hầu hết use case |
| **Docker** | CF Workers là serverless, không cần container |
| **Prisma** | Không hỗ trợ D1 tốt bằng Drizzle |
| **Auth0 / Clerk** | Phụ thuộc dịch vụ bên ngoài, có phí |

---

## 6. Cấu trúc Monorepo

### 6.1. Tổng quan cấu trúc

```
WebbiOS/
├── .github/
│   └── workflows/              # CI/CD pipelines
│       ├── ci.yml              # Lint, test, type-check
│       ├── deploy-api.yml      # Deploy API to CF Workers
│       ├── deploy-dashboard.yml # Deploy Dashboard to CF Pages
│       └── release.yml         # Create release + tag
│
├── packages/
│   ├── core/                   # Shared code
│   │   ├── src/
│   │   │   ├── types/          # Shared TypeScript types
│   │   │   │   ├── product.ts
│   │   │   │   ├── order.ts
│   │   │   │   ├── customer.ts
│   │   │   │   ├── payment.ts
│   │   │   │   ├── shipping.ts
│   │   │   │   ├── auth.ts
│   │   │   │   ├── theme.ts
│   │   │   │   ├── app.ts
│   │   │   │   └── index.ts
│   │   │   ├── constants/      # Shared constants
│   │   │   │   ├── status.ts   # Order status, product status, etc.
│   │   │   │   ├── errors.ts   # Error codes
│   │   │   │   └── config.ts   # Default config values
│   │   │   ├── utils/          # Shared utilities
│   │   │   │   ├── slug.ts     # URL slug generation
│   │   │   │   ├── currency.ts # Currency formatting (VND, USD)
│   │   │   │   ├── date.ts     # Date formatting
│   │   │   │   ├── validator.ts # Input validation
│   │   │   │   └── id.ts       # ID generation (nanoid/ULID)
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── api/                    # Backend API
│   │   ├── src/
│   │   │   ├── index.ts        # Hono app entry point
│   │   │   ├── bindings.ts     # CF bindings type definitions
│   │   │   ├── routes/         # API route handlers
│   │   │   │   ├── auth.ts
│   │   │   │   ├── products.ts
│   │   │   │   ├── orders.ts
│   │   │   │   ├── customers.ts
│   │   │   │   ├── payments.ts
│   │   │   │   ├── shipping.ts
│   │   │   │   ├── media.ts    # File upload/management
│   │   │   │   ├── settings.ts
│   │   │   │   ├── themes.ts
│   │   │   │   ├── apps.ts
│   │   │   │   ├── reports.ts
│   │   │   │   ├── webhooks.ts
│   │   │   │   └── storefront.ts # Public API for storefront
│   │   │   ├── services/       # Business logic
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── product.service.ts
│   │   │   │   ├── order.service.ts
│   │   │   │   ├── customer.service.ts
│   │   │   │   ├── payment.service.ts
│   │   │   │   ├── shipping.service.ts
│   │   │   │   ├── media.service.ts
│   │   │   │   ├── cache.service.ts
│   │   │   │   ├── theme.service.ts
│   │   │   │   ├── app.service.ts
│   │   │   │   └── version.service.ts
│   │   │   ├── middleware/     # Hono middlewares
│   │   │   │   ├── auth.ts     # JWT verification
│   │   │   │   ├── rbac.ts     # Role-based access control
│   │   │   │   ├── rate-limit.ts
│   │   │   │   ├── cors.ts
│   │   │   │   ├── logger.ts
│   │   │   │   ├── error-handler.ts
│   │   │   │   └── i18n.ts     # API response i18n
│   │   │   ├── events/         # Event system
│   │   │   │   ├── event-bus.ts
│   │   │   │   ├── handlers/
│   │   │   │   │   ├── order.handler.ts
│   │   │   │   │   ├── product.handler.ts
│   │   │   │   │   ├── customer.handler.ts
│   │   │   │   │   └── payment.handler.ts
│   │   │   │   └── types.ts    # Event type definitions
│   │   │   ├── plugins/        # Plugin engine
│   │   │   │   ├── plugin-manager.ts
│   │   │   │   ├── plugin-context.ts
│   │   │   │   ├── sandbox.ts
│   │   │   │   └── hooks.ts
│   │   │   ├── integrations/   # Third-party integrations
│   │   │   │   ├── payment/
│   │   │   │   │   ├── zalopay.ts
│   │   │   │   │   ├── momo.ts
│   │   │   │   │   └── shopeepay.ts
│   │   │   │   └── shipping/
│   │   │   │       ├── spx.ts
│   │   │   │       ├── ghtk.ts
│   │   │   │       ├── ghn.ts
│   │   │   │       ├── viettel-post.ts
│   │   │   │       └── ahamove.ts
│   │   │   └── db/             # Database layer
│   │   │       ├── schema.ts   # Drizzle schema
│   │   │       ├── migrations/ # D1 migrations
│   │   │       └── seed.ts     # Seed data
│   │   ├── wrangler.toml       # CF Workers config
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── dashboard/              # Admin Dashboard
│   │   ├── src/
│   │   │   ├── main.tsx        # React entry point
│   │   │   ├── App.tsx         # Root component + router
│   │   │   ├── i18n.ts         # i18next config
│   │   │   ├── api/            # API client
│   │   │   │   ├── client.ts   # Fetch wrapper with auth
│   │   │   │   ├── products.ts
│   │   │   │   ├── orders.ts
│   │   │   │   ├── customers.ts
│   │   │   │   └── ...
│   │   │   ├── pages/          # Page components
│   │   │   │   ├── auth/
│   │   │   │   │   ├── LoginPage.tsx
│   │   │   │   │   ├── ForgotPasswordPage.tsx
│   │   │   │   │   └── ResetPasswordPage.tsx
│   │   │   │   ├── dashboard/
│   │   │   │   │   └── DashboardPage.tsx    # Overview/home
│   │   │   │   ├── products/
│   │   │   │   │   ├── ProductsPage.tsx     # List
│   │   │   │   │   ├── ProductDetailPage.tsx # Create/Edit
│   │   │   │   │   ├── CategoriesPage.tsx
│   │   │   │   │   └── InventoryPage.tsx
│   │   │   │   ├── orders/
│   │   │   │   │   ├── OrdersPage.tsx
│   │   │   │   │   └── OrderDetailPage.tsx
│   │   │   │   ├── customers/
│   │   │   │   │   ├── CustomersPage.tsx
│   │   │   │   │   └── CustomerDetailPage.tsx
│   │   │   │   ├── reports/
│   │   │   │   │   ├── SalesReportPage.tsx
│   │   │   │   │   ├── ProductReportPage.tsx
│   │   │   │   │   └── CustomerReportPage.tsx
│   │   │   │   ├── settings/
│   │   │   │   │   ├── GeneralPage.tsx
│   │   │   │   │   ├── PaymentPage.tsx
│   │   │   │   │   ├── ShippingPage.tsx
│   │   │   │   │   ├── ThemesPage.tsx
│   │   │   │   │   ├── AppsPage.tsx
│   │   │   │   │   ├── UsersPage.tsx
│   │   │   │   │   ├── DomainPage.tsx
│   │   │   │   │   └── UpdatePage.tsx        # Version update
│   │   │   │   └── marketing/
│   │   │   │       ├── DiscountsPage.tsx
│   │   │   │       └── CouponsPage.tsx
│   │   │   ├── components/     # Reusable UI components
│   │   │   │   ├── ui/         # Base UI (Button, Input, Modal, Table...)
│   │   │   │   ├── layout/     # Sidebar, Header, MainLayout
│   │   │   │   └── shared/     # Business components (ProductForm, OrderCard...)
│   │   │   ├── hooks/          # Custom React hooks
│   │   │   ├── stores/         # State management (Zustand)
│   │   │   ├── locales/        # Translation files
│   │   │   │   ├── vi/
│   │   │   │   │   ├── common.json
│   │   │   │   │   ├── products.json
│   │   │   │   │   ├── orders.json
│   │   │   │   │   └── ...
│   │   │   │   └── en/         # Thêm sau
│   │   │   └── utils/
│   │   ├── public/
│   │   │   └── _redirects      # SPA routing for CF Pages
│   │   ├── index.html
│   │   ├── vite.config.ts
│   │   ├── tailwind.config.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── storefront-sdk/         # SDK cho theme developers
│   │   ├── src/
│   │   │   ├── client.ts       # API client cho storefront
│   │   │   ├── components/     # Reusable React components
│   │   │   │   ├── ProductCard.tsx
│   │   │   │   ├── ProductList.tsx
│   │   │   │   ├── ProductDetail.tsx
│   │   │   │   ├── Cart.tsx
│   │   │   │   ├── CartItem.tsx
│   │   │   │   ├── Checkout.tsx
│   │   │   │   ├── CheckoutForm.tsx
│   │   │   │   ├── SearchBar.tsx
│   │   │   │   ├── CategoryNav.tsx
│   │   │   │   ├── Pagination.tsx
│   │   │   │   └── index.ts
│   │   │   ├── hooks/          # React hooks
│   │   │   │   ├── useProducts.ts
│   │   │   │   ├── useProduct.ts
│   │   │   │   ├── useCart.ts
│   │   │   │   ├── useCheckout.ts
│   │   │   │   ├── useCategories.ts
│   │   │   │   ├── useSearch.ts
│   │   │   │   ├── useCustomer.ts
│   │   │   │   └── index.ts
│   │   │   ├── providers/      # Context providers
│   │   │   │   ├── WebbiOSProvider.tsx  # Root provider
│   │   │   │   ├── CartProvider.tsx
│   │   │   │   └── AuthProvider.tsx
│   │   │   ├── types/
│   │   │   └── index.ts        # Main exports
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── cli/                    # WebbiOS CLI tool
│       ├── src/
│       │   ├── index.ts
│       │   ├── commands/
│       │   │   ├── init.ts     # webbios init
│       │   │   ├── update.ts   # webbios update
│       │   │   ├── deploy.ts   # webbios deploy
│       │   │   ├── install.ts  # webbios install <app>
│       │   │   ├── uninstall.ts
│       │   │   └── migrate.ts  # webbios migrate
│       │   └── utils/
│       ├── package.json
│       └── tsconfig.json
│
├── themes/
│   └── default/                # Theme mặc định
│       ├── src/
│       │   ├── pages/
│       │   │   ├── HomePage.tsx
│       │   │   ├── ProductPage.tsx
│       │   │   ├── CategoryPage.tsx
│       │   │   ├── CartPage.tsx
│       │   │   ├── CheckoutPage.tsx
│       │   │   ├── AccountPage.tsx
│       │   │   ├── SearchPage.tsx
│       │   │   └── NotFoundPage.tsx
│       │   ├── layouts/
│       │   │   ├── MainLayout.tsx
│       │   │   ├── Header.tsx
│       │   │   └── Footer.tsx
│       │   ├── components/     # Theme-specific components
│       │   ├── styles/
│       │   │   └── theme.css
│       │   ├── config.ts       # Theme configuration
│       │   └── main.tsx
│       ├── public/
│       ├── theme.json          # Theme metadata
│       ├── vite.config.ts
│       ├── package.json
│       └── tsconfig.json
│
├── apps/                       # Sample apps for marketplace
│   ├── loyalty-points/         # App mẫu: Tích điểm
│   ├── reviews/                # App mẫu: Đánh giá sản phẩm
│   └── live-chat/              # App mẫu: Chat trực tuyến
│
├── docs/                       # Documentation
│   ├── PRD.md                  # This file
│   ├── API.md                  # API documentation
│   ├── THEME_GUIDE.md          # Theme development guide
│   ├── APP_GUIDE.md            # App development guide
│   └── DEPLOYMENT.md           # Deployment guide
│
├── pnpm-workspace.yaml         # pnpm monorepo config
├── turbo.json                  # Turborepo config
├── package.json                # Root package.json
├── tsconfig.base.json          # Base TypeScript config
├── .gitignore
├── .eslintrc.js
├── .prettierrc
├── CHANGELOG.md
└── README.md
```

### 6.2. Package Dependencies

```
┌──────────┐
│   core   │ ◀── Shared types, utils (no dependencies)
└────┬─────┘
     │
     ├──────────────────┬────────────────────┐
     ▼                  ▼                    ▼
┌──────────┐    ┌──────────────┐    ┌────────────────┐
│   api    │    │  dashboard   │    │ storefront-sdk │
│          │    │  (depends on │    │  (depends on   │
│(depends  │    │   core)      │    │   core)        │
│ on core) │    └──────────────┘    └───────┬────────┘
└──────────┘                                │
                                            ▼
                                    ┌──────────────┐
                                    │  themes/*    │
                                    │ (depends on  │
                                    │ storefront-  │
                                    │     sdk)     │
                                    └──────────────┘
```

### 6.3. pnpm-workspace.yaml

```yaml
packages:
  - 'packages/*'
  - 'themes/*'
  - 'apps/*'
```

### 6.4. turbo.json

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {},
    "test": {
      "dependsOn": ["build"]
    },
    "type-check": {
      "dependsOn": ["^build"]
    },
    "deploy": {
      "dependsOn": ["build", "test"]
    }
  }
}
```

---

## 7. API Backend (Hono.js)

### 7.1. Cấu hình Cloudflare Workers

```toml
# packages/api/wrangler.toml

name = "webbios-api"
main = "src/index.ts"
compatibility_date = "2026-06-01"
compatibility_flags = ["nodejs_compat"]

# D1 Database
[[d1_databases]]
binding = "DB"
database_name = "webbios-db"
database_id = "<auto-generated>"

# KV Namespace
[[kv_namespaces]]
binding = "KV"
id = "<auto-generated>"

# R2 Bucket
[[r2_buckets]]
binding = "STORAGE"
bucket_name = "webbios-storage"

# Queues - Producer
[[queues.producers]]
binding = "QUEUE"
queue = "webbios-tasks"

# Queues - Consumer
[[queues.consumers]]
queue = "webbios-tasks"
max_batch_size = 10
max_batch_timeout = 30

# Cron Triggers
[triggers]
crons = [
  "0 0 * * *",    # Midnight: cleanup expired sessions
  "0 */6 * * *",  # Every 6 hours: sync inventory
  "0 1 * * 1"     # Monday 1 AM: weekly report
]

# Environment Variables (non-secret)
[vars]
WEBBIOS_VERSION = "1.0.0"
API_BASE_URL = "https://api.example.com"
CORS_ORIGIN = "https://dashboard.example.com"

# Secrets (set via wrangler secret put)
# JWT_SECRET
# JWT_REFRESH_SECRET
# ZALOPAY_APP_ID
# ZALOPAY_KEY1
# ZALOPAY_KEY2
# MOMO_PARTNER_CODE
# MOMO_ACCESS_KEY
# MOMO_SECRET_KEY
# SHOPEEPAY_CLIENT_ID
# SHOPEEPAY_SECRET_KEY
# GHN_TOKEN
# GHTK_TOKEN
# SPX_TOKEN
# VIETTELPOST_TOKEN
# AHAMOVE_TOKEN
```

### 7.2. Bindings Type Definition

```typescript
// packages/api/src/bindings.ts

export interface Env {
  // Cloudflare Bindings
  DB: D1Database;
  KV: KVNamespace;
  STORAGE: R2Bucket;
  QUEUE: Queue;

  // App Config
  WEBBIOS_VERSION: string;
  API_BASE_URL: string;
  CORS_ORIGIN: string;

  // Auth Secrets
  JWT_SECRET: string;
  JWT_REFRESH_SECRET: string;

  // Payment Secrets
  ZALOPAY_APP_ID: string;
  ZALOPAY_KEY1: string;
  ZALOPAY_KEY2: string;
  MOMO_PARTNER_CODE: string;
  MOMO_ACCESS_KEY: string;
  MOMO_SECRET_KEY: string;
  SHOPEEPAY_CLIENT_ID: string;
  SHOPEEPAY_SECRET_KEY: string;

  // Shipping Secrets
  GHN_TOKEN: string;
  GHTK_TOKEN: string;
  SPX_TOKEN: string;
  VIETTELPOST_TOKEN: string;
  AHAMOVE_TOKEN: string;
}
```

### 7.3. API Entry Point

```typescript
// packages/api/src/index.ts

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { Env } from './bindings';

// Routes
import { authRoutes } from './routes/auth';
import { productRoutes } from './routes/products';
import { orderRoutes } from './routes/orders';
import { customerRoutes } from './routes/customers';
import { paymentRoutes } from './routes/payments';
import { shippingRoutes } from './routes/shipping';
import { mediaRoutes } from './routes/media';
import { settingsRoutes } from './routes/settings';
import { themeRoutes } from './routes/themes';
import { appRoutes } from './routes/apps';
import { reportRoutes } from './routes/reports';
import { storefrontRoutes } from './routes/storefront';
import { webhookRoutes } from './routes/webhooks';

// Middleware
import { errorHandler } from './middleware/error-handler';
import { rateLimiter } from './middleware/rate-limit';

const app = new Hono<{ Bindings: Env }>();

// Global middleware
app.use('*', logger());
app.use('*', errorHandler());
app.use('/api/*', cors({ origin: (origin) => origin }));
app.use('/api/*', rateLimiter());

// Health check
app.get('/health', (c) => c.json({
  status: 'ok',
  version: c.env.WEBBIOS_VERSION,
  timestamp: new Date().toISOString()
}));

// Admin API routes (require auth)
app.route('/api/auth', authRoutes);
app.route('/api/products', productRoutes);
app.route('/api/orders', orderRoutes);
app.route('/api/customers', customerRoutes);
app.route('/api/payments', paymentRoutes);
app.route('/api/shipping', shippingRoutes);
app.route('/api/media', mediaRoutes);
app.route('/api/settings', settingsRoutes);
app.route('/api/themes', themeRoutes);
app.route('/api/apps', appRoutes);
app.route('/api/reports', reportRoutes);
app.route('/api/webhooks', webhookRoutes);

// Public Storefront API (no auth required)
app.route('/api/storefront', storefrontRoutes);

export default app;
```

### 7.4. API Endpoints — Danh sách đầy đủ

#### 7.4.1. Authentication

| Method | Endpoint | Mô tả | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Đăng ký tài khoản (chỉ Owner) | Owner |
| POST | `/api/auth/login` | Đăng nhập | Public |
| POST | `/api/auth/refresh` | Làm mới access token | Public (với refresh token) |
| POST | `/api/auth/logout` | Đăng xuất | Auth |
| POST | `/api/auth/forgot-password` | Yêu cầu reset password | Public |
| POST | `/api/auth/reset-password` | Đặt lại mật khẩu | Public (với reset token) |
| GET | `/api/auth/me` | Lấy thông tin user hiện tại | Auth |
| PUT | `/api/auth/me` | Cập nhật thông tin user | Auth |
| PUT | `/api/auth/me/password` | Đổi mật khẩu | Auth |

#### 7.4.2. Products

| Method | Endpoint | Mô tả | Auth |
|---|---|---|---|
| GET | `/api/products` | Danh sách sản phẩm (có filter, sort, pagination) | Auth |
| GET | `/api/products/:id` | Chi tiết sản phẩm | Auth |
| POST | `/api/products` | Tạo sản phẩm mới | Admin+ |
| PUT | `/api/products/:id` | Cập nhật sản phẩm | Admin+ |
| DELETE | `/api/products/:id` | Xóa sản phẩm | Admin+ |
| POST | `/api/products/:id/images` | Upload ảnh sản phẩm | Admin+ |
| DELETE | `/api/products/:id/images/:imageId` | Xóa ảnh sản phẩm | Admin+ |
| PUT | `/api/products/:id/images/reorder` | Sắp xếp lại ảnh | Admin+ |
| GET | `/api/products/:id/variants` | Danh sách biến thể | Auth |
| POST | `/api/products/:id/variants` | Tạo biến thể | Admin+ |
| PUT | `/api/products/:id/variants/:variantId` | Cập nhật biến thể | Admin+ |
| DELETE | `/api/products/:id/variants/:variantId` | Xóa biến thể | Admin+ |
| PUT | `/api/products/:id/inventory` | Cập nhật tồn kho | Staff+ |
| POST | `/api/products/bulk-action` | Thao tác hàng loạt (ẩn, xóa, đổi giá) | Admin+ |
| GET | `/api/products/export` | Xuất CSV/Excel | Admin+ |
| POST | `/api/products/import` | Nhập CSV/Excel | Admin+ |

#### 7.4.3. Categories

| Method | Endpoint | Mô tả | Auth |
|---|---|---|---|
| GET | `/api/categories` | Danh sách danh mục (tree) | Auth |
| GET | `/api/categories/:id` | Chi tiết danh mục | Auth |
| POST | `/api/categories` | Tạo danh mục | Admin+ |
| PUT | `/api/categories/:id` | Cập nhật danh mục | Admin+ |
| DELETE | `/api/categories/:id` | Xóa danh mục | Admin+ |
| PUT | `/api/categories/reorder` | Sắp xếp lại danh mục | Admin+ |

#### 7.4.4. Orders

| Method | Endpoint | Mô tả | Auth |
|---|---|---|---|
| GET | `/api/orders` | Danh sách đơn hàng (filter, sort, pagination) | Staff+ |
| GET | `/api/orders/:id` | Chi tiết đơn hàng | Staff+ |
| POST | `/api/orders` | Tạo đơn hàng thủ công | Staff+ |
| PUT | `/api/orders/:id` | Cập nhật đơn hàng | Staff+ |
| PUT | `/api/orders/:id/status` | Thay đổi trạng thái đơn | Staff+ |
| POST | `/api/orders/:id/notes` | Thêm ghi chú | Staff+ |
| POST | `/api/orders/:id/refund` | Hoàn tiền | Admin+ |
| POST | `/api/orders/:id/cancel` | Hủy đơn | Staff+ |
| POST | `/api/orders/:id/fulfill` | Xác nhận giao hàng | Staff+ |
| POST | `/api/orders/:id/shipping-label` | Tạo vận đơn | Staff+ |
| GET | `/api/orders/:id/timeline` | Lịch sử thao tác | Staff+ |
| GET | `/api/orders/export` | Xuất CSV/Excel | Admin+ |

#### 7.4.5. Customers

| Method | Endpoint | Mô tả | Auth |
|---|---|---|---|
| GET | `/api/customers` | Danh sách khách hàng | Staff+ |
| GET | `/api/customers/:id` | Chi tiết khách hàng | Staff+ |
| POST | `/api/customers` | Tạo khách hàng | Staff+ |
| PUT | `/api/customers/:id` | Cập nhật khách hàng | Staff+ |
| DELETE | `/api/customers/:id` | Xóa khách hàng | Admin+ |
| GET | `/api/customers/:id/orders` | Đơn hàng của khách | Staff+ |
| GET | `/api/customers/:id/addresses` | Địa chỉ giao hàng | Staff+ |
| POST | `/api/customers/:id/addresses` | Thêm địa chỉ | Staff+ |
| PUT | `/api/customers/:id/addresses/:addrId` | Cập nhật địa chỉ | Staff+ |
| DELETE | `/api/customers/:id/addresses/:addrId` | Xóa địa chỉ | Staff+ |
| POST | `/api/customers/:id/tags` | Gắn tag | Staff+ |
| GET | `/api/customers/export` | Xuất CSV/Excel | Admin+ |

#### 7.4.6. Payments

| Method | Endpoint | Mô tả | Auth |
|---|---|---|---|
| GET | `/api/payments/methods` | Danh sách phương thức thanh toán | Auth |
| PUT | `/api/payments/methods/:id` | Cập nhật cấu hình phương thức | Admin+ |
| POST | `/api/payments/methods/:id/toggle` | Bật/tắt phương thức | Admin+ |
| POST | `/api/payments/create` | Tạo giao dịch thanh toán | Public (storefront) |
| GET | `/api/payments/:id/status` | Kiểm tra trạng thái thanh toán | Auth |
| POST | `/api/payments/callback/:provider` | Callback từ payment gateway | Public (webhook) |

#### 7.4.7. Shipping

| Method | Endpoint | Mô tả | Auth |
|---|---|---|---|
| GET | `/api/shipping/providers` | Danh sách đơn vị vận chuyển | Auth |
| PUT | `/api/shipping/providers/:id` | Cập nhật cấu hình đơn vị | Admin+ |
| POST | `/api/shipping/providers/:id/toggle` | Bật/tắt đơn vị | Admin+ |
| POST | `/api/shipping/calculate` | Tính phí vận chuyển | Public |
| POST | `/api/shipping/create-order` | Tạo đơn vận chuyển | Staff+ |
| GET | `/api/shipping/:id/tracking` | Theo dõi vận chuyển | Staff+ |
| POST | `/api/shipping/:id/cancel` | Hủy đơn vận chuyển | Staff+ |

#### 7.4.8. Media (File Management)

| Method | Endpoint | Mô tả | Auth |
|---|---|---|---|
| GET | `/api/media` | Danh sách file (R2) | Auth |
| POST | `/api/media/upload` | Upload file | Admin+ |
| DELETE | `/api/media/:id` | Xóa file | Admin+ |
| GET | `/api/media/:id/url` | Lấy public URL | Auth |

#### 7.4.9. Settings

| Method | Endpoint | Mô tả | Auth |
|---|---|---|---|
| GET | `/api/settings` | Lấy toàn bộ cài đặt | Auth |
| PUT | `/api/settings` | Cập nhật cài đặt | Admin+ |
| GET | `/api/settings/shop` | Thông tin shop | Auth |
| PUT | `/api/settings/shop` | Cập nhật thông tin shop | Admin+ |
| GET | `/api/settings/domains` | Danh sách domain | Admin+ |
| POST | `/api/settings/domains` | Thêm custom domain | Owner |
| DELETE | `/api/settings/domains/:id` | Xóa custom domain | Owner |

#### 7.4.10. Themes

| Method | Endpoint | Mô tả | Auth |
|---|---|---|---|
| GET | `/api/themes` | Danh sách theme đã cài | Auth |
| GET | `/api/themes/active` | Theme đang sử dụng | Auth |
| POST | `/api/themes/install` | Cài theme từ marketplace | Admin+ |
| PUT | `/api/themes/:id/activate` | Kích hoạt theme | Admin+ |
| DELETE | `/api/themes/:id` | Gỡ cài theme | Admin+ |
| GET | `/api/themes/:id/config` | Lấy cấu hình theme | Admin+ |
| PUT | `/api/themes/:id/config` | Cập nhật cấu hình theme | Admin+ |

#### 7.4.11. Apps

| Method | Endpoint | Mô tả | Auth |
|---|---|---|---|
| GET | `/api/apps` | Danh sách app đã cài | Auth |
| POST | `/api/apps/install` | Cài app từ marketplace | Admin+ |
| DELETE | `/api/apps/:id` | Gỡ cài app | Admin+ |
| GET | `/api/apps/:id/config` | Lấy cấu hình app | Admin+ |
| PUT | `/api/apps/:id/config` | Cập nhật cấu hình app | Admin+ |
| POST | `/api/apps/:id/toggle` | Bật/tắt app | Admin+ |

#### 7.4.12. Reports

| Method | Endpoint | Mô tả | Auth |
|---|---|---|---|
| GET | `/api/reports/overview` | Tổng quan (doanh thu, đơn, khách) | Auth |
| GET | `/api/reports/sales` | Báo cáo doanh thu | Auth |
| GET | `/api/reports/products` | Báo cáo sản phẩm bán chạy | Auth |
| GET | `/api/reports/customers` | Báo cáo khách hàng | Auth |
| GET | `/api/reports/traffic` | Báo cáo lượt truy cập | Auth |

#### 7.4.13. System / Version

| Method | Endpoint | Mô tả | Auth |
|---|---|---|---|
| GET | `/api/system/version` | Phiên bản hiện tại | Auth |
| GET | `/api/system/check-update` | Kiểm tra bản cập nhật | Admin+ |
| POST | `/api/system/update` | Thực hiện cập nhật | Owner |
| GET | `/api/system/info` | Thông tin hệ thống | Admin+ |

#### 7.4.14. Users / Team

| Method | Endpoint | Mô tả | Auth |
|---|---|---|---|
| GET | `/api/users` | Danh sách thành viên | Admin+ |
| POST | `/api/users/invite` | Mời thành viên mới | Admin+ |
| PUT | `/api/users/:id/role` | Thay đổi role | Owner |
| DELETE | `/api/users/:id` | Xóa thành viên | Owner |

#### 7.4.15. Discounts / Coupons

| Method | Endpoint | Mô tả | Auth |
|---|---|---|---|
| GET | `/api/discounts` | Danh sách mã giảm giá | Auth |
| GET | `/api/discounts/:id` | Chi tiết mã giảm giá | Auth |
| POST | `/api/discounts` | Tạo mã giảm giá | Admin+ |
| PUT | `/api/discounts/:id` | Cập nhật mã | Admin+ |
| DELETE | `/api/discounts/:id` | Xóa mã | Admin+ |
| POST | `/api/discounts/validate` | Validate mã (cho checkout) | Public |

#### 7.4.16. Storefront Public API (không cần auth admin)

| Method | Endpoint | Mô tả | Auth |
|---|---|---|---|
| GET | `/api/storefront/shop` | Thông tin shop | Public |
| GET | `/api/storefront/products` | Danh sách sản phẩm | Public |
| GET | `/api/storefront/products/:slug` | Chi tiết sản phẩm (by slug) | Public |
| GET | `/api/storefront/categories` | Danh sách danh mục | Public |
| GET | `/api/storefront/categories/:slug` | Sản phẩm theo danh mục | Public |
| GET | `/api/storefront/search` | Tìm kiếm sản phẩm | Public |
| POST | `/api/storefront/cart` | Tạo/cập nhật giỏ hàng | Public |
| GET | `/api/storefront/cart/:cartId` | Lấy giỏ hàng | Public |
| POST | `/api/storefront/checkout` | Tạo đơn checkout | Public |
| POST | `/api/storefront/customer/register` | Đăng ký tài khoản khách | Public |
| POST | `/api/storefront/customer/login` | Đăng nhập khách | Public |
| GET | `/api/storefront/customer/orders` | Đơn hàng của khách | Customer Auth |
| GET | `/api/storefront/pages/:slug` | Trang tĩnh (about, policy...) | Public |

### 7.5. API Response Format

Mọi API response đều tuân theo format thống nhất:

```typescript
// Success Response
{
  "success": true,
  "data": { ... },
  "meta": {                    // Chỉ có khi pagination
    "page": 1,
    "perPage": 20,
    "total": 150,
    "totalPages": 8
  }
}

// Error Response
{
  "success": false,
  "error": {
    "code": "PRODUCT_NOT_FOUND",     // Machine-readable
    "message": "Không tìm thấy sản phẩm",  // Human-readable (i18n)
    "details": { ... }               // Optional: validation errors, etc.
  }
}
```

### 7.6. Query Parameters Convention

```
GET /api/products?page=1&perPage=20&sort=-createdAt&status=active&search=áo

Pagination: page, perPage
Sorting:    sort=field (ASC) hoặc sort=-field (DESC)
Filtering:  field=value
Search:     search=keyword
Date range: from=2026-01-01&to=2026-06-01
```

---

## 8. Dashboard quản trị

### 8.1. WebbiOS Design Language (WDL)

WebbiOS sử dụng ngôn ngữ thiết kế riêng (**WDL**), xây dựng hoàn toàn từ **Tailwind CSS** tùy chỉnh (không sử dụng Ant Design, MUI, hay thư viện giao diện bên ngoài) để tạo điểm nhấn khác biệt:
- **Sạch sẽ & Thoáng đãng:** Nền trắng/xám nhạt, sử dụng nhiều whitespace, font chữ Inter compact (14px).
- **Mượt mà:** Micro-animations (150ms-200ms) cho các thao tác di chuột, click, chuyển trang.
- **Thống nhất (Consistent):** Mọi UI element (Button, Table, Form, Card) đều kế thừa từ base tokens của Tailwind config.

### 8.2. Layout chính

```
┌──────────────────────────────────────────────────────────┐
│  ┌──────────┐  WebbiOS Dashboard              👤 Admin ▾ │
│  │          │──────────────────────────────────────────── │
│  │ Sidebar  │                                            │
│  │          │  Main Content Area                         │
│  │ 📊 Tổng  │  ┌──────────────────────────────────────┐  │
│  │    quan  │  │                                      │  │
│  │ 📦 Sản   │  │  Page content renders here           │  │
│  │    phẩm  │  │                                      │  │
│  │ 📋 Đơn   │  │                                      │  │
│  │    hàng  │  │                                      │  │
│  │ 💼 CRM   │  │  (Menu tự động ẩn/hiện tùy thuộc      │  │
│  │ 🏢 Kho   │  │   vào Module ERP nào đang kích hoạt)  │  │
│  │ ⚙️ Cài   │  │                                      │  │
│  │    đặt   │  │                                      │  │
│  └──────────┘  └──────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

### 8.3. Dashboard Routes & State Management

Sử dụng React Router 7.x cho SPA routing.
- **Zustand** quản lý global UI state (auth, preferences).
- **TanStack Query (React Query)** quản lý server state (fetching, caching, mutation).

## 9. Storefront (Universal Storefront & Slot System)

### 9.1. Kiến trúc Universal Storefront

WebbiOS từ bỏ mô hình "mỗi theme là một React App phải deploy riêng" để chuyển sang **Universal Storefront**.
- Storefront là **MỘT** ứng dụng React duy nhất được deploy sẵn.
- Nó hoạt động như một "Engine" render động dựa trên cấu hình.
- Lợi ích: **Không cần rebuild / redeploy khi đổi theme hoặc cài app.** Khách hàng doanh nghiệp SMB không cần bận tâm về kỹ thuật.

### 9.2. Storefront Slot System (Thay thế Liquid)

Để cho phép Apps chèn vào Storefront linh hoạt mà vẫn an toàn (không bị phá layout như Liquid), WebbiOS cung cấp hệ thống **Slot**:
- Giao diện có sẵn khoảng 30+ Slot cố định (ví dụ: `product.before-title`, `product.after-description`, `global.footer-bottom`).
- Apps khai báo trong `app.json` muốn chèn component nào vào slot nào.
- Admin có thể vào Dashboard thay đổi vị trí slot của App bằng thao tác chọn Dropdown đơn giản (không cần copy code snippet).
- `SlotRenderer` sẽ tự động đọc danh sách app đang active từ KV cache và render các widget tương ứng theo priority.

### 9.3. Tối ưu tải App Script

Các App UI Widget được gộp thành một bundle file duy nhất (`app-bundle.js`) và upload lên R2 (được CDN cache). Storefront chỉ cần load 1 request tĩnh duy nhất dù shop có cài bao nhiêu App, đảm bảo hiệu năng tải trang ~0ms từ lần 2.

## 10. Database Schema (D1)

### 10.1. Entity-Relationship Diagram

```
┌──────────┐     ┌──────────────┐     ┌──────────────┐
│  users   │     │   products   │     │  categories  │
│──────────│     │──────────────│     │──────────────│
│ id       │     │ id           │     │ id           │
│ email    │     │ title        │     │ name         │
│ password │     │ slug         │     │ slug         │
│ name     │     │ description  │     │ parentId     │
│ role     │     │ price        │     │ position     │
│ ...      │     │ comparePrice │     │ image        │
└──────────┘     │ costPrice    │     │ ...          │
                 │ categoryId ──│────▶│              │
                 │ status       │     └──────────────┘
                 │ ...          │
                 └──────┬───────┘
                        │
              ┌─────────┼──────────┐
              ▼                    ▼
    ┌──────────────┐     ┌──────────────┐
    │   variants   │     │product_images│
    │──────────────│     │──────────────│
    │ id           │     │ id           │
    │ productId    │     │ productId    │
    │ title        │     │ url          │
    │ sku          │     │ alt          │
    │ price        │     │ position     │
    │ stock        │     │ ...          │
    │ options      │     └──────────────┘
    │ ...          │
    └──────────────┘

┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   orders     │     │ order_items  │     │  customers   │
│──────────────│     │──────────────│     │──────────────│
│ id           │     │ id           │     │ id           │
│ orderNumber  │     │ orderId   ───│────▶│ email        │
│ customerId ──│────▶│ productId    │     │ phone        │
│ status       │     │ variantId    │     │ firstName    │
│ subtotal     │     │ title        │     │ lastName     │
│ discount     │     │ price        │     │ ...          │
│ shippingFee  │     │ quantity     │     └──────┬───────┘
│ total        │     │ ...          │            │
│ paymentMethod│     └──────────────┘     ┌──────┴───────┐
│ paymentStatus│                          │  addresses   │
│ shippingMethod                          │──────────────│
│ note         │                          │ id           │
│ ...          │                          │ customerId   │
└──────────────┘                          │ address      │
                                          │ city         │
┌──────────────┐     ┌──────────────┐     │ district     │
│  discounts   │     │   settings   │     │ ward         │
│──────────────│     │──────────────│     │ phone        │
│ id           │     │ key          │     │ isDefault    │
│ code         │     │ value (JSON) │     │ ...          │
│ type         │     │ group        │     └──────────────┘
│ value        │     │ ...          │
│ minOrder     │     └──────────────┘
│ maxUses      │
│ usedCount    │     ┌──────────────┐
│ startDate    │     │  installed   │
│ endDate      │     │    _apps     │
│ ...          │     │──────────────│
└──────────────┘     │ id           │
                     │ appId        │
┌──────────────┐     │ name         │
│   themes     │     │ version      │
│──────────────│     │ config (JSON)│
│ id           │     │ enabled      │
│ name         │     │ ...          │
│ version      │     └──────────────┘
│ config (JSON)│
│ isActive     │     ┌──────────────┐
│ ...          │     │   sessions   │
└──────────────┘     │──────────────│
                     │ id           │
┌──────────────┐     │ userId       │
│   payments   │     │ token        │
│──────────────│     │ expiresAt    │
│ id           │     │ ...          │
│ orderId      │     └──────────────┘
│ provider     │
│ transactionId│     ┌──────────────┐
│ amount       │     │  event_log   │
│ status       │     │──────────────│
│ rawData(JSON)│     │ id           │
│ ...          │     │ eventType    │
└──────────────┘     │ entityType   │
                     │ entityId     │
                     │ userId       │
                     │ data (JSON)  │
                     │ createdAt    │
                     └──────────────┘
```

### 10.2. Bảng chi tiết

#### users

```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,            -- ULID
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'staff',  -- owner, admin, staff, viewer
  avatar_url TEXT,
  is_active INTEGER NOT NULL DEFAULT 1,
  last_login_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
```

#### products

```sql
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  short_description TEXT,
  price REAL NOT NULL DEFAULT 0,
  compare_at_price REAL,           -- Giá gốc (để hiện giảm giá)
  cost_price REAL,                  -- Giá vốn
  category_id TEXT REFERENCES categories(id),
  status TEXT NOT NULL DEFAULT 'draft',  -- draft, active, archived
  has_variants INTEGER NOT NULL DEFAULT 0,
  track_inventory INTEGER NOT NULL DEFAULT 1,
  stock INTEGER NOT NULL DEFAULT 0,
  low_stock_threshold INTEGER DEFAULT 5,
  weight REAL,                      -- Gram
  sku TEXT,
  barcode TEXT,
  seo_title TEXT,
  seo_description TEXT,
  tags TEXT,                        -- JSON array: ["tag1", "tag2"]
  metadata TEXT,                    -- JSON: custom fields
  published_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_created ON products(created_at);
```

#### product_variants

```sql
CREATE TABLE product_variants (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  title TEXT NOT NULL,              -- "Đỏ / XL"
  sku TEXT,
  barcode TEXT,
  price REAL NOT NULL,
  compare_at_price REAL,
  cost_price REAL,
  stock INTEGER NOT NULL DEFAULT 0,
  weight REAL,
  option1_name TEXT,                -- "Màu sắc"
  option1_value TEXT,               -- "Đỏ"
  option2_name TEXT,                -- "Size"
  option2_value TEXT,               -- "XL"
  option3_name TEXT,
  option3_value TEXT,
  image_url TEXT,
  position INTEGER NOT NULL DEFAULT 0,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_variants_product ON product_variants(product_id);
```

#### product_images

```sql
CREATE TABLE product_images (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,                -- R2 URL
  alt TEXT,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_images_product ON product_images(product_id);
```

#### categories

```sql
CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  parent_id TEXT REFERENCES categories(id),
  image_url TEXT,
  position INTEGER NOT NULL DEFAULT 0,
  is_active INTEGER NOT NULL DEFAULT 1,
  seo_title TEXT,
  seo_description TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_categories_parent ON categories(parent_id);
CREATE INDEX idx_categories_slug ON categories(slug);
```

#### customers

```sql
CREATE TABLE customers (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE,
  phone TEXT,
  password_hash TEXT,               -- Cho customer login (storefront)
  first_name TEXT,
  last_name TEXT,
  full_name TEXT,
  gender TEXT,                      -- male, female, other
  date_of_birth TEXT,
  tags TEXT,                        -- JSON array
  note TEXT,
  total_orders INTEGER NOT NULL DEFAULT 0,
  total_spent REAL NOT NULL DEFAULT 0,
  accepts_marketing INTEGER NOT NULL DEFAULT 0,
  is_active INTEGER NOT NULL DEFAULT 1,
  last_order_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_phone ON customers(phone);
```

#### customer_addresses

```sql
CREATE TABLE customer_addresses (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  ward TEXT,
  district TEXT,
  city TEXT NOT NULL,
  province_code TEXT,
  district_code TEXT,
  ward_code TEXT,
  country TEXT NOT NULL DEFAULT 'VN',
  is_default INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_addresses_customer ON customer_addresses(customer_id);
```

#### orders

```sql
CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,  -- Auto-increment: #1001, #1002...
  customer_id TEXT REFERENCES customers(id),
  
  -- Status
  status TEXT NOT NULL DEFAULT 'pending',
    -- pending, confirmed, processing, shipped, delivered, completed,
    -- cancelled, refunded
  
  -- Amounts
  subtotal REAL NOT NULL DEFAULT 0,
  discount_amount REAL NOT NULL DEFAULT 0,
  shipping_fee REAL NOT NULL DEFAULT 0,
  tax_amount REAL NOT NULL DEFAULT 0,
  total REAL NOT NULL DEFAULT 0,
  
  -- Payment
  payment_method TEXT,              -- zalopay, momo, shopeepay, cod, bank_transfer
  payment_status TEXT NOT NULL DEFAULT 'unpaid',  -- unpaid, paid, refunded, partial_refund
  payment_id TEXT,                  -- Reference to payments table
  
  -- Shipping
  shipping_method TEXT,             -- ghn, ghtk, spx, viettelpost, ahamove
  shipping_tracking_number TEXT,
  shipping_status TEXT,             -- pending, picked, in_transit, delivered, returned
  
  -- Customer Info (snapshot tại thời điểm đặt hàng)
  shipping_name TEXT,
  shipping_phone TEXT,
  shipping_address TEXT,
  shipping_ward TEXT,
  shipping_district TEXT,
  shipping_city TEXT,
  
  -- Discount
  discount_code TEXT,
  discount_id TEXT REFERENCES discounts(id),
  
  -- Note
  customer_note TEXT,               -- Ghi chú của khách
  staff_note TEXT,                  -- Ghi chú nội bộ
  cancel_reason TEXT,
  
  -- Metadata
  source TEXT DEFAULT 'web',        -- web, mobile, manual, api
  ip_address TEXT,
  user_agent TEXT,
  
  confirmed_at TEXT,
  shipped_at TEXT,
  delivered_at TEXT,
  completed_at TEXT,
  cancelled_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_orders_created ON orders(created_at);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
```

#### order_items

```sql
CREATE TABLE order_items (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT REFERENCES products(id),
  variant_id TEXT REFERENCES product_variants(id),
  
  -- Snapshot (giữ nguyên thông tin tại thời điểm đặt hàng)
  title TEXT NOT NULL,
  variant_title TEXT,
  sku TEXT,
  image_url TEXT,
  price REAL NOT NULL,
  compare_at_price REAL,
  quantity INTEGER NOT NULL DEFAULT 1,
  total REAL NOT NULL,              -- price * quantity
  weight REAL,
  
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_order_items_order ON order_items(order_id);
```

#### payments

```sql
CREATE TABLE payments (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES orders(id),
  provider TEXT NOT NULL,           -- zalopay, momo, shopeepay, cod, bank_transfer
  transaction_id TEXT,              -- ID từ payment gateway
  amount REAL NOT NULL,
  currency TEXT NOT NULL DEFAULT 'VND',
  status TEXT NOT NULL DEFAULT 'pending',  -- pending, processing, completed, failed, refunded
  raw_request TEXT,                 -- JSON: request gửi đi
  raw_response TEXT,                -- JSON: response nhận về
  callback_data TEXT,               -- JSON: callback data
  paid_at TEXT,
  refunded_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_payments_order ON payments(order_id);
CREATE INDEX idx_payments_transaction ON payments(transaction_id);
```

#### discounts

```sql
CREATE TABLE discounts (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  title TEXT,
  description TEXT,
  type TEXT NOT NULL,               -- percentage, fixed_amount, free_shipping
  value REAL NOT NULL,              -- 10 (= 10% hoặc 10,000 VND tùy type)
  min_order_amount REAL,            -- Đơn tối thiểu
  max_discount_amount REAL,         -- Giảm tối đa (cho percentage)
  max_uses INTEGER,                 -- Tổng số lần dùng tối đa
  max_uses_per_customer INTEGER,    -- Số lần/khách
  used_count INTEGER NOT NULL DEFAULT 0,
  applies_to TEXT DEFAULT 'all',    -- all, specific_products, specific_categories
  product_ids TEXT,                 -- JSON array (nếu applies_to = specific_products)
  category_ids TEXT,                -- JSON array (nếu applies_to = specific_categories)
  start_date TEXT,
  end_date TEXT,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_discounts_code ON discounts(code);
```

#### settings

```sql
CREATE TABLE settings (
  key TEXT PRIMARY KEY,             -- e.g., 'shop.name', 'payment.zalopay.enabled'
  value TEXT NOT NULL,              -- JSON value
  group_name TEXT NOT NULL,         -- shop, payment, shipping, theme, system
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_settings_group ON settings(group_name);
```

#### installed_themes

```sql
CREATE TABLE installed_themes (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  version TEXT NOT NULL,
  author TEXT,
  description TEXT,
  thumbnail_url TEXT,
  config TEXT,                      -- JSON: theme configuration
  is_active INTEGER NOT NULL DEFAULT 0,  -- Chỉ 1 theme active
  installed_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
```

#### installed_apps

```sql
CREATE TABLE installed_apps (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  version TEXT NOT NULL,
  author TEXT,
  description TEXT,
  icon_url TEXT,
  config TEXT,                      -- JSON: app configuration
  permissions TEXT,                 -- JSON: requested permissions
  hooks TEXT,                       -- JSON: registered event hooks
  is_enabled INTEGER NOT NULL DEFAULT 1,
  installed_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
```

#### event_log

```sql
CREATE TABLE event_log (
  id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,         -- order.created, product.updated, ...
  entity_type TEXT,                 -- order, product, customer
  entity_id TEXT,
  user_id TEXT,                     -- Ai thực hiện
  data TEXT,                        -- JSON: event data
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_events_type ON event_log(event_type);
CREATE INDEX idx_events_entity ON event_log(entity_type, entity_id);
CREATE INDEX idx_events_created ON event_log(created_at);
```

#### sessions (refresh tokens)

```sql
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  refresh_token TEXT NOT NULL UNIQUE,
  user_agent TEXT,
  ip_address TEXT,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_sessions_user ON sessions(user_id);
CREATE INDEX idx_sessions_token ON sessions(refresh_token);
```

#### pages (trang tĩnh)

```sql
CREATE TABLE pages (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT,                     -- HTML content
  seo_title TEXT,
  seo_description TEXT,
  is_published INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
```

---

## 11. Authentication & Authorization

### 11.1. Auth Flow

```
┌──────────────────────────────────────────────────────────────┐
│                      Authentication Flow                      │
│                                                               │
│  ┌─────────┐    POST /api/auth/login     ┌───────────────┐   │
│  │Dashboard│ ──────────────────────────▶ │  Hono Worker   │   │
│  │ (SPA)   │    { email, password }      │                │   │
│  └────┬────┘                             │ 1. Find user   │   │
│       │                                  │    in D1       │   │
│       │                                  │ 2. Verify      │   │
│       │                                  │    password    │   │
│       │                                  │    (PBKDF2)    │   │
│       │                                  │ 3. Generate    │   │
│       │    { accessToken, refreshToken } │    JWT tokens  │   │
│       │ ◀──────────────────────────────  │ 4. Save refresh│   │
│       │                                  │    in D1       │   │
│       ▼                                  └───────────────┘   │
│  localStorage:                                                │
│  - accessToken (15 min TTL)                                   │
│  - refreshToken (7 day TTL)                                   │
│                                                               │
│  ┌─────────┐    GET /api/products        ┌───────────────┐   │
│  │Dashboard│ ──────────────────────────▶ │  Auth          │   │
│  │         │    Authorization:           │  Middleware     │   │
│  │         │    Bearer <accessToken>     │                │   │
│  └────┬────┘                             │ 1. Extract JWT │   │
│       │                                  │ 2. Verify sig  │   │
│       │                                  │    (WebCrypto) │   │
│       │    { products: [...] }           │ 3. Check exp   │   │
│       │ ◀──────────────────────────────  │ 4. Attach user │   │
│       │                                  │    to context  │   │
│       ▼                                  └───────────────┘   │
│  Render products in UI                                        │
│                                                               │
│  Token Expired?                                               │
│  ┌─────────┐    POST /api/auth/refresh   ┌───────────────┐   │
│  │Dashboard│ ──────────────────────────▶ │  Refresh Flow  │   │
│  │         │    { refreshToken }         │                │   │
│  └────┬────┘                             │ 1. Verify      │   │
│       │                                  │    refresh     │   │
│       │    { newAccessToken }            │    token in D1 │   │
│       │ ◀──────────────────────────────  │ 2. Generate    │   │
│       │                                  │    new access  │   │
│       ▼                                  │    token       │   │
│  Update localStorage                     └───────────────┘   │
└──────────────────────────────────────────────────────────────┘
```

### 11.2. JWT Structure

```typescript
// Access Token (15 phút)
{
  "sub": "user_01HXXXXXX",       // User ID
  "email": "admin@shop.com",
  "name": "Admin",
  "role": "owner",               // owner | admin | staff | viewer
  "iat": 1717340400,
  "exp": 1717341300              // +15 phút
}

// Refresh Token (7 ngày)
{
  "sub": "user_01HXXXXXX",
  "type": "refresh",
  "jti": "session_01HXXXXXX",   // Session ID (để revoke)
  "iat": 1717340400,
  "exp": 1717944300              // +7 ngày
}
```

### 11.3. Password Hashing

Sử dụng **PBKDF2** qua Web Crypto API (native trong CF Workers):

- Algorithm: PBKDF2
- Hash function: SHA-256
- Iterations: 100,000
- Salt: 16 bytes random
- Key length: 256 bits
- Storage format: `base64(salt):base64(hash)`

### 11.4. RBAC (Role-Based Access Control)

```typescript
// Permission Matrix

const PERMISSIONS = {
  // Products
  'products.view':     ['owner', 'admin', 'staff', 'viewer'],
  'products.create':   ['owner', 'admin'],
  'products.edit':     ['owner', 'admin'],
  'products.delete':   ['owner', 'admin'],
  
  // Orders
  'orders.view':       ['owner', 'admin', 'staff', 'viewer'],
  'orders.process':    ['owner', 'admin', 'staff'],
  'orders.cancel':     ['owner', 'admin', 'staff'],
  'orders.refund':     ['owner', 'admin'],
  
  // Customers
  'customers.view':    ['owner', 'admin', 'staff', 'viewer'],
  'customers.edit':    ['owner', 'admin', 'staff'],
  'customers.delete':  ['owner', 'admin'],
  
  // Settings
  'settings.view':     ['owner', 'admin'],
  'settings.edit':     ['owner', 'admin'],
  
  // Users / Team
  'users.view':        ['owner', 'admin'],
  'users.invite':      ['owner', 'admin'],
  'users.edit':        ['owner'],
  'users.delete':      ['owner'],
  
  // System
  'system.update':     ['owner'],
  'system.apps':       ['owner', 'admin'],
  'system.themes':     ['owner', 'admin'],
  
  // Reports
  'reports.view':      ['owner', 'admin', 'viewer'],
  'reports.export':    ['owner', 'admin'],
};
```

---

## 12. Quản lý sản phẩm

### 12.1. Tính năng

| Tính năng | Mô tả | Ưu tiên |
|---|---|---|
| Thêm/sửa/xóa sản phẩm | CRUD cơ bản | P0 |
| Biến thể (variants) | Size, màu, chất liệu — tối đa 3 options, 100 variants | P0 |
| Quản lý ảnh | Upload nhiều ảnh, kéo thả sắp xếp, crop | P0 |
| Danh mục | Cây danh mục nhiều cấp | P0 |
| Quản lý tồn kho | Track stock, cảnh báo sắp hết | P0 |
| SEO | Custom title, description, slug | P0 |
| Trạng thái | Draft / Active / Archived | P0 |
| Tags | Gắn nhãn tùy ý | P1 |
| Import/Export CSV | Nhập/xuất hàng loạt | P1 |
| Bulk actions | Thao tác nhiều sản phẩm cùng lúc | P1 |
| Sản phẩm kỹ thuật số | Download link sau thanh toán | P2 |

### 12.2. Product Status Flow

```
            ┌──────┐
            │ Draft │ ◀── Tạo mới
            └──┬───┘
               │ Publish
               ▼
           ┌────────┐
     ┌─────│ Active │─────┐
     │     └────────┘     │
     │ Archive        Unpublish
     ▼                    ▼
┌──────────┐         ┌──────┐
│ Archived │         │ Draft│
└──────────┘         └──────┘
```

### 12.3. Upload ảnh lên R2

```
Dashboard ──▶ POST /api/media/upload
                    │
                    ▼
            Hono Worker:
            1. Validate file (type, size)
            2. Generate unique filename
            3. Resize/optimize (Workers Image Resizing)
            4. Upload to R2 bucket
            5. Return public URL
                    │
                    ▼
            R2: /products/abc123_800x800.webp
                    │
                    ▼
            CDN URL: https://cdn.shop.com/products/abc123_800x800.webp
```

### 12.4. Inventory Tracking

- Track tồn kho tự động khi đơn hàng được tạo/hủy
- Cảnh báo khi stock <= `low_stock_threshold`
- Hỗ trợ cập nhật hàng loạt
- Không cho phép mua khi stock = 0 (configurable)

---

## 13. Quản lý đơn hàng

### 13.1. Order Status Flow

```
  ┌─────────┐     ┌───────────┐     ┌────────────┐
  │ Pending  │────▶│ Confirmed │────▶│ Processing │
  └────┬────┘     └───────────┘     └─────┬──────┘
       │                                   │
       │ Cancel                      Ship  │
       ▼                                   ▼
  ┌───────────┐                     ┌──────────┐
  │ Cancelled │                     │ Shipped  │
  └───────────┘                     └────┬─────┘
                                         │
                                   Deliver│
                                         ▼
                                  ┌───────────┐
                                  │ Delivered  │
                                  └─────┬─────┘
                                        │
                                  Complete│
                                        ▼
                              ┌────────────┐
                              │ Completed  │
                              └─────┬──────┘
                                    │
                              Refund│
                                    ▼
                              ┌──────────┐
                              │ Refunded │
                              └──────────┘
```

### 13.2. Order Number Format

```
#1001, #1002, #1003, ...

Bắt đầu từ 1001 (có thể cấu hình).
Tự động tăng dần.
Unique trong phạm vi 1 shop.
```

### 13.3. Checkout Flow (Storefront)

```
1. Khách thêm sản phẩm vào giỏ hàng
2. Khách nhấn "Thanh toán"
3. Nhập thông tin giao hàng (hoặc chọn địa chỉ có sẵn)
4. Chọn phương thức vận chuyển → Tính phí ship
5. Nhập mã giảm giá (nếu có) → Validate + tính lại tổng
6. Chọn phương thức thanh toán
7. Xác nhận đơn hàng
8. Redirect tới payment gateway (nếu không phải COD)
9. Payment callback → cập nhật payment_status
10. Hiển thị trang "Đặt hàng thành công"
11. Event: order.created → gửi email/notification
```

### 13.4. Tính năng đơn hàng

| Tính năng | Mô tả | Ưu tiên |
|---|---|---|
| Danh sách đơn hàng | Filter theo status, date, search | P0 |
| Chi tiết đơn hàng | Thông tin đầy đủ, timeline | P0 |
| Xử lý đơn | Xác nhận, giao hàng, hoàn thành | P0 |
| Hủy đơn | Với lý do, hoàn stock | P0 |
| Hoàn tiền | Full/partial refund | P1 |
| In hóa đơn | PDF invoice | P1 |
| Tạo đơn thủ công | Admin tạo đơn (POS-like) | P1 |
| Timeline/Activity log | Lịch sử mọi thao tác | P0 |
| Ghi chú nội bộ | Staff notes | P0 |
| Export | Xuất CSV/Excel | P1 |

---

## 14. Quản lý khách hàng

### 14.1. Tính năng

| Tính năng | Mô tả | Ưu tiên |
|---|---|---|
| Danh sách khách hàng | Search, filter, sort | P0 |
| Chi tiết khách hàng | Thông tin + lịch sử mua hàng | P0 |
| Nhiều địa chỉ | Khách lưu nhiều địa chỉ giao hàng | P0 |
| Tags | Phân loại khách (VIP, Wholesale...) | P1 |
| Customer accounts | Khách tự đăng ký/đăng nhập trên storefront | P1 |
| Import/Export | CSV/Excel | P1 |
| Thống kê khách | Tổng đơn, tổng chi tiêu, đơn gần nhất | P0 |

### 14.2. Customer vs User

- **User** = thành viên quản trị (admin, staff) — đăng nhập Dashboard
- **Customer** = khách hàng mua hàng — đăng nhập Storefront (optional)

Hai bảng riêng biệt, auth riêng biệt.

---

## 15. Tích hợp thanh toán

### 15.1. Các cổng thanh toán

| Cổng | Loại | Ưu tiên | Ghi chú |
|---|---|---|---|
| **COD** | Thanh toán khi nhận hàng | P0 | Không cần tích hợp API |
| **Bank Transfer** | Chuyển khoản ngân hàng | P0 | Hiển thị thông tin tài khoản, xác nhận thủ công |
| **ZaloPay** | E-wallet | P0 | API: zalopay.vn |
| **MoMo** | E-wallet | P0 | API: momo.vn |
| **ShopeePay** | E-wallet | P0 | API: shopeepay.vn |

### 15.2. Payment Flow

```
┌──────────┐     ┌──────────────┐     ┌──────────────┐
│Storefront│────▶│ WebbiOS API  │────▶│Payment Gateway│
│Checkout  │     │              │     │(ZaloPay/MoMo) │
└──────────┘     │ 1.Create     │     │               │
                 │   payment    │     │ 2.Return      │
                 │   record     │     │   payment URL │
                 │              │◀────│               │
                 └──────┬───────┘     └───────┬───────┘
                        │                     │
                        │ 3.Redirect          │
                        │    customer         │
                        ▼                     │
                 ┌──────────────┐             │
                 │ Payment Page │             │
                 │ (Gateway UI) │             │
                 └──────┬───────┘             │
                        │ 4.Customer pays     │
                        ▼                     │
                 ┌──────────────┐             │
                 │ Gateway      │ 5.Callback  │
                 │ processes    │────────────▶│
                 └──────────────┘     ┌───────┴───────┐
                                      │ WebbiOS API   │
                                      │ /callback     │
                                      │               │
                                      │ 6.Verify sig  │
                                      │ 7.Update order│
                                      │ 8.Emit event  │
                                      └───────────────┘
```

### 15.3. Payment Provider Interface

Mỗi payment provider implement cùng 1 interface:

```typescript
interface PaymentProvider {
  name: string;
  
  // Tạo giao dịch thanh toán
  createPayment(params: {
    orderId: string;
    amount: number;
    description: string;
    returnUrl: string;
    callbackUrl: string;
  }): Promise<{ paymentUrl: string; transactionId: string }>;
  
  // Verify callback từ gateway
  verifyCallback(request: Request): Promise<{
    transactionId: string;
    orderId: string;
    amount: number;
    status: 'success' | 'failed';
    rawData: any;
  }>;
  
  // Hoàn tiền
  refund(params: {
    transactionId: string;
    amount: number;
    reason: string;
  }): Promise<{ refundId: string; status: string }>;
  
  // Kiểm tra trạng thái
  queryStatus(transactionId: string): Promise<{
    status: string;
    amount: number;
    paidAt?: string;
  }>;
}
```

---

## 16. Tích hợp vận chuyển

### 16.1. Các đơn vị vận chuyển

| Đơn vị | Ưu tiên | Ghi chú |
|---|---|---|
| **GHN** (Giao Hàng Nhanh) | P0 | API: api.ghn.vn |
| **GHTK** (Giao Hàng Tiết Kiệm) | P0 | API: services.giaohangtietkiem.vn |
| **SPX** (Shopee Express) | P0 | API: spx.vn |
| **Viettel Post** | P0 | API: partner.viettelpost.vn |
| **Ahamove** | P0 | API: apistg.ahamove.com |

### 16.2. Shipping Flow

```
1. Khách chọn địa chỉ giao hàng
2. API gọi shipping providers để tính phí
3. Hiển thị danh sách options (đơn vị + giá + thời gian dự kiến)
4. Khách chọn → lưu vào order
5. Admin xác nhận đơn → Tạo vận đơn qua API
6. Nhận tracking number
7. Theo dõi trạng thái qua API hoặc webhook
```

### 16.3. Shipping Provider Interface

```typescript
interface ShippingProvider {
  name: string;
  
  // Tính phí vận chuyển
  calculateFee(params: {
    fromDistrict: string;
    fromWard: string;
    toDistrict: string;
    toWard: string;
    weight: number;       // gram
    items: Array<{ quantity: number; price: number }>;
  }): Promise<{
    fee: number;
    estimatedDays: number;
    serviceName: string;
  }>;
  
  // Tạo đơn vận chuyển
  createOrder(params: {
    orderId: string;
    senderInfo: AddressInfo;
    receiverInfo: AddressInfo;
    items: ShippingItem[];
    codAmount: number;       // Thu hộ COD
    note: string;
  }): Promise<{
    trackingNumber: string;
    labelUrl?: string;       // URL in phiếu gửi
    expectedDelivery: string;
  }>;
  
  // Theo dõi
  getTracking(trackingNumber: string): Promise<TrackingInfo>;
  
  // Hủy
  cancelOrder(trackingNumber: string): Promise<{ success: boolean }>;
  
  // Lấy danh sách tỉnh/huyện/xã
  getProvinces(): Promise<Province[]>;
  getDistricts(provinceId: string): Promise<District[]>;
  getWards(districtId: string): Promise<Ward[]>;
}
```

---

## 17. Hệ thống Theme

### 17.1. Cấu trúc Theme kiểu mới (CSS + JSON Config)

Với Universal Storefront, Theme không còn là mã nguồn React phức tạp, mà đơn giản là:
- **JSON Config:** Cấu trúc các Section, màu sắc (Primary, Secondary, Text), font chữ, padding, layout.
- **CSS File:** Chứa các biến CSS (`--color-primary`, `--radius-md`) và custom styling ghi đè.
- **Assets:** Ảnh nền, fonts, logo lưu trữ trên R2.

### 17.2. Luồng cài đặt và Đổi Theme (Zero Deploy)

1. Khách chọn Theme mới từ Marketplace hoặc Dashboard.
2. Dashboard gọi API tải `theme.json` và `theme.css` về lưu vào D1 / R2 của khách.
3. Cập nhật `active_theme` trong D1 và invalidate KV cache.
4. Universal Storefront tự động fetch config mới, áp dụng CSS Variables mới.
5. **Hoàn tất tức thì — Không cần Cloudflare Pages rebuild.**

## 18. Hệ thống Apps (App-as-Worker)

### 18.1. Vấn đề của mô hình cũ

Việc bundle App chung với Core API Worker bắt buộc phải redeploy toàn bộ backend mỗi khi khách cài hoặc xóa App, gây rủi ro downtime và làm phình to file core.

### 18.2. Kiến trúc App-as-Worker

Mỗi App được thiết kế như một **Cloudflare Worker hoàn toàn độc lập**, giao tiếp qua hệ thống mạng nội bộ CF.

```
  ┌──────────────────┐           fetch()            ┌──────────────────┐
  │ Core API Worker  │ ───────────────────────────▶ │ App #1 (Loyalty) │
  │ Lắng nghe event  │                              └──────────────────┘
  │ (VD: order.paid) │           fetch()            ┌──────────────────┐
  │                  │ ───────────────────────────▶ │ App #2 (Reviews) │
  └──────────────────┘                              └──────────────────┘
```

- **Cài App = Tự động deploy App Worker mới** qua CF API bằng account của khách.
- **Core Worker không bao giờ bị redeploy** khi cài app.
- Nếu App Worker bị lỗi hoặc sập, Core API chỉ cần ignore và tiếp tục (isolation tốt).
- Inter-worker fetch có độ trễ < 0.5ms (cực thấp).

### 18.3. Mở rộng UI (Dashboard & Storefront Extensions)

- **Dashboard:** App đăng ký MenuItem và Widget UI trong `app.json`. Dashboard React app sẽ render widget dưới dạng Iframe hoặc dynamic import từ R2. Không cần redeploy Dashboard.
- **Storefront:** Sử dụng Slot System (chi tiết tại mục 9).

## 19. Marketplace

### 19.1. Marketplace Architecture

```
┌───────────────────────────────────────────────────┐
│              WebbiOS Marketplace                   │
│              (marketplace.webbi.vn)                │
│                                                    │
│  ┌─────────────┐  ┌─────────────┐  ┌───────────┐ │
│  │ Theme Store  │  │ App Store   │  │ Developer │ │
│  │             │  │             │  │ Portal    │ │
│  │ Browse      │  │ Browse      │  │           │ │
│  │ Preview     │  │ Reviews     │  │ Submit    │ │
│  │ Install     │  │ Install     │  │ Manage    │ │
│  │ Purchase    │  │ Purchase    │  │ Analytics │ │
│  └─────────────┘  └─────────────┘  └───────────┘ │
│                                                    │
│  Backend: Hono.js on CF Workers                   │
│  Storage: R2 (theme/app bundles)                  │
│  Database: D1 (listings, reviews, purchases)      │
└───────────────────────────────────────────────────┘
```

### 19.2. Cài đặt Theme/App từ Marketplace

```
1. Khách browse Marketplace từ Dashboard
2. Nhấn "Cài đặt" (hoặc "Mua" nếu trả phí)
3. Dashboard gọi API: POST /api/themes/install hoặc POST /api/apps/install
4. API:
   a. Verify purchase (nếu trả phí)
   b. Tải bundle từ Marketplace CDN (R2)
   c. Validate package integrity (checksum)
   d. Đăng ký theme/app vào D1
   e. Đăng ký event hooks (nếu là app)
   f. Trả về status
5. Dashboard hiển thị "Cài đặt thành công"
6. Khách có thể cấu hình theme/app
```

---

## 20. Đa ngôn ngữ (i18n)

### 20.1. Chiến lược

- **Thiết kế cho i18n từ đầu** — mọi text trong code đều dùng translation key
- **Ngôn ngữ mặc định:** Tiếng Việt (`vi`)
- **Ngôn ngữ bổ sung sau:** Tiếng Anh (`en`), và các ngôn ngữ khác khi mở rộng
- **Thêm ngôn ngữ mới = chỉ cần dịch file JSON**, không cần sửa code

### 20.2. Thư viện

- **Dashboard:** `i18next` + `react-i18next` + `i18next-http-backend` + `i18next-browser-languagedetector`
- **API:** Error messages trả về theo `Accept-Language` header

### 20.3. File Structure

```
packages/dashboard/src/locales/
├── vi/                         # Tiếng Việt (mặc định)
│   ├── common.json             # Từ chung: nút, thông báo, navigation
│   ├── auth.json               # Đăng nhập, đăng ký
│   ├── products.json           # Module sản phẩm
│   ├── orders.json             # Module đơn hàng
│   ├── customers.json          # Module khách hàng
│   ├── settings.json           # Cài đặt
│   ├── reports.json            # Báo cáo
│   ├── marketing.json          # Mã giảm giá, khuyến mãi
│   └── system.json             # Cập nhật, thông tin hệ thống
└── en/                         # Tiếng Anh (thêm sau)
    ├── common.json
    └── ...
```

### 20.4. Quy tắc

1. **KHÔNG BAO GIỜ** hardcode text trực tiếp trong component
2. Sử dụng namespace tương ứng với module: `useTranslation('products')`
3. Key naming convention: `camelCase`, nested bằng dấu `.`
4. Hỗ trợ interpolation: `t('deleteConfirm', { name: product.title })`
5. API error response luôn có 2 field: `code` (machine) + `message` (human, i18n)

### 20.5. i18next Config

```typescript
// packages/dashboard/src/i18n.ts

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'vi',
    supportedLngs: ['vi', 'en'],
    defaultNS: 'common',
    ns: [
      'common', 'auth', 'products', 'orders',
      'customers', 'settings', 'reports',
      'marketing', 'system'
    ],
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
```

---

## 21. Quản lý phiên bản & Cập nhật

### 21.1. Versioning Strategy: Semantic Versioning (SemVer)

```
MAJOR.MINOR.PATCH

Ví dụ: 1.2.3

MAJOR (1) = Breaking changes, migration bắt buộc
MINOR (2) = Tính năng mới, backward compatible
PATCH (3) = Bug fixes, backward compatible
```

### 21.2. Version Examples

```
1.0.0   ← Bản đầu tiên (public release)
1.0.1   ← Fix bug checkout
1.1.0   ← Thêm ShopeePay integration
1.2.0   ← Thêm báo cáo doanh thu
1.2.1   ← Fix bug báo cáo
2.0.0   ← Breaking: Đổi database schema lớn, migration required
2.1.0   ← Thêm plugin system
```

### 21.3. Internal Build Number

Kết hợp SemVer (public) + build number (internal):

```
Public:   1.2.3
Internal: 1.2.3+20260602.001

Git tag:  v1.2.3
```

### 21.4. Release Process

```
1. Developer merge code vào main branch
2. GitHub Actions chạy CI (lint, test, type-check)
3. Tạo Git tag: v1.2.3
4. GitHub Actions build release:
   a. Build API bundle
   b. Build Dashboard bundle
   c. Generate changelog từ commit messages
   d. Upload bundles lên R2 (release CDN)
   e. Update version registry API
5. Khách hàng mở Dashboard → thấy notification "Có bản cập nhật 1.2.3"
```

### 21.5. Update Mechanism

```
┌──────────────────────────────────────────────────────────────┐
│                    Version Update Flow                         │
│                                                               │
│  Dashboard                  WebbiOS API            webbi.vn   │
│  ────────                  ───────────            ──────────  │
│                                                               │
│  1. Cron: Check update ──▶ GET /api/system/      GET /versions│
│     (mỗi 24h)              check-update    ────▶  /latest    │
│                                              ◀──── {v1.2.3}  │
│                            Compare:                           │
│                            current: 1.1.0                     │
│                            latest:  1.2.3                     │
│  ◀── "Có bản cập nhật"    Return: updateAvailable             │
│                                                               │
│  2. User nhấn "Cập nhật"                                     │
│  ──▶ POST /api/system/     Download bundle ────▶ R2 CDN      │
│       update               from R2          ◀──── bundle.zip │
│                                                               │
│                            3. Run migrations                  │
│                            4. Deploy new Worker               │
│                            5. Deploy new Pages                │
│                            6. Verify health                   │
│                            7. Update version in D1            │
│                                                               │
│  ◀── "Cập nhật thành công" Return success                    │
└──────────────────────────────────────────────────────────────┘
```

### 21.6. Upgrade Rules

1. **Sequential upgrade only**: 1.0 → 1.1 → 1.2 (không nhảy version)
2. **Backup trước khi upgrade**: Tự động backup D1 database
3. **Rollback support**: Nếu upgrade fail → rollback về version cũ
4. **Migration scripts**: Mỗi version có migration riêng, chạy tuần tự
5. **Changelog**: Hiển thị "có gì mới" trước khi user confirm upgrade

### 21.7. Version Registry API (hosted trên webbi.vn)

```typescript
// GET https://api.webbi.vn/versions/latest
{
  "version": "1.2.3",
  "build": "20260602.001",
  "releaseDate": "2026-06-02",
  "channel": "stable",            // stable | beta | canary
  "changelog": {
    "vi": "## Có gì mới\n- Tích hợp ShopeePay\n- Fix lỗi checkout",
    "en": "## What's new\n- ShopeePay integration\n- Fix checkout bug"
  },
  "minVersion": "1.0.0",          // Phiên bản tối thiểu để upgrade
  "breaking": false,
  "migrationRequired": true,
  "downloads": {
    "api": "https://cdn.webbi.vn/releases/1.2.3/api.zip",
    "dashboard": "https://cdn.webbi.vn/releases/1.2.3/dashboard.zip"
  },
  "checksums": {
    "api": "sha256:abc123...",
    "dashboard": "sha256:def456..."
  }
}

// GET https://api.webbi.vn/versions?from=1.0.0
// Returns all versions from 1.0.0 to latest (for sequential upgrade path)
[
  { "version": "1.0.1", ... },
  { "version": "1.1.0", ... },
  { "version": "1.2.0", ... },
  { "version": "1.2.3", ... }
]
```

---

## 22. Tối ưu Cloudflare Free Tier

### 22.1. Free Tier Limits

| Service | Free Limit | Reset |
|---|---|---|
| Workers Requests | 100,000/ngày | Daily 00:00 UTC |
| Workers CPU Time | 10ms/request | Per request |
| D1 Reads | 5,000,000 rows/ngày | Daily |
| D1 Writes | 100,000 rows/ngày | Daily |
| D1 Storage | 5 GB | N/A |
| KV Reads | 100,000/ngày | Daily |
| KV Writes | 1,000/ngày | Daily |
| KV Storage | 1 GB | N/A |
| R2 Storage | 10 GB/tháng | Monthly |
| R2 Class A (write) | 1,000,000/tháng | Monthly |
| R2 Class B (read) | 10,000,000/tháng | Monthly |
| Pages Bandwidth | **Unlimited** | N/A |
| Pages Builds | 500/tháng | Monthly |

### 22.2. Optimization Strategies

#### A. Dashboard + Storefront trên CF Pages (FREE)

Dashboard (SPA) và Storefront (SSG) deploy trên CF Pages = **static hosting, unlimited bandwidth, không tốn Workers requests** cho việc serve UI.

Chỉ tốn Workers requests khi gọi API.

#### B. Aggressive KV Caching

```
Chiến lược Write-Through Cache:

1. Admin update sản phẩm → Write D1 + Write KV (1 KV write)
2. Customer xem sản phẩm  → Read KV only (không tốn D1, CPU < 1ms)
3. KV TTL = 1-24 giờ (configurable)
4. Invalidate KV khi data thay đổi

Cache keys:
- product:{id}           → Product detail
- products:page:{n}      → Product list page
- categories:all         → All categories
- settings:all           → All settings
- shop:info              → Shop info
```

#### C. Batch KV Writes

```
KV writes bị giới hạn 1,000/ngày → cần tiết kiệm:

Thay vì: 100 products = 100 KV writes
→ Gộp: product_list_page_1 = 1 KV write (chứa 20 products)
→ 100 products = chỉ 5 KV writes
```

#### D. R2 Public Access + CDN

```
Ảnh sản phẩm → R2 bucket (public access enabled)
→ CF CDN tự cache static files
→ Không tốn Workers requests cho serve ảnh
→ URL: https://cdn.shop.com/products/image.webp
```

#### E. Minimize CPU Time (< 10ms/request)

```
- Sử dụng KV cache → đọc KV < 1ms CPU
- Query D1 đơn giản, có index
- Không dùng heavy computation trong Worker
- JWT verify qua Web Crypto API (~1ms CPU)
- Tổng: ~3-5ms CPU/request (trong giới hạn 10ms)
```

### 22.3. Ước tính sử dụng cho shop nhỏ (100 đơn/ngày)

| Metric | Sử dụng ước tính | Free Limit | % Sử dụng |
|---|---|---|---|
| Workers Requests | ~15,000/ngày | 100,000 | 15% |
| Workers CPU Time | ~5ms/request | 10ms | 50% |
| D1 Reads | ~50,000 rows | 5,000,000 | 1% |
| D1 Writes | ~2,000 rows | 100,000 | 2% |
| D1 Storage | ~500 MB | 5 GB | 10% |
| KV Reads | ~10,000 | 100,000 | 10% |
| KV Writes | ~200 | 1,000 | 20% |
| R2 Storage | ~2 GB | 10 GB | 20% |
| Pages Bandwidth | ~5 GB/ngày | Unlimited | 0% |

**Kết luận: Shop có 100 đơn/ngày hoàn toàn chạy FREE. USP "Phí duy trì = 0" là chính xác.**

### 22.4. Khi nào cần nâng cấp lên Paid ($5/tháng)?

| Metric | Ngưỡng cần upgrade | Tương đương |
|---|---|---|
| Workers Requests > 100K/ngày | ~500-700 đơn/ngày | Shop trung bình-lớn |
| D1 Writes > 100K/ngày | ~500+ đơn/ngày | Shop trung bình-lớn |
| R2 Storage > 10GB | ~5,000+ ảnh sản phẩm | Catalog lớn |

---

## 23. webbi.vn — Nền tảng SaaS Trial & Triển khai

### 23.1. Luồng dùng thử (14 ngày) với Sub-account

Khách hàng muốn thử nghiệm WebbiOS có thể mở shop trong 30 giây:
- **Tài nguyên:** Shop trial chạy trên CF Account của `webbi.vn` (anh là owner). Dữ liệu nằm trong các prefix bảng D1 riêng biệt (multi-tenant shared worker).
- **Tên miền:** Sử dụng subdomain `myshop.webbi.vn`.
- **Trải nghiệm:** Khách không cần biết Cloudflare là gì, dùng thử liền mạch.

### 23.2. Luồng nâng cấp & Migration tự động (Paid Account)

Khi khách quyết định mua license trả phí, hệ thống sẽ thực hiện luồng "Handoff" tự động:
1. Hệ thống hướng dẫn khách tạo tài khoản Cloudflare riêng (nếu chưa có).
2. Khách cung cấp **Cloudflare API Token** (hoặc thông qua OAuth).
3. Hệ thống tự động cấu hình toàn bộ:
   - Export SQL data (D1 dump) từ Trial → Import sang CF account khách.
   - Sao chép R2 objects.
   - Deploy API Worker và Dashboard Pages lên CF account khách.
   - Xóa dữ liệu Trial trên tài khoản gốc.
   - Hướng dẫn khách trỏ domain DNS.
4. Mọi thứ tự động hoàn tất trong ~2-5 phút. **Khách hàng chính thức làm chủ 100% dữ liệu và source code của mình.**

## 24. Bảo mật

### 24.1. Authentication Security

| Biện pháp | Chi tiết |
|---|---|
| Password hashing | PBKDF2, 100K iterations, SHA-256 |
| JWT | Short-lived access (15 min) + long-lived refresh (7 days) |
| Refresh token rotation | Mỗi lần refresh → invalidate token cũ |
| Brute force protection | Rate limit: 5 failed login / 15 phút |
| Session management | Revoke sessions từ Dashboard |

### 24.2. API Security

| Biện pháp | Chi tiết |
|---|---|
| CORS | Whitelist specific origins |
| Rate Limiting | 100 requests/phút per IP (configurable) |
| Input Validation | Zod schema validation cho mọi input |
| SQL Injection | Parameterized queries (Drizzle ORM) |
| XSS Prevention | HTML sanitization cho user content |
| CSRF | SameSite cookies + custom header |
| Content Security Policy | Strict CSP headers |

### 24.3. Data Security

| Biện pháp | Chi tiết |
|---|---|
| Encryption at rest | D1 tự encrypt (Cloudflare managed) |
| Encryption in transit | HTTPS everywhere (Cloudflare SSL) |
| Secrets management | Wrangler secrets (encrypted env vars) |
| R2 access control | Private by default, public chỉ cho assets |
| Backup | D1 auto backup (Cloudflare managed) |
| PII handling | Không log PII, mask sensitive data |

### 24.4. Payment Security

| Biện pháp | Chi tiết |
|---|---|
| No card storage | Redirect tới payment gateway |
| Callback verification | Verify signature từ gateway |
| Idempotency | Prevent duplicate payments |
| Audit trail | Log mọi transaction |

---

## 25. Hiệu năng & Tối ưu (3-Tier Cache)

### 25.1. Chiến lược 3-Tier Cache

WebbiOS áp dụng cơ chế Cache Manager 3 tầng, lấy cảm hứng từ CBC Ecosystem:

1. **Tầng 1 (CDN Cache API):** Sử dụng `Cache-Control: s-maxage=2592000, stale-while-revalidate=30` và **Cache-Tags** (VD: `product-123`, `category-slug`). Trả response từ CDN trong ~0ms.
2. **Tầng 2 (KV Cache):** Sử dụng Cloudflare KV lưu JSON đã qua xử lý (Settings, Categories, Config). Đọc với sub-millisecond latency.
3. **Tầng 3 (D1 DB):** CSDL chính. Khi D1 bị update, WebbiOS gọi API Cloudflare Purge Cache bằng Cache-Tags tương ứng và Invalidate KV.

### 25.2. Tối ưu Storefront

- Load `app-bundle.js` tĩnh duy nhất thay vì load nhiều script rời.
- Dùng Preload/Prefetch cho các hình ảnh banner.
- Sử dụng Cloudflare Image Optimization tự động.

## 26. Báo cáo & Phân tích

### 26.1. Dashboard Overview

```
┌───────────────────────────────────────────────┐
│ Tổng quan hôm nay / 7 ngày / 30 ngày / Custom │
│                                                │
│ 💰 Doanh thu:     15,200,000 VND  (▲ 12%)    │
│ 📦 Đơn hàng:      47              (▲ 8%)     │
│ 🛒 Giá trị TB:    323,404 VND     (▲ 3%)     │
│ 👥 Khách mới:      12             (▲ 15%)    │
│ 📊 Tỷ lệ chuyển đổi: 3.2%        (▼ 0.5%)  │
└───────────────────────────────────────────────┘
```

### 26.2. Báo cáo chi tiết

| Báo cáo | Nội dung | Ưu tiên |
|---|---|---|
| **Doanh thu** | Theo ngày/tuần/tháng, biểu đồ trend | P0 |
| **Đơn hàng** | Số lượng, trạng thái, phương thức thanh toán | P0 |
| **Sản phẩm bán chạy** | Top products theo số lượng + doanh thu | P0 |
| **Khách hàng** | Khách mới vs cũ, giá trị vòng đời | P1 |
| **Nguồn đơn** | Web, mobile, manual | P1 |
| **Phương thức thanh toán** | Phân bổ theo COD, ZaloPay, MoMo... | P1 |
| **Vận chuyển** | Phân bổ theo đơn vị, thời gian giao | P2 |

### 26.3. Data Aggregation

```
Real-time: D1 queries trực tiếp (cho dữ liệu ngày hiện tại)
Historical: Cron Trigger chạy hàng đêm → aggregate vào bảng report_daily
            → KV cache cho dashboard overview
```

---

## 27. SEO

### 27.1. Storefront SEO

| Kỹ thuật | Áp dụng |
|---|---|
| **SSG/ISR** | Pre-render pages tại build time, regenerate theo schedule |
| **Meta tags** | Title, description, Open Graph, Twitter Card cho mỗi page |
| **Structured Data** | JSON-LD cho Product, BreadcrumbList, Organization |
| **Sitemap.xml** | Tự động generate từ products + categories |
| **Robots.txt** | Cấu hình crawling |
| **Canonical URLs** | Tránh duplicate content |
| **Semantic HTML** | Proper heading hierarchy, alt text |
| **Core Web Vitals** | Optimize LCP, FID, CLS |

### 27.2. Product SEO

Mỗi sản phẩm có:
- Custom SEO title (hoặc auto-generate từ product title)
- Custom SEO description (hoặc auto-generate từ short description)
- Custom URL slug
- Product structured data (JSON-LD)
- Canonical URL

---

## 28. Lộ trình phát triển

### 28.1. Phase 1: Foundation (Tuần 1-4)

```
- [ ] Setup monorepo (pnpm + Turborepo)
- [ ] Setup packages/core (types, utils, constants)
- [ ] Setup packages/api (Hono.js + Wrangler)
- [ ] Setup packages/dashboard (Vite + React + Router + Tailwind)
- [ ] Setup i18n (i18next)
- [ ] Database schema + migrations (Drizzle + D1)
- [ ] Authentication system (register, login, JWT, RBAC)
- [ ] Basic CRUD: Products (create, read, update, delete)
- [ ] Basic CRUD: Categories
- [ ] Image upload to R2
- [ ] Dashboard UI: Layout, Sidebar, Login, Products pages
```

### 28.2. Phase 2: E-commerce Core (Tuần 5-8)

```
- [ ] Quản lý tồn kho
- [ ] Product variants (size, color)
- [ ] Customers CRUD
- [ ] Customer addresses
- [ ] Orders CRUD
- [ ] Order status flow
- [ ] Order timeline/activity log
- [ ] Checkout flow (Storefront API)
- [ ] Cart system
- [ ] Discount/Coupon system
- [ ] Dashboard UI: Orders, Customers, Discounts pages
```

### 28.3. Phase 3: Integrations (Tuần 9-12)

```
- [ ] Payment: COD
- [ ] Payment: Bank Transfer
- [ ] Payment: ZaloPay integration
- [ ] Payment: MoMo integration
- [ ] Payment: ShopeePay integration
- [ ] Shipping: GHN integration
- [ ] Shipping: GHTK integration
- [ ] Shipping: SPX integration
- [ ] Shipping: Viettel Post integration
- [ ] Shipping: Ahamove integration
- [ ] Shipping fee calculator
- [ ] Dashboard UI: Payment settings, Shipping settings
```

### 28.4. Phase 4: Storefront & Theme (Tuần 13-16)

```
- [ ] Storefront SDK (@webbios/storefront-sdk)
- [ ] SDK: API client, React hooks
- [ ] SDK: Components (ProductCard, Cart, Checkout...)
- [ ] SDK: Providers (WebbiOSProvider, CartProvider)
- [ ] Default theme: Homepage, Product, Category, Cart, Checkout
- [ ] Theme configuration system
- [ ] Theme install/activate from Dashboard
- [ ] SEO: Meta tags, structured data, sitemap
- [ ] Dashboard UI: Theme settings, Theme preview
```

### 28.5. Phase 5: Advanced Features (Tuần 17-20)

```
- [ ] App/Plugin system (Event Bus + Middleware + Filters)
- [ ] App SDK (@webbios/app-sdk)
- [ ] Sample apps: Reviews, Live Chat
- [ ] Reports: Sales, Products, Customers
- [ ] Dashboard overview (charts, stats)
- [ ] Import/Export (CSV/Excel)
- [ ] Bulk actions
- [ ] User/Team management (invite, roles)
- [ ] Static pages (About, Policy, Contact)
- [ ] KV caching optimization
- [ ] Dashboard UI: Reports, Apps, Team pages
```

### 28.6. Phase 6: Distribution & Marketplace (Tuần 21-24)

```
- [ ] Version management system
- [ ] Update check + notification
- [ ] Update/upgrade mechanism
- [ ] WebbiOS CLI tool (init, deploy, update)
- [ ] Marketplace backend (browse, install, purchase)
- [ ] Marketplace UI integration in Dashboard
- [ ] webbi.vn: Landing page
- [ ] webbi.vn: Trial system (multi-tenant)
- [ ] webbi.vn: Payment + conversion flow
- [ ] Documentation: API docs, Theme guide, App guide
- [ ] Final testing + optimization
- [ ] WebbiOS 1.0.0 release 🎉
```

### 28.7. Timeline Summary

| Phase | Thời gian | Milestone |
|---|---|---|
| Phase 1: Foundation | Tuần 1-4 | Auth + Products + Dashboard skeleton |
| Phase 2: E-commerce | Tuần 5-8 | Orders + Customers + Checkout |
| Phase 3: Integrations | Tuần 9-12 | Payment + Shipping |
| Phase 4: Storefront | Tuần 13-16 | SDK + Default theme + SEO |
| Phase 5: Advanced | Tuần 17-20 | Apps + Reports + Polish |
| Phase 6: Distribution | Tuần 21-24 | Marketplace + CLI + webbi.vn + Launch |
| **Total** | **~6 tháng** | **WebbiOS 1.0.0** |

---

## 29. Phụ lục

### 29.1. Glossary

| Thuật ngữ | Định nghĩa |
|---|---|
| **WebbiOS** | Tên nền tảng e-commerce |
| **Dashboard** | Giao diện quản trị dành cho admin/staff |
| **Storefront** | Giao diện website bán hàng cho khách mua |
| **Theme** | Giao diện (skin) cho Storefront |
| **App** | Ứng dụng mở rộng tính năng WebbiOS |
| **Marketplace** | Kho theme và apps |
| **Tenant** | Một instance WebbiOS riêng biệt (trong multi-tenant) |
| **Owner** | Chủ shop — người mua license WebbiOS |
| **SDK** | Software Development Kit — bộ công cụ cho developer |
| **SemVer** | Semantic Versioning — quy tắc đánh phiên bản |

### 29.2. Tài liệu tham khảo

| Tài liệu | Link |
|---|---|
| Cloudflare Workers Docs | https://developers.cloudflare.com/workers/ |
| Cloudflare D1 Docs | https://developers.cloudflare.com/d1/ |
| Cloudflare R2 Docs | https://developers.cloudflare.com/r2/ |
| Cloudflare KV Docs | https://developers.cloudflare.com/kv/ |
| Cloudflare Pages Docs | https://developers.cloudflare.com/pages/ |
| Hono.js Docs | https://hono.dev/ |
| Drizzle ORM Docs | https://orm.drizzle.team/ |
| React Docs | https://react.dev/ |
| React Router Docs | https://reactrouter.com/ |
| TailwindCSS Docs | https://tailwindcss.com/ |
| i18next Docs | https://www.i18next.com/ |
| Vite Docs | https://vite.dev/ |
| Turborepo Docs | https://turbo.build/ |

### 29.3. Bảng tổng hợp quyết định kiến trúc

| # | Quyết định | Lựa chọn | Lý do |
|---|---|---|---|
| 1 | Infra | 100% Cloudflare | Free tier, edge, no VPS |
| 2 | Backend Framework | Hono.js | Native CF, ~14KB, middleware |
| 3 | Dashboard | Vite + React + Router + Tailwind | SPA, fast build, free hosting |
| 4 | Storefront | Headless + SDK (React) | Flexible, API-first, SEO |
| 5 | Database | D1 (SQLite) | Serverless, free 5GB |
| 6 | ORM | Drizzle | Lightweight, D1 support |
| 7 | File Storage | R2 | S3-compat, no egress |
| 8 | Cache | KV | Edge, sub-ms |
| 9 | Background | Queues + Cron | Async processing |
| 10 | Auth | Self-built JWT | Web Crypto, no dependency |
| 11 | i18n | i18next | Industry standard |
| 12 | Repo | Monorepo (pnpm + Turbo) | Share code, single PR |
| 13 | Versioning | SemVer | Clear communication |
| 14 | App System | Event + Middleware + Filter | Hybrid, flexible |
| 15 | Naming | "Apps" (not plugins) | Modern, familiar |
| 16 | Distribution | WordPress-model | Self-hosted, source delivery |
| 17 | Multi-tenant | DB-per-tenant | Isolation |
| 18 | Payment | ZaloPay, MoMo, ShopeePay | VN market |
| 19 | Shipping | GHN, GHTK, SPX, VTP, Ahamove | VN market |
| 20 | Target Market | Vietnam first | Prove → expand |

---

> **Ghi chú:** PRD này là tài liệu sống (living document), sẽ được cập nhật liên tục trong quá trình phát triển. Mọi thay đổi lớn cần được review và approve trước khi thực hiện.
