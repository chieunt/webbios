Anh đang triển khai dự án WebbiOS - một nền tảng giúp xây dựng web/app e-commerce cho doanh nghiệp nhỏ và vừa. Điểm đặc biệt của WebbiOS là sử dụng toàn bộ hạ tầng của CloudFlare (D1, R2, KV, Queues, CDN, vv...). Yêu cầu của dự án:

1. Yêu cầu nghiệp vụ:
WebbiOS sẽ đóng vai trò là core xử lý logic nghiệp vụ bao gồm API backend, giao diện dashboard quản trị (sản phẩm, đơn hàng, khách hàng, báo cáo, tích hợp cổng thanh toán - vận chuyển, vv...) để phục vụ cho việc xây dựng web/app e-commerce cho doanh nghiệp nhỏ và vừa. Client (domain hoặc app) sẽ kết nối tới API, không xử lý nghiệp vụ hoặc logic, chỉ đảm nhận nhiệm vụ giao tiếp với người dùng và trình bày thông tin, tương tác với backend.

WebbiOS được đóng gói giống như Wordpress (có theme, plugin (gọi là ứng dụng), vv...), anh sẽ bán cho khách hàng để họ cài đặt WebbiOS trên CloudFlare với tài khoản riêng của họ. Mỗi khi có cập nhật phiên bản mới thì trên dashboard của khách hàng sẽ hiển thị thông báo đề nghị cập nhật giống như cách làm của Wordpress. Tức là anh sẽ bàn giao source code cho khách hàng giống như Wordpress chứ không theo mô hình SaaS giống Shopify, Haravan.

Anh sẽ xây dựng kho ứng dụng marketplace nơi cung cấp thêm các theme và ứng dụng cho khách hàng cài đặt vào WebbiOS của họ.

Nhìn chung anh muốn làm 1 dự án tương tự như Shopify nhưng triển khai trên CloudFlare và đóng gói theo mô hình Wordpress.

2. Công nghệ sử dụng:
- Xây dựng trên hạ tầng của CloudFlare để đảm bảo khả năng bảo mật, mở rộng không giới hạn, tốc độ truy cập nhanh, và chi phí duy trì thấp cực hạn (có thể sử dụng gói Free của CloudFlare, còn nếu dùng gói trả phí thì cũng chỉ 5 usd/1 tháng)
- Sử dụng công nghệ Next.js (React framework)
- Sử dụng thư viện React Router để quản lý routing
- Sử dụng thư viện TailwindCSS để xây dựng UI

3. Trang quảng bá dịch vụ:
Anh sẽ xây dựng website webbi.vn (mô hình multi tenant) để quảng bá dịch vụ xây dựng web/app, tại đây khách hàng có thể tạo website của họ (mỗi website có 1 tên miền riêng hoặc subdomain của webbi.vn). Khi họ tạo website thì hệ thống sẽ tạo ra 1 tenant mới để họ có thể trải nghiệm WebbiOS. Tức là anh muốn tạo ra 1 trải nghiệm giống như tạo 1 tài khoản Shopify khi đăng ký. Anh cho dùng thử 14 ngày, sau 14 ngày nếu họ không trả tiền thì sẽ xoá toàn bộ dữ liệu liên quan tới tenant đó, còn nếu họ trả tiền thì hệ thống sẽ deploy cho họ 1 bản WebbiOS riêng với theme + dữ liệu họ đã nhập (tức là họ sẽ sở hữu 1 bản WebbiOS của riêng họ, có thể tuỳ chỉnh theme và cài thêm các ứng dụng khác từ marketplace).

Tầm nhìn của anh biến WebbiOS trở thành 1 nền tảng xây dựng web/app có hiệu năng cao, chi phí duy trì rẻ (thậm chí = 0), khả năng mở rộng không giới hạn, thường xuyên được cập nhật phiên bản WebbiOS mới, có thể cài đặt/xoá bỏ ứng dụng trên marketplace, có tên miền riêng, có R2 riêng, và được bàn giao full source code.

Em hãy phân tích bài toán và tư vấn cho anh giải pháp tối ưu nhất.