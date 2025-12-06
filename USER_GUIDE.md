# HƯỚNG DẪN SỬ DỤNG HỆ THỐNG UNIMERCH

## Mục lục
1. [Giới thiệu](#giới-thiệu)
2. [Hướng dẫn cho Người dùng (User)](#hướng-dẫn-cho-người-dùng-user)
3. [Hướng dẫn cho Người bán (Seller)](#hướng-dẫn-cho-người-bán-seller)
4. [Hướng dẫn cho Quản trị viên (Admin)](#hướng-dẫn-cho-quản-trị-viên-admin)

---

## Giới thiệu

Unimerch là hệ thống thương mại điện tử dành cho sinh viên, cho phép mua bán sản phẩm trực tuyến. Hệ thống hỗ trợ 3 vai trò chính:
- **User (Người dùng)**: Khách hàng mua sắm sản phẩm
- **Seller (Người bán)**: Người bán quản lý cửa hàng và sản phẩm của mình
- **Admin (Quản trị viên)**: Quản lý toàn bộ hệ thống

---

## Hướng dẫn cho Người dùng (User)

### 1. Đăng ký tài khoản

**Bước 1:** Truy cập trang đăng ký
- Nhấn vào nút "Đăng ký" trên header hoặc truy cập `/register`

> 📸 **CHỤP ẢNH 1**: Trang đăng ký - `/register`
> - Hiển thị form đăng ký với các trường: Username, Email, Họ tên, Mật khẩu, MSSV (tùy chọn), Số điện thoại (tùy chọn), Địa chỉ (tùy chọn)

**Bước 2:** Điền thông tin
- **Username**: Tên đăng nhập (bắt buộc)
- **Email**: Email hợp lệ (bắt buộc)
- **Họ tên**: Họ và tên đầy đủ (bắt buộc)
- **Mật khẩu**: Mật khẩu mạnh (bắt buộc)
- **MSSV**: Mã số sinh viên (tùy chọn)
- **Số điện thoại**: Liên hệ (tùy chọn)
- **Địa chỉ**: Địa chỉ giao hàng (tùy chọn)

**Bước 3:** Nhấn "Đăng ký" để hoàn tất

### 2. Đăng nhập

**Bước 1:** Truy cập trang đăng nhập
- Nhấn vào nút "Đăng nhập" trên header hoặc truy cập `/login`

> 📸 **CHỤP ẢNH 2**: Trang đăng nhập - `/login`
> - Hiển thị form đăng nhập với Email và Password

**Bước 2:** Nhập thông tin đăng nhập
- Email: Email đã đăng ký
- Password: Mật khẩu

**Bước 3:** Nhấn "Đăng nhập"

**Lưu ý:** Nếu quên mật khẩu, nhấn vào "Quên mật khẩu?" để reset

> 📸 **CHỤP ẢNH 3**: Trang quên mật khẩu - `/forgot-password`
> - Form nhập email để reset password

### 3. Trang chủ

Sau khi đăng nhập thành công, bạn sẽ được chuyển đến trang chủ.

> 📸 **CHỤP ẢNH 4**: Trang chủ - `/`
> - Hero section với banner chính
> - Featured Products (Sản phẩm nổi bật)
> - Collections (Bộ sưu tập)
> - Header với menu điều hướng

**Các phần chính trên trang chủ:**
- **Header**: Menu điều hướng, tìm kiếm, giỏ hàng, tài khoản
- **Hero Section**: Banner quảng cáo chính
- **Featured Products**: Sản phẩm nổi bật/mới nhất
- **Collections**: Các danh mục sản phẩm

### 4. Xem danh sách sản phẩm

**Cách 1:** Nhấn vào "Sản phẩm" trên menu header
**Cách 2:** Truy cập `/all-products`

> 📸 **CHỤP ẢNH 5**: Trang danh sách sản phẩm - `/all-products`
> - Thanh tìm kiếm
> - Bộ lọc theo danh mục (categories)
> - Grid hiển thị các sản phẩm với ảnh, tên, giá
> - Pagination (phân trang)

**Các tính năng:**
- **Tìm kiếm**: Nhập tên sản phẩm vào thanh tìm kiếm
- **Lọc theo danh mục**: Chọn category để lọc sản phẩm
- **Phân trang**: Điều hướng qua các trang sản phẩm
- **Sắp xếp**: Sắp xếp theo giá, tên, mới nhất

### 5. Xem chi tiết sản phẩm

**Bước 1:** Nhấn vào một sản phẩm từ danh sách

> 📸 **CHỤP ẢNH 6**: Trang chi tiết sản phẩm - `/products/:id`
> - Hình ảnh sản phẩm lớn
> - Tên sản phẩm
> - Giá
> - Mô tả chi tiết
> - Thông tin người bán
> - Số lượng còn lại (stock)
> - Nút "Thêm vào giỏ hàng"
> - Phần đánh giá (reviews)

**Bước 2:** Xem thông tin chi tiết
- Ảnh sản phẩm
- Tên và giá
- Mô tả chi tiết
- Thông tin người bán
- Đánh giá từ người mua khác

**Bước 3:** Chọn số lượng và thêm vào giỏ hàng
- Điều chỉnh số lượng mong muốn
- Nhấn "Thêm vào giỏ hàng"

### 6. Quản lý giỏ hàng

**Cách 1:** Nhấn vào biểu tượng giỏ hàng trên header
**Cách 2:** Truy cập `/cart`

> 📸 **CHỤP ẢNH 7**: Trang giỏ hàng - `/cart`
> - Danh sách sản phẩm trong giỏ
> - Ảnh, tên, giá từng sản phẩm
> - Điều chỉnh số lượng (+/-)
> - Nút xóa sản phẩm
> - Tổng tiền
> - Nút "Thanh toán"

**Các thao tác:**
- **Xem sản phẩm**: Danh sách tất cả sản phẩm đã thêm
- **Thay đổi số lượng**: Nhấn nút +/- để tăng/giảm số lượng
- **Xóa sản phẩm**: Nhấn nút "Xóa" hoặc biểu tượng thùng rác
- **Xem tổng tiền**: Hiển thị ở cuối giỏ hàng
- **Thanh toán**: Nhấn "Thanh toán" để chuyển sang bước checkout

### 7. Thanh toán (Checkout)

> 📸 **CHỤP ẢNH 8**: Trang thanh toán - `/checkout`
> - Form thông tin giao hàng (Họ tên, SĐT, Địa chỉ)
> - Phương thức thanh toán
> - Tóm tắt đơn hàng (sản phẩm, số lượng, giá)
> - Tổng tiền
> - Nút "Đặt hàng"

**Bước 1:** Nhập thông tin giao hàng
- Họ tên người nhận
- Số điện thoại
- Địa chỉ giao hàng chi tiết

**Bước 2:** Chọn phương thức thanh toán
- COD (Thanh toán khi nhận hàng)
- Chuyển khoản ngân hàng
- Ví điện tử

**Bước 3:** Kiểm tra thông tin và đặt hàng
- Xem lại thông tin đơn hàng
- Nhấn "Đặt hàng" để hoàn tất

### 8. Quản lý đơn hàng

**Truy cập:** Nhấn vào "Đơn hàng" trên menu hoặc `/orders`

> 📸 **CHỤP ẢNH 9**: Trang danh sách đơn hàng - `/orders`
> - Danh sách tất cả đơn hàng đã đặt
> - Mã đơn hàng
> - Ngày đặt
> - Trạng thái (Pending, Processing, Shipped, Delivered, Cancelled)
> - Tổng tiền
> - Nút "Xem chi tiết"

**Xem chi tiết đơn hàng:**

> 📸 **CHỤP ẢNH 10**: Trang chi tiết đơn hàng - `/orders/:id`
> - Mã đơn hàng
> - Trạng thái đơn hàng
> - Thông tin người nhận
> - Danh sách sản phẩm trong đơn
> - Thông tin thanh toán
> - Lịch sử cập nhật trạng thái

**Các trạng thái đơn hàng:**
- **Pending**: Chờ xác nhận
- **Processing**: Đang xử lý
- **Shipped**: Đang giao hàng
- **Delivered**: Đã giao hàng
- **Cancelled**: Đã hủy

### 9. Chế độ sáng/tối (Dark/Light Mode)

> 📸 **CHỤP ẢNH 11**: Chuyển đổi theme
> - Nút chuyển đổi theme trên header (icon mặt trời/mặt trăng)
> - So sánh 2 ảnh: Light mode và Dark mode của cùng 1 trang

**Cách sử dụng:**
- Nhấn vào icon mặt trời/mặt trăng trên header để chuyển đổi

---

## Hướng dẫn cho Người bán (Seller)

### 1. Đăng ký tài khoản Seller

Để trở thành Seller, bạn cần:
1. Đăng ký tài khoản User bình thường
2. Liên hệ Admin để nâng cấp tài khoản lên Seller

### 2. Đăng nhập và truy cập Seller Dashboard

**Bước 1:** Đăng nhập với tài khoản Seller
**Bước 2:** Truy cập `/seller` hoặc chọn "Seller Dashboard" từ menu

> 📸 **CHỤP ẢNH 12**: Seller Dashboard - `/seller`
> - Tổng quan doanh số
> - Thống kê sản phẩm (tổng số, đã bán, còn lại)
> - Thống kê đơn hàng (pending, processing, completed)
> - Biểu đồ doanh thu
> - Sidebar menu (Dashboard, Sản phẩm, Đơn hàng, Đánh giá)

**Các thông tin trên Dashboard:**
- **Doanh số**: Tổng doanh thu, doanh thu tháng này
- **Sản phẩm**: Tổng số sản phẩm, sản phẩm đã bán, còn lại
- **Đơn hàng**: Đơn chờ xử lý, đang xử lý, hoàn thành
- **Biểu đồ**: Thống kê doanh thu theo thời gian

### 3. Quản lý sản phẩm

**Truy cập:** `/seller/products`

> 📸 **CHỤP ẢNH 13**: Quản lý sản phẩm của Seller - `/seller/products`
> - Nút "Thêm sản phẩm mới"
> - Bảng danh sách sản phẩm
> - Các cột: Ảnh, Tên, Giá, Số lượng, Trạng thái, Hành động
> - Nút Sửa/Xóa cho từng sản phẩm
> - Tìm kiếm và lọc

#### 3.1. Thêm sản phẩm mới

> 📸 **CHỤP ẢNH 14**: Form thêm sản phẩm mới
> - Modal/Form với các trường:
>   - Tên sản phẩm
>   - Mô tả
>   - Giá
>   - Số lượng (stock)
>   - Danh mục (category)
>   - Upload ảnh
> - Nút "Lưu" và "Hủy"

**Bước 1:** Nhấn "Thêm sản phẩm mới"
**Bước 2:** Điền thông tin sản phẩm
- **Tên sản phẩm**: Tên rõ ràng, dễ tìm
- **Mô tả**: Chi tiết về sản phẩm
- **Giá**: Giá bán (VNĐ)
- **Số lượng**: Số lượng trong kho
- **Danh mục**: Chọn category phù hợp
- **Ảnh sản phẩm**: Upload ảnh chất lượng cao

**Bước 3:** Nhấn "Lưu" để thêm sản phẩm

#### 3.2. Sửa sản phẩm

> 📸 **CHỤP ẢNH 15**: Form chỉnh sửa sản phẩm
> - Tương tự form thêm mới nhưng các trường đã có dữ liệu sẵn

**Bước 1:** Nhấn nút "Sửa" (icon bút) bên cạnh sản phẩm
**Bước 2:** Chỉnh sửa thông tin cần thiết
**Bước 3:** Nhấn "Cập nhật" để lưu thay đổi

#### 3.3. Xóa sản phẩm

**Bước 1:** Nhấn nút "Xóa" (icon thùng rác) bên cạnh sản phẩm
**Bước 2:** Xác nhận xóa trong dialog

> 📸 **CHỤP ẢNH 16**: Dialog xác nhận xóa sản phẩm

### 4. Quản lý đơn hàng

**Truy cập:** `/seller/orders`

> 📸 **CHỤP ẢNH 17**: Quản lý đơn hàng của Seller - `/seller/orders`
> - Danh sách tất cả đơn hàng liên quan đến sản phẩm của seller
> - Các cột: Mã đơn, Ngày đặt, Khách hàng, Sản phẩm, Tổng tiền, Trạng thái
> - Dropdown/Button để cập nhật trạng thái
> - Nút "Xem chi tiết"
> - Bộ lọc theo trạng thái

**Các thao tác:**

#### 4.1. Xem danh sách đơn hàng
- Xem tất cả đơn hàng có sản phẩm của mình
- Lọc theo trạng thái: Pending, Processing, Shipped, Delivered

#### 4.2. Cập nhật trạng thái đơn hàng

> 📸 **CHỤP ẢNH 18**: Cập nhật trạng thái đơn hàng
> - Dropdown chọn trạng thái mới
> - Button "Cập nhật"

**Bước 1:** Chọn đơn hàng cần cập nhật
**Bước 2:** Chọn trạng thái mới từ dropdown
- Pending → Processing (Xác nhận đơn hàng)
- Processing → Shipped (Giao hàng)
- Shipped → Delivered (Đã giao)
- Hoặc Cancelled (Hủy đơn)

**Bước 3:** Nhấn "Cập nhật"

#### 4.3. Xem chi tiết đơn hàng

> 📸 **CHỤP ẢNH 19**: Chi tiết đơn hàng (Seller view)
> - Thông tin khách hàng
> - Danh sách sản phẩm
> - Địa chỉ giao hàng
> - Trạng thái và lịch sử cập nhật

### 5. Quản lý đánh giá

**Truy cập:** `/seller/ratings`

> 📸 **CHỤP ẢNH 20**: Quản lý đánh giá - `/seller/ratings`
> - Danh sách đánh giá từ khách hàng
> - Thông tin: Sản phẩm, Khách hàng, Số sao, Nội dung đánh giá, Ngày
> - Tùy chọn trả lời đánh giá (nếu có)

**Các thông tin hiển thị:**
- Sản phẩm được đánh giá
- Tên khách hàng
- Số sao (1-5)
- Nội dung đánh giá
- Ngày đánh giá

---

## Hướng dẫn cho Quản trị viên (Admin)

### 1. Đăng nhập Admin

**Bước 1:** Đăng nhập với tài khoản có role "admin"
**Bước 2:** Truy cập `/admin`

> 📸 **CHỤP ẢNH 21**: Admin Dashboard - `/admin`
> - Tổng quan toàn hệ thống
> - Số liệu thống kê:
>   - Tổng người dùng
>   - Tổng người bán
>   - Tổng sản phẩm
>   - Tổng đơn hàng
>   - Tổng doanh thu
> - Biểu đồ thống kê
> - Sidebar menu (Dashboard, Users, Products, Orders, Payments, Reviews)

### 2. Quản lý người dùng

**Truy cập:** `/admin/users`

> 📸 **CHỤP ẢNH 22**: Quản lý người dùng - `/admin/users`
> - Bảng danh sách tất cả người dùng
> - Các cột: ID, Username, Email, Họ tên, Role, Trạng thái, Ngày tạo, Hành động
> - Tìm kiếm người dùng
> - Bộ lọc theo role (User, Seller, Admin)
> - Pagination

**Các thao tác:**

#### 2.1. Xem danh sách người dùng
- Xem thông tin tất cả user trong hệ thống
- Tìm kiếm theo username, email
- Lọc theo vai trò

#### 2.2. Thêm người dùng mới

> 📸 **CHỤP ẢNH 23**: Form thêm người dùng mới
> - Các trường: Username, Email, Password, Full Name, Role, Student ID, Phone, Address
> - Dropdown chọn Role: User, Seller, Admin

**Bước 1:** Nhấn "Thêm người dùng"
**Bước 2:** Điền thông tin
**Bước 3:** Chọn vai trò (Role)
**Bước 4:** Nhấn "Lưu"

#### 2.3. Chỉnh sửa người dùng

> 📸 **CHỤP ẢNH 24**: Form chỉnh sửa người dùng
> - Tương tự form thêm mới, có thể cập nhật role

**Bước 1:** Nhấn nút "Sửa" bên cạnh user
**Bước 2:** Cập nhật thông tin (có thể thay đổi role)
**Bước 3:** Nhấn "Cập nhật"

#### 2.4. Xóa/Vô hiệu hóa người dùng

> 📸 **CHỤP ẢNH 25**: Xóa hoặc vô hiệu hóa user
> - Dialog xác nhận
> - Tùy chọn: Xóa vĩnh viễn hoặc Vô hiệu hóa tạm thời

**Bước 1:** Nhấn nút "Xóa" hoặc "Vô hiệu hóa"
**Bước 2:** Xác nhận trong dialog

### 3. Quản lý sản phẩm

**Truy cập:** `/admin/products`

> 📸 **CHỤP ẢNH 26**: Quản lý sản phẩm (Admin) - `/admin/products`
> - Bảng danh sách tất cả sản phẩm trong hệ thống
> - Các cột: Ảnh, Tên, Người bán, Giá, Stock, Category, Trạng thái, Hành động
> - Tìm kiếm và lọc (theo category, seller, trạng thái)
> - Pagination

**Các thao tác:**

#### 3.1. Xem danh sách sản phẩm
- Xem tất cả sản phẩm trong hệ thống
- Tìm kiếm theo tên sản phẩm
- Lọc theo category, seller

#### 3.2. Duyệt/Từ chối sản phẩm

> 📸 **CHỤP ẢNH 27**: Duyệt sản phẩm
> - Chi tiết sản phẩm cần duyệt
> - Nút "Duyệt" (Approve) và "Từ chối" (Reject)
> - Form nhập lý do (nếu từ chối)

**Bước 1:** Xem chi tiết sản phẩm
**Bước 2:** Nhấn "Duyệt" để cho phép hiển thị hoặc "Từ chối" và nhập lý do

#### 3.3. Xóa sản phẩm vi phạm

> 📸 **CHỤP ẢNH 28**: Xóa sản phẩm
> - Dialog xác nhận xóa với lý do

**Bước 1:** Nhấn nút "Xóa"
**Bước 2:** Nhập lý do xóa
**Bước 3:** Xác nhận

#### 3.4. Chỉnh sửa sản phẩm (nếu cần)

Admin có thể chỉnh sửa thông tin sản phẩm nếu phát hiện sai sót.

### 4. Quản lý đơn hàng

**Truy cập:** `/admin/orders`

> 📸 **CHỤP ẢNH 29**: Quản lý đơn hàng (Admin) - `/admin/orders`
> - Bảng danh sách tất cả đơn hàng trong hệ thống
> - Các cột: Mã đơn, Khách hàng, Người bán, Ngày đặt, Tổng tiền, Trạng thái, Thanh toán, Hành động
> - Tìm kiếm theo mã đơn, khách hàng
> - Lọc theo trạng thái, ngày tháng
> - Pagination

**Các thao tác:**

#### 4.1. Xem danh sách đơn hàng
- Xem tất cả đơn hàng trong hệ thống
- Tìm kiếm theo mã đơn
- Lọc theo trạng thái, thời gian

#### 4.2. Xem chi tiết đơn hàng

> 📸 **CHỤP ẢNH 30**: Chi tiết đơn hàng (Admin view)
> - Thông tin đầy đủ về đơn hàng
> - Thông tin khách hàng và người bán
> - Danh sách sản phẩm
> - Lịch sử cập nhật trạng thái
> - Thông tin thanh toán

#### 4.3. Can thiệp đơn hàng (nếu có vấn đề)

> 📸 **CHỤP ẢNH 31**: Can thiệp đơn hàng
> - Form cập nhật trạng thái
> - Thêm ghi chú/lý do
> - Hoàn tiền (nếu cần)

**Admin có thể:**
- Cập nhật trạng thái đơn hàng
- Hủy đơn hàng (với lý do)
- Xử lý khiếu nại
- Hoàn tiền cho khách hàng

### 5. Quản lý thanh toán

**Truy cập:** `/admin/payments`

> 📸 **CHỤP ẢNH 32**: Quản lý thanh toán - `/admin/payments`
> - Danh sách tất cả giao dịch thanh toán
> - Các cột: Mã giao dịch, Đơn hàng, Khách hàng, Số tiền, Phương thức, Trạng thái, Ngày
> - Thống kê doanh thu
> - Bộ lọc theo phương thức, trạng thái, thời gian

**Các thông tin:**
- Tổng doanh thu
- Doanh thu theo phương thức thanh toán
- Giao dịch thành công/thất bại
- Chi tiết từng giao dịch

**Các thao tác:**
- Xem chi tiết giao dịch
- Xác nhận thanh toán (nếu chuyển khoản)
- Hoàn tiền
- Xuất báo cáo

### 6. Quản lý đánh giá

**Truy cập:** `/admin/reviews`

> 📸 **CHỤP ẢNH 33**: Quản lý đánh giá - `/admin/reviews`
> - Danh sách tất cả đánh giá trong hệ thống
> - Các cột: Sản phẩm, Khách hàng, Người bán, Số sao, Nội dung, Ngày, Trạng thái, Hành động
> - Bộ lọc theo số sao, sản phẩm, ngày
> - Tìm kiếm

**Các thao tác:**

#### 6.1. Xem tất cả đánh giá
- Xem đánh giá của tất cả sản phẩm
- Lọc theo số sao (1-5)
- Tìm kiếm theo sản phẩm, khách hàng

#### 6.2. Kiểm duyệt đánh giá

> 📸 **CHỤP ẢNH 34**: Kiểm duyệt đánh giá
> - Chi tiết đánh giá
> - Nút "Duyệt" hoặc "Ẩn"
> - Lý do ẩn (nếu vi phạm)

**Admin có thể:**
- Duyệt đánh giá hợp lệ
- Ẩn đánh giá vi phạm (spam, ngôn từ không phù hợp)
- Xóa đánh giá giả mạo

### 7. Quản lý danh mục (Categories)

> 📸 **CHỤP ẢNH 35**: Quản lý danh mục (nếu có trang riêng)
> - Danh sách categories
> - Thêm/Sửa/Xóa category
> - Thống kê số sản phẩm theo category

**Các thao tác:**
- Thêm danh mục mới
- Chỉnh sửa tên danh mục
- Xóa danh mục (nếu không có sản phẩm)
- Sắp xếp thứ tự hiển thị

### 8. Báo cáo và thống kê

> 📸 **CHỤP ẢNH 36**: Trang báo cáo (nếu có)
> - Biểu đồ doanh thu theo thời gian
> - Top sản phẩm bán chạy
> - Top sellers
> - Thống kê người dùng mới
> - Tỷ lệ đơn hàng thành công/hủy

**Các báo cáo:**
- Doanh thu theo ngày/tuần/tháng
- Sản phẩm bán chạy nhất
- Sellers có doanh thu cao
- Tăng trưởng người dùng
- Tỷ lệ chuyển đổi (conversion rate)

---

## Tính năng chung

### 1. Chuyển đổi giao diện sáng/tối

Tất cả vai trò đều có thể sử dụng tính năng Dark/Light mode.

> 📸 **CHỤP ẢNH 37**: So sánh Dark mode và Light mode
> - Cùng 1 trang nhưng 2 theme khác nhau
> - Có thể chụp Dashboard hoặc trang sản phẩm

### 2. Thông báo (Toast Notifications)

> 📸 **CHỤP ẢNH 38**: Toast notifications
> - Thông báo thành công (màu xanh)
> - Thông báo lỗi (màu đỏ)
> - Thông báo cảnh báo (màu vàng)
> - Vị trí hiển thị (thường ở góc trên bên phải)

**Các loại thông báo:**
- **Success**: Thao tác thành công (thêm vào giỏ hàng, đặt hàng thành công, etc.)
- **Error**: Có lỗi xảy ra
- **Warning**: Cảnh báo
- **Info**: Thông tin

### 3. Header và Navigation

> 📸 **CHỤP ẢNH 39**: Header đầy đủ
> - Logo
> - Menu điều hướng
> - Thanh tìm kiếm (nếu có)
> - Icon giỏ hàng với số lượng
> - Dropdown tài khoản với menu (Thông tin cá nhân, Đơn hàng, Dashboard, Đăng xuất)
> - Nút chuyển theme

### 4. Responsive Design

> 📸 **CHỤP ẢNH 40**: Giao diện trên mobile
> - Chụp trên mobile hoặc responsive mode
> - Menu hamburger
> - Layout responsive

---

## Hỗ trợ và liên hệ

Nếu gặp vấn đề khi sử dụng hệ thống:
- **User**: Liên hệ với Seller hoặc Admin qua email/phone
- **Seller**: Liên hệ Admin để được hỗ trợ
- **Admin**: Kiểm tra logs và hệ thống

---

## Lưu ý bảo mật

- Không chia sẻ mật khẩu cho người khác
- Đăng xuất sau khi sử dụng trên máy tính chung
- Thay đổi mật khẩu định kỳ
- Kiểm tra kỹ thông tin trước khi đặt hàng/thanh toán

---

**Phiên bản:** 1.0
**Ngày cập nhật:** December 2025

