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
> WebbiOS hiện đang được phát triển rất tích cực. Kiến trúc lõi và các ứng dụng thiết yếu dự kiến sẽ đạt trạng thái ổn định vào **cuối tháng 8 năm 2026**.
> 
> Ở giai đoạn này, mã nguồn có thể chưa ổn định, các tính năng chưa hoàn thiện và tài liệu có thể bị lỗi thời. **Vui lòng chưa sử dụng cho môi trường production.**

---

## 🚀 Tổng quan

**WebbiOS** là một hệ điều hành mã nguồn mở, hỗ trợ công nghệ edge-native (chạy trên mạng lưới biên) được xây dựng hoàn toàn trên nền tảng **Cloudflare**. WebbiOS cung cấp kiến trúc cơ bản để phát triển nhanh, triển khai và mở rộng website, các ứng dụng thương mại điện tử headless, và công cụ nội bộ mà không cần phải quản lý hạ tầng máy chủ.

Nhờ tận dụng mạng lưới toàn cầu của Cloudflare, WebbiOS mang đến **thời gian Time To First Byte (TTFB) dưới 50ms** trên toàn thế giới và được thiết kế để hoạt động với chi phí $0 trên gói Miễn phí (Free Tier) của Cloudflare.

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

## ✨ Tính năng nổi bật

- **Edge Native**: Chạy 100% serverless, không có thời gian khởi động nguội (zero cold starts), được triển khai tại hơn 300 thành phố trên toàn cầu.
- **Kiến trúc Micro-Frontend**: Tải động các ứng dụng bên trong bảng điều khiển quản trị thông qua Module Federation.
- **Universal Storefront Engine**: Kết xuất giao diện động thông qua cấu hình JSON sử dụng Edge SSR.
- **Bộ nhớ đệm 4 tầng (4-Tier Caching)**: Chiến lược caching nâng cao (CDN -> Worker Cache -> KV -> D1) tối ưu hóa hiệu suất tối đa.
- **Phân quyền dựa trên vai trò (RBAC)**: Quản lý quyền hạn chi tiết cho người dùng, API keys và ứng dụng.
- **Hỗ trợ đa ngôn ngữ toàn cầu**: Hệ thống quốc tế hóa (i18n) hỗ trợ hơn 11 ngôn ngữ cho Dashboard, Kho ứng dụng, và Cài đặt.
- **Chi phí bắt đầu bằng $0**: Được thiết kế để chạy hoàn toàn miễn phí trên giới hạn gói miễn phí của Cloudflare.

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
