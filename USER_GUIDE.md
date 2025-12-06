# HƯỚNG DẪN SỬ DỤNG HỆ THỐNG UNIMERCH

## Mục lục
1. [Giới thiệu](#giới-thiệu)
2. [Hướng dẫn cho Người dùng (User)](#hướng-dẫn-cho-người-dùng-user)
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

<img width="1972" height="1524" alt="image" src="https://github.com/user-attachments/assets/2e9c9a8b-d65c-4467-9d6c-369804694cde" />


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

<img width="712" height="1169" alt="image" src="https://github.com/user-attachments/assets/d0861ad9-b283-46d8-9a84-e4881e45f9bc" />


**Bước 2:** Nhập thông tin đăng nhập
- Email: Email đã đăng ký
- Password: Mật khẩu

**Bước 3:** Nhấn "Đăng nhập"

**Lưu ý:** Nếu quên mật khẩu, nhấn vào "Quên mật khẩu?" để reset

<img width="693" height="738" alt="image" src="https://github.com/user-attachments/assets/2baf15a7-7791-4191-81bb-e0a3e31d24fc" />


### 3. Trang chủ

Sau khi đăng nhập thành công, bạn sẽ được chuyển đến trang chủ.

<img width="2867" height="1612" alt="image" src="https://github.com/user-attachments/assets/45e2ac6b-db9f-4d2e-a0b6-d3bdaebd9cc6" />

**Các phần chính trên trang chủ:**
- **Header**: Menu điều hướng, tìm kiếm, giỏ hàng, tài khoản
- **Hero Section**: Banner quảng cáo chính
- **Featured Products**: Sản phẩm nổi bật/mới nhất
- **Collections**: Các danh mục sản phẩm

### 4. Xem danh sách sản phẩm

**Cách 1:** Nhấn vào "Sản phẩm" trên menu header
**Cách 2:** Truy cập `/all-products`

<img width="2876" height="1615" alt="image" src="https://github.com/user-attachments/assets/706cae76-0d71-4b18-a25b-d5358ea2d03f" />


**Các tính năng:**
- **Tìm kiếm**: Nhập tên sản phẩm vào thanh tìm kiếm
- **Lọc theo danh mục**: Chọn category để lọc sản phẩm
- **Phân trang**: Điều hướng qua các trang sản phẩm
- **Sắp xếp**: Sắp xếp theo giá, tên, mới nhất

### 5. Xem chi tiết sản phẩm

**Bước 1:** Nhấn vào một sản phẩm từ danh sách

<img width="2876" height="1537" alt="image" src="https://github.com/user-attachments/assets/2b74ec7f-e8aa-425a-bd1e-1dfa0b365c36" />


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

<img width="624" height="2330" alt="image" src="https://github.com/user-attachments/assets/59f0aef4-569f-4065-b4bf-2ac27dc126e9" />


**Các thao tác:**
- **Xem sản phẩm**: Danh sách tất cả sản phẩm đã thêm
- **Thay đổi số lượng**: Nhấn nút +/- để tăng/giảm số lượng
- **Xóa sản phẩm**: Nhấn nút "Xóa" hoặc biểu tượng thùng rác
- **Xem tổng tiền**: Hiển thị ở cuối giỏ hàng
- **Thanh toán**: Nhấn "Thanh toán" để chuyển sang bước checkout

### 7. Thanh toán (Checkout)

<img width="2849" height="1537" alt="image" src="https://github.com/user-attachments/assets/bac7881b-b621-4051-b486-fcccfff12e19" />

<img width="1395" height="1162" alt="image" src="https://github.com/user-attachments/assets/d5fec2b2-e9cd-4762-b43e-fb42e3cb6e02" />


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

<img width="2869" height="1530" alt="image" src="https://github.com/user-attachments/assets/02573afc-e545-4c86-8187-3b917e189cae" />


**Xem chi tiết đơn hàng:**

<img width="1687" height="1130" alt="image" src="https://github.com/user-attachments/assets/adc663d3-ebb7-4e42-bd8a-19c928197f03" />


**Các trạng thái đơn hàng:**
- **Pending**: Chờ xác nhận
- **Processing**: Đang xử lý
- **Shipped**: Đang giao hàng
- **Delivered**: Đã giao hàng
- **Cancelled**: Đã hủy

### 9. Chế độ sáng/tối (Dark/Light Mode)

<img width="2869" height="1542" alt="image" src="https://github.com/user-attachments/assets/9426365e-d5df-4364-bf91-771571c52914" />
<img width="2838" height="1632" alt="image" src="https://github.com/user-attachments/assets/bd9cb238-7417-401d-ae9b-0f16ad242d6f" />


**Cách sử dụng:**
- Nhấn vào icon mặt trời/mặt trăng trên header để chuyển đổi

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

