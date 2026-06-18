<div align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./.github/assets/logo-dark.png">
    <source media="(prefers-color-scheme: light)" srcset="./.github/assets/logo-light.png">
    <img alt="WebbiOS Logo" src="./.github/assets/logo-light.png" height="80" style="margin-bottom: 20px;">
  </picture>
  <p><strong>WebbiOS | Nền tảng Tăng trưởng Doanh nghiệp Thế hệ Mới</strong></p>
  <p>Xây dựng website, ứng dụng và hệ thống quản lý trên mạng lưới biên (edge network) của Cloudflare. Mã nguồn mở. Miễn phí mãi mãi. Triển khai trong vài giây.</p>

  *Đọc tài liệu bằng ngôn ngữ khác: [English](README.md).*

  <p>
    <a href="https://webbios.dev">Website</a> •
    <a href="https://docs.webbios.dev/">Tài liệu (Docs)</a> •
    <a href="https://www.facebook.com/webbios.dev">Facebook Fanpage</a>
  </p>
</div>

> [!WARNING]
> **🚧 PHIÊN BẢN ALPHA / ĐANG TRONG QUÁ TRÌNH PHÁT TRIỂN 🚧**
> 
> WebbiOS hiện đang được phát triển rất tích cực. Để chia sẻ hệ thống này với cộng đồng, chúng tôi đang tinh chỉnh lại kiến trúc và mã nguồn. Nền tảng cốt lõi và các ứng dụng thiết yếu dự kiến sẽ hoàn thiện và đạt trạng thái ổn định vào **ngày 25/08/2026**.
> 
> Ở giai đoạn này, mã nguồn có thể chưa ổn định, các tính năng chưa hoàn thiện và tài liệu có thể bị lỗi thời. **Vui lòng chưa sử dụng cho môi trường production.** Báo cáo lỗi liên quan đến các tính năng chưa hoàn thiện hoặc vấn đề cài đặt có thể sẽ không được xử lý cho đến khi ra mắt phiên bản Beta chính thức.

---

## 🚀 Tổng quan

**WebbiOS bắt đầu như một hệ thống cốt lõi nội bộ nhằm giải quyết những nỗi đau thực tế về hạ tầng doanh nghiệp cho CBC GROUP.** Chúng tôi cần một hệ sinh thái thống nhất để xây dựng nhiều sản phẩm đa dạng—từ trang chủ công ty, các cửa hàng bán lẻ xuyên biên giới, cho đến CRM nội bộ, tự động hóa tiếp thị và các hệ thống ERP phức tạp.

Sau khi chứng kiến sự ổn định đáng kinh ngạc, hiệu suất tuyệt đối và chi phí quản lý hạ tầng bằng 0 mà nó mang lại, chúng tôi nhận ra rằng hệ thống này quá mạnh mẽ để chỉ giữ cho riêng mình. Chúng tôi quyết định phát hành nền tảng lõi này dưới dạng mã nguồn mở với giấy phép AGPLv3 nhằm trao quyền cho cộng đồng nhà phát triển toàn cầu.

Hôm nay, **WebbiOS** là một Nền tảng Tăng trưởng Doanh nghiệp Thế hệ Mới. Một hệ điều hành mã nguồn mở, edge-native được xây dựng hoàn toàn trên Cloudflare để phát triển, triển khai và mở rộng nhanh chóng các ứng dụng doanh nghiệp hiệu suất cao với mức quản lý hạ tầng bằng 0.

## 🏗️ Kiến trúc

WebbiOS được cấu trúc dưới dạng **Monorepo** (sử dụng `pnpm` và `Turborepo`) và tuân theo thiết kế Micro-Frontend cùng với Serverless microservices.

