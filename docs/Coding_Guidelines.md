# Cẩm nang Tiêu chuẩn Lập trình (WebbiOS Coding Guidelines)

Tài liệu này đóng vai trò "Kim chỉ nam" định hình tư duy và cách thức viết code cho dư án WebbiOS. Tất cả các lập trình viên tham gia dự án đều phải tuân thủ nghiêm ngặt để đảm bảo hệ thống dễ quản lý, dễ bảo trì, dễ mở rộng và chặn đứng các rủi ro bảo mật.

---

## 1. Nguyên tắc Tổng quan (Core Principles)

*   **DRY (Don't Repeat Yourself)**: Không bao giờ lặp lại cùng một đoạn mã (logic, UI components, types) ở hai nơi khác nhau. Mọi mã nguồn dùng chung phải được đóng gói vào các package nội bộ như `@webbios/shared`, `@webbios/db`, `@webbios/ui`.
*   **KISS (Keep It Simple, Stupid)**: Ưu tiên sự đơn giản, rõ ràng, minh bạch. Code dễ đọc và dễ bảo trì quan trọng hơn một giải pháp thông minh nhưng lắt léo.
*   **Single Responsibility Principle (Nguyên lý Đơn Trách Nhiệm)**: Mỗi hàm (function), lớp (class) hoặc component chỉ nên làm MỘT nhiệm vụ duy nhất. Logic xử lý CSDL không nằm chung file với logic render UI.

---

## 2. Quản lý Architecture (Kiến trúc Monorepo)

*   **Type-Safe Xuyên Suốt**: Khai báo kiểu dữ liệu mạnh mẽ với TypeScript. **Tuyệt đối không sử dụng type `any`**. Schema của D1 Database phải được đóng gói tại package trung tâm (`@webbios/db`) và xuất khẩu Types cho mọi ứng dụng con sử dụng.
*   **Chia nhỏ Gói Code (Packages)**: 
    *   `apps/`: Các ứng dụng độc lập (API, Dashboard, Storefront).
    *   `packages/`: Thư viện lõi tái sử dụng (Shared, DB, UI).
*   **API (Hono.js)**: Tuân thủ mô hình 3 lớp: **Route -> Service -> Database**.
    - **Route**: Định nghĩa endpoint, validation, response.
    - **Service**: Logic nghiệp vụ.
    - **Database**: Drizzle ORM thao tác với D1.

---

## 3. Quy chuẩn Phân chia Thư Mục (Directory Structure)

Áp dụng Cấu trúc Dựa trên Tính năng (Feature-based/Domain-driven).

*   **Bên trong ứng dụng (VD: apps/api)**:
    *   `src/modules/`: Chứa logic chia theo Miền Nghiệp vụ (Domain). Ví dụ: `src/modules/orders/` sẽ chứa `order.controller.ts`, `order.service.ts`, `order.schema.ts`.
    *   `src/shared/`: Code dùng chung chỉ riêng cho app này.
*   **Tên File (File Naming Conventions)**:
    *   Sử dụng định dạng `kebab-case`. Đuôi file phải báo hiệu chức năng: `.controller.ts`, `.service.ts`, `.schema.ts`, `.utils.ts`. 

---

## 4. Quản trị Bảo mật & Lỗi (Security & Error Handling)

*   **Zero Trust Architecture**: Không bao giờ được tin tưởng input từ client. 100% Request Body, Query, Params phải đi qua lưới lọc xác thực (Zod) tại Middleware trước khi vào Controller. Validation Schema đặt tại `@webbios/shared`.
*   **Centralized Error Handling**: Mọi ngoại lệ trong API phải đẩy về trình xử lý lỗi toàn cục (`app.onError`). Không trả JSON báo lỗi kèm tiếng Việt trong logic. Trả về format chuẩn:
    ```json
    { "success": false, "error_code": "PRODUCT_NOT_FOUND", "message": "Product does not exist." }
    ```
*   **Bảo mật Thông tin**: Không bao giờ commit Keys/Secrets vào repo. Dùng biến môi trường Cloudflare Secrets.

---

## 5. Quy chuẩn Đặt tên (Naming Conventions)

*   **PascalCase**: Cho Tên Type, Interface, React Component (VD: `ProductCard`, `OrderInterface`).
*   **camelCase**: Cho Tên biến, Tên hàm, Instance (VD: `getUserProfile`, `totalAmount`).
*   **SNAKE_CASE**: Cho Hằng số cấu hình toàn cục (VD: `MAX_RETRY_COUNT`).
*   **Tiền tố rõ nghĩa**:
    *   Biến boolean (true/false) bắt đầu bằng `is`, `has`, `can`, `should` (VD: `isActive`, `hasPermission`).
    *   Hàm sự kiện UI bắt đầu bằng `handle` hoặc `on` (VD: `handleSubmit`, `onClick`).
*   **Tên không chung chung**: Không dùng `data`, `info`, `res`. Hãy dùng `productList`, `userData`.

---

## 6. Lộ trình Git & Quy trình Code (Version Control)

*   **Quy chuẩn Tên Commit (Conventional Commits)**:
    *   `feat: [Mô tả]`: Thêm tính năng mới (Ví dụ: `feat: Thêm API tạo đơn hàng`).
    *   `fix: [Mô tả]`: Sửa lỗi (Ví dụ: `fix: Sửa lỗi hiển thị nút Xóa`).
    *   `refactor: [Mô tả]`: Viết lại code, không làm thay đổi chức năng.
    *   `docs: [Mô tả]`: Cập nhật tài liệu chữ (PRD, Guidelines).
    *   `style: [Mô tả]`: Format tab, khoảng trắng.
    *   `chore: [Mô tả]`: Cập nhật dependencies, build script.

---

## 7. Quản lý Shared Packages (`@webbios/shared`)

*   Toàn bộ Types, Interfaces nghiệp vụ (`Order`, `Product`) phải nằm ở đây.
*   Logic tính toán tài chính như `calculateOrderTotal()` để Frontend và Backend luôn ra cùng kết quả.
*   Zod Schemas dùng chung cho validation (VD: `OrderCreateSchema`).

---

## 8. Quy chuẩn UI Components (WebbiOS Design Language)

*   Sử dụng Tailwind CSS làm nền tảng (WebbiOS Design Language - WDL).
*   Các UI Components chung (`@webbios/ui`) không được truyền custom class (`className`) tùy tiện (như màu sắc, font chữ) để đảm bảo tính đồng nhất giao diện toàn hệ thống.
*   Component chia làm 2 cấp:
    1. **Core UI Components** (`@webbios/ui`): Button, Input, Card.
    2. **Module Components** (`apps/dashboard/src/modules/orders/components`): Component phức tạp gắn với nghiệp vụ (VD: `OrderSummaryCard`).

---

## 9. Quản lý Tài liệu Kỹ thuật (Technical Documentation)

Để dự án dễ bảo trì, mọi tính năng mới đều phải đi kèm với tài liệu kỹ thuật được lưu trong thư mục `docs/`.
*   **PRD.md**: Lưu giữ tổng quan kiến trúc và luồng nghiệp vụ.
*   **Feature Docs**: Khi làm module mới, tạo file thiết kế trong `docs/features/`. (Ví dụ: `docs/features/Product_Module.md` mô tả DB Schema, API Endpoints, UI Design cho module Sản phẩm).
*   **Cập nhật liên tục**: Code thay đổi, tài liệu cũng phải được cập nhật đồng bộ.
