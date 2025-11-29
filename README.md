# Unimerch Client - React + TypeScript + Vite

Frontend application cho hệ thống thương mại điện tử Unimerch, được xây dựng với React, TypeScript và Vite.

## Cấu trúc thư mục

```
unimerch-client/
├── public/                      # Static assets
├── src/
│   ├── assets/                  # Images, fonts, etc.
│   ├── components/              # Reusable components
│   │   ├── Header.tsx          # Header component với navigation
│   │   ├── products/           # Product-related components
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductGrid.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   ├── FilterSection.tsx
│   │   │   └── Pagination.tsx
│   │   └── ...
│   ├── context/                # React Context providers
│   │   ├── AuthContext.tsx     # Authentication context
│   │   └── ToastContext.tsx    # Toast notifications
│   ├── css/                    # Stylesheets
│   │   ├── admin.css          # Admin dashboard styles
│   │   ├── auth.css           # Authentication pages styles
│   │   ├── new-home.css       # Homepage styles
│   │   ├── products-page.css  # Products page styles
│   │   ├── theme.css          # Theme variables (light/dark mode)
│   │   └── ...
│   ├── hooks/                  # Custom React hooks
│   │   └── useAuth.ts         # Authentication hook
│   ├── layout/                 # Layout components
│   │   ├── AuthLayout.tsx     # Layout cho auth pages
│   │   ├── AdminLayout.tsx    # Layout cho admin dashboard
│   │   └── SellerLayout.tsx   # Layout cho seller dashboard
│   ├── pages/                  # Page components
│   │   ├── NewHomePage.tsx    # Trang chủ
│   │   ├── LoginPage.tsx      # Trang đăng nhập
│   │   ├── RegisterPage.tsx   # Trang đăng ký
│   │   ├── AllProductsPage.tsx # Trang danh sách sản phẩm
│   │   ├── ProductDetailPage.tsx # Trang chi tiết sản phẩm
│   │   ├── CartPage.tsx       # Trang giỏ hàng
│   │   ├── CheckoutPage.tsx   # Trang thanh toán
│   │   ├── OrdersPage.tsx     # Trang đơn hàng
│   │   ├── admin/             # Admin pages
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── UsersManagement.tsx
│   │   │   ├── ProductsManagement.tsx
│   │   │   └── ...
│   │   └── seller/            # Seller pages
│   │       ├── SellerDashboard.tsx
│   │       ├── SellerProductsManagement.tsx
│   │       └── ...
│   ├── routes/                 # Routing configuration
│   │   ├── AppRouter.tsx      # Main router
│   │   └── ProtectedRoute.tsx # Route protection
│   ├── services/               # API services
│   │   ├── api.ts            # Axios instance configuration
│   │   ├── authService.ts    # Authentication API calls
│   │   ├── productService.ts # Product API calls
│   │   ├── cartService.ts    # Cart API calls
│   │   └── ...
│   ├── types/                  # TypeScript type definitions
│   │   ├── auth.types.ts     # Auth-related types
│   │   ├── product.types.ts  # Product-related types
│   │   └── ...
│   ├── utils/                  # Utility functions
│   │   └── tokenStorage.ts   # Token management
│   ├── App.tsx                # Root component
│   ├── main.tsx              # Application entry point
│   └── index.css             # Global styles
├── index.html                 # HTML template
├── package.json              # Dependencies
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts          # Vite configuration
└── README.md               # This file
```

## Các tính năng chính

- 🏠 **Trang chủ**: Hero section, sản phẩm nổi bật, collections
- 🛍️ **Sản phẩm**: Danh sách, tìm kiếm, lọc theo category, chi tiết sản phẩm
- 🛒 **Giỏ hàng**: Thêm/xóa sản phẩm, cập nhật số lượng
- 💳 **Thanh toán**: Checkout flow hoàn chỉnh
- 👤 **Quản lý tài khoản**: Đăng ký, đăng nhập, quên mật khẩu
- 📦 **Đơn hàng**: Xem lịch sử đơn hàng, chi tiết đơn hàng
- 🎨 **Theme**: Hỗ trợ chế độ sáng/tối
- 👨‍💼 **Admin Dashboard**: Quản lý users, products, orders, payments, reviews
- 🏪 **Seller Dashboard**: Quản lý shop, sản phẩm, đơn hàng

## Cài đặt và chạy dự án

### Prerequisites
- Node.js >= 16
- npm hoặc yarn

### Installation

```bash
# Clone repository
git clone <repository-url>

# Di chuyển vào thư mục project
cd unimerch-client

# Cài đặt dependencies
npm install

# Chạy development server
npm run dev
```

Server sẽ chạy tại `http://localhost:5173`

### Build cho production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

## Configuration

Cấu hình API endpoint trong file `src/services/api.ts`:

```typescript
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  // ...
});
```

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **React Router DOM** - Routing
- **Axios** - HTTP client
- **Chart.js** - Charts for dashboard
- **CSS Variables** - Theme management

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