### Các tầng cốt lõi (Core Layers)
1. **Core Kernel (Tầng 1)**: Hệ thần kinh trung ương của WebbiOS.
   - **`@webbios/api`**: Cloudflare Worker tốc độ cao, được xây dựng bằng [Hono](https://hono.dev/). Xử lý định tuyến (routing), xác thực, phân quyền (RBAC) và logic nghiệp vụ.
   - **`@webbios/db`**: Tầng giao tiếp cơ sở dữ liệu sử dụng [Drizzle ORM](https://orm.drizzle.team/), tương tác trực tiếp với Cloudflare D1.
2. **Web Foundation (Tầng 2)**: Hệ sinh thái UI và Ứng dụng.
   - **`@webbios/dashboard`**: Bảng điều khiển quản trị (Dashboard) sử dụng kiến trúc Micro-Frontend, xây dựng bằng Vite, React và Tailwind CSS.
   - **`@webbios/storefront-engine`**: Worker đảm nhiệm kết xuất (rendering) giao diện người dùng dựa trên cấu hình JSON tại edge (sử dụng tính năng Server Streaming của React 19).
   - **`@webbios/storefront-ui`**: Thư viện component để xây dựng giao diện hiện đại, tối ưu cho chế độ tối (dark-mode).
   - **`@webbios/ui`**: Thư viện component nội bộ dành cho Dashboard.
3. **Application SDKs**: 
   - **`@webbios/sdk`**: SDK TypeScript với kiểu dữ liệu chặt chẽ để tương tác với các dịch vụ lõi của WebbiOS.

### Công nghệ sử dụng
- **Tính toán (Compute)**: Cloudflare Workers
- **Cơ sở dữ liệu**: Cloudflare D1 (SQLite)
- **Lưu trữ đối tượng (Object Storage)**: Cloudflare R2
- **Bộ nhớ đệm (Caching)**: Cloudflare KV & Worker Cache API
- **Framework**: React 19, Vite, Hono, Tailwind CSS
- **Công cụ**: TypeScript, pnpm, Turborepo

## 💎 Nền tảng (The Platform)

Được xây dựng từ đầu dành cho Edge. Bốn trụ cột độc lập cùng nhau tạo ra nền tảng mã nguồn mở mạnh mẽ nhất để tăng trưởng doanh nghiệp:

1. **The Kernel API**: Trái tim của WebbiOS. Một API gateway headless chạy trên Cloudflare Edge cùng với cơ sở dữ liệu D1 và KV Cache.
2. **Universal Dashboard**: Bảng điều khiển của bạn. Một admin panel sẵn sàng sử dụng được tích hợp sẵn RBAC, Custom Domains và Webhooks.
3. **Themes**: Tầng trình diễn (Presentation layer). Tải các storefront giao diện động dựa trên JSON. Tùy chỉnh mọi thứ với Theme Builder trực quan của chúng tôi.
4. **Apps**: Động cơ mở rộng (Extensibility engine). Tiêm (Inject) các Micro-Frontends trực tiếp vào dashboard để mở rộng logic kinh doanh không giới hạn.

## ✨ Tính năng nổi bật

### Nền tảng Lõi & Bảo mật (Core Platform & Security)
- **Phân quyền dựa trên vai trò (RBAC)**: Quyền hạn chi tiết. Kiểm soát những gì mỗi người dùng có thể xem và thực hiện.
- **Tên miền tùy chỉnh & SSL (Custom Domains & SSL)**: Ánh xạ tên miền ngay lập tức với tính năng cấp phát SSL tự động.
- **Quản lý API Keys**: Tạo và quản lý mã khóa API bảo mật cho các tích hợp hệ thống.
- **Cập nhật OTA 1-Click**: Cập nhật Lõi (Core), Ứng dụng (Apps) và Giao diện (Themes) ngay tức thì. Ngay cả trên gói Miễn phí.
- **Mạng lưới Biên Toàn cầu (Global Edge Network)**: Triển khai trên hơn 300 thành phố trên toàn thế giới để đạt độ trễ bằng 0.
- **Tự động thay đổi quy mô (Auto-Scaling)**: Xử lý lưu lượng truy cập đột biến dễ dàng mà không cần can thiệp thủ công.

### Trải nghiệm Lập trình viên (Developer Experience)
- **Cơ sở dữ liệu Serverless**: Sức mạnh từ Cloudflare D1. Dữ liệu quan hệ mà không cần máy chủ.
- **Edge Native Logic**: Chạy các logic kinh doanh phức tạp trực tiếp trên Cloudflare Workers.
- **Real-time Webhooks**: Đăng ký các sự kiện hệ thống để kích hoạt các quy trình làm việc bên ngoài.
- **Micro-Frontends**: Tải ứng dụng động vào dashboard mà không làm phình lõi hệ thống.
- **Bộ nhớ đệm 4 tầng (4-Tier Caching)**: Caching nâng cao tận dụng KV, Memory và Edge cache.
- **Automated Bindings**: Kết nối với lưu trữ R2 và hàng đợi (queues) một cách dễ dàng.

### Thương mại & Nội dung (Commerce & Content)
- **Universal Storefront**: Các mẫu e-commerce sẵn sàng sử dụng, được tối ưu hóa cho chuyển đổi.
- **CMS Tích hợp (Built-in CMS)**: Quản lý nội dung, blog và các trang với trình chỉnh sửa trực quan mạnh mẽ.
- **Tối ưu SEO (SEO Optimized)**: Render phía máy chủ (SSR) và thẻ meta động cho độ hiển thị tối đa.
- **Sẵn sàng đa kênh (Omni-channel Ready)**: Kiến trúc headless cho phép bạn bán hàng ở mọi nơi, trên mọi thiết bị.
- **Quản lý Ứng dụng/Giao diện (App/Theme Manager)**: Cài đặt các tính năng mới từ chợ ứng dụng chỉ với một cú nhấp chuột.
- **Hỗ trợ đa ngôn ngữ (Global Multi-Language)**: Hệ thống quốc tế hóa (i18n) hỗ trợ toàn diện Dashboard, App Store và Settings trên hơn 11 ngôn ngữ.

## 📦 Bắt đầu

### Yêu cầu
- Node.js (v20+)
- pnpm (v9+)
- Tài khoản Cloudflare

### Cài đặt

1. **Clone repository:**
   ```bash
   git clone https://github.com/chieunt/webbios.git
   cd webbios
   ```

2. **Cài đặt các gói phụ thuộc (dependencies):**
   ```bash
   pnpm install
   ```

3. **Cấu hình môi trường:**
   Sao chép `.env.example` thành `.env.dev` và điền thông tin đăng nhập Cloudflare của bạn.

4. **Chạy ở môi trường local:**
   ```bash
   pnpm run dev
   ```

Vui lòng xem [Tài liệu (Documentation)](https://docs.webbios.dev/docs) để biết hướng dẫn chi tiết về cách khởi tạo cơ sở dữ liệu và triển khai lên Cloudflare.

## 🤝 Đóng góp

Chúng tôi hoan nghênh mọi đóng góp từ cộng đồng! Cho dù bạn muốn sửa lỗi, cải thiện tài liệu, hay xây dựng tính năng mới, hãy kiểm tra [GitHub Issues](https://github.com/chieunt/webbios/issues) hoặc tạo một Pull Request.

1. Fork dự án
2. Tạo một nhánh mới (`git checkout -b feature/amazing-feature`)
3. Commit thay đổi (`git commit -m 'feat: add amazing feature'`)
4. Push nhánh của bạn (`git push origin feature/amazing-feature`)
5. Mở Pull Request

## 📄 Giấy phép

WebbiOS là phần mềm mã nguồn mở được cấp phép theo **AGPLv3**. Vui lòng xem file `LICENSE` để biết thêm chi tiết.
