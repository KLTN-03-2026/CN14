// Admin imports (sorted alphabetically)
import AccountCreate from "../pages/admin/Account/Create";
import AccountInfo from "../pages/admin/Account/Info";
import AccountList from "../pages/admin/Account/List";

import ArticleCreate from "../pages/admin/Article/Create";
import ArticleList from "../pages/admin/Article/List";

import BannerCreate from "../pages/admin/Banner/Create";
import BannerList from "../pages/admin/Banner/List";

import CategoriesCreate from "../pages/admin/Category/Create";
import CategoriesList from "../pages/admin/Category/List";

import Dashboard from "../pages/admin/Dashboard";
import LayoutAdmin from "../layouts/LayoutAdmin";
import Login from "../pages/admin/Login/index";
import Logout from "../pages/admin/Logout/index";

import OrderList from "../pages/admin/Order/List";

import PrivateRoutes from "../components/PrivateRoutes";

import ProductList from "../pages/admin/Product/List";
import ProductsCreate from "../pages/admin/Product/Createe";

import RoleCreate from "../pages/admin/Role/Create";
import RoleList from "../pages/admin/Role/List";
import RolePermissions from "../pages/admin/Role/Permissions";

import SettingGeneral from "../pages/admin/SettingGeneral";

import UserList from "../pages/admin/User/List";

import VoucherCreate from "../pages/admin/Voucher/Create";
import VoucherList from "../pages/admin/Voucher/List";

// Client imports (sorted alphabetically)
import AboutUs from "../pages/clients/AboutUs";
import BannerDetail from "../pages/clients/BannerDetail";
import Blog from "../pages/clients/Blog";
import Cart from "../pages/clients/Cart";
import Categories from "../components/Categories";
import DetailProduct from "../pages/clients/DetailProduct";
import Home from "../pages/clients/Home";
import InfoUser from "../pages/clients/InfoUser";
import LayoutDefault from "../layouts/LayoutDefault";
import LogoutUser from "../pages/clients/LogoutUser";
import Orders from "../pages/clients/Orders/List";
import ArticleDetail from "../pages/clients/articles/Detail";
import Search from "../pages/clients/Search";
import LoginUser from "../pages/clients/LoginUser";
import Register from "../pages/clients/Register";
import ForgotPassword from "../pages/clients/ForgotPassword";
import CheckoutPay from "../pages/clients/Checkout/Pay";
import InfoCheckOut from "../pages/clients/Checkout/Info";
import SuccessCheckout from "../pages/clients/Checkout/Success";
import FavoriteProducts from "../pages/clients/FavoriteProducts";
import ProductTrash from "../pages/admin/Trash/Product";
import CategoryTrash from "../pages/admin/Trash/Category";
import ArticleTrash from "../pages/admin/Trash/Article";
import BannerTrash from "../pages/admin/Trash/Banner";
import UserTrash from "../pages/admin/Trash/User";
import AccountTrash from "../pages/admin/Trash/Account";
import VoucherTrash from "../pages/admin/Trash/Voucher";
import CampaignList from "../pages/admin/Campaign/List";
import CampaignCreate from "../pages/admin/Campaign/Create";
import ListCampaign from "../pages/clients/Campaign/List";
import DetailCampaign from "../pages/clients/Campaign/Detail";
import Support from "../pages/clients/Support/Index";
import Transaction from "../pages/admin/Transaction";
import VoucherGiftList from "../pages/admin/VoucherGift/List";
import VoucherGiftCreate from "../pages/admin/VoucherGift/Create";
import FailCheckout from "../pages/clients/Checkout/Fail";
import OrderLookup from "../pages/clients/Orders/Search";
import VoucherGiftTrash from "../pages/admin/Trash/VoucherGift";
import BrandTrash from "../pages/admin/Trash/Brand";
import CampaignTrash from "../pages/admin/Trash/Campaign";
import ContactList from "../pages/admin/Contact/List";
import AuthorCreate from "../pages/admin/Author/Create";
import AuthorList from "../pages/admin/Author/List";
import PublisherList from "../pages/admin/Publisher/List";
import PublisherCreate from "../pages/admin/Publisher/Create";


const pathAdmin = "admin";

export const routes = [
  {
    path: "/",
    element: <LayoutDefault />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: "logout",
        element: <LogoutUser />
      },
      {
        path: "search",
        element: <Search />
      },
      {
        path: "detail/:slug",
        element: <DetailProduct />
      },
      {
        path: "order/cart",
        element: <Cart />
      },
      {
        path: "order/info-checkout",
        element: <InfoCheckOut />
      },
      {
        path: "order/checkout/pay",
        element: <CheckoutPay />
      },
      {
        path: "info-user",
        element: <InfoUser />
      },
      {
        path: `danh-muc`,
        element: <Categories />
      },
      {
        path: `order/history`,
        element: <Orders />
      },
      {
        path: `order/search/:code/:email`,
        element: <OrderLookup />
      },
      {
        path: `articles/:slug`,
        element: <ArticleDetail />
      },
      {
        path: `order/checkout/pay/success/:code`,
        element: <SuccessCheckout />
      },
      {
        path: `order/checkout/pay/fail/:code`,
        element: <FailCheckout />
      },
      {
        path: `banner/:slug`,
        element: <BannerDetail />
      },
      {
        path: `blog`,
        element: <Blog />
      },
      {
        path: `about-us`,
        element: <AboutUs />
      },
      {
        path: "login",
        element: <LoginUser />
      },
      {
        path: "register",
        element: <Register />
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />
      },
      {
        path: "favorite-products",
        element: <FavoriteProducts />
      },
      {
        path: "campaign",
        element: <ListCampaign />
      },
      {
        path: "campaign/:slug",
        element: <DetailCampaign />
      },
      {
        path: "ho-tro/:slug",
        element: <Support />
      }
    ]
  },
  {
    element: <PrivateRoutes />,
    children: [
      {
        element: <LayoutAdmin />,
        children: [
          {
            path: `${pathAdmin}/dashboard`,
            element: <Dashboard />
          },

          {
            path: `${pathAdmin}/products`,
            element: <ProductList />
          },
          {
            path: `${pathAdmin}/products/create`,
            element: <ProductsCreate />
          },

          {
            path: `${pathAdmin}/authors`,
            element: <AuthorList />
          },
          {
            path: `${pathAdmin}/authors/create`,
            element: <AuthorCreate />
          },

          {
            path: `${pathAdmin}/publishers`,
            element: <PublisherList />
          },
          {
            path: `${pathAdmin}/publishers/create`,
            element: <PublisherCreate />
          },

          {
            path: `${pathAdmin}/product-category`,
            element: <CategoriesList />
          },
          {
            path: `${pathAdmin}/product-category/create`,
            element: <CategoriesCreate />
          },
          {
            path: `${pathAdmin}/roles`,
            element: <RoleList />
          },
          {
            path: `${pathAdmin}/roles/permissions`,
            element: <RolePermissions />
          },
          {
            path: `${pathAdmin}/roles/create`,
            element: <RoleCreate />
          },

          {
            path: `${pathAdmin}/accounts`,
            element: <AccountList />
          },
          {
            path: `${pathAdmin}/accounts/create`,
            element: <AccountCreate />
          },

          {
            path: `${pathAdmin}/settings/general`,
            element: <SettingGeneral />
          },

          {
            path: `${pathAdmin}/users`,
            element: <UserList />
          },

          {
            path: `${pathAdmin}/orders`,
            element: <OrderList />
          },

          {
            path: `${pathAdmin}/articles`,
            element: <ArticleList />
          },
          {
            path: `${pathAdmin}/articles/create`,
            element: <ArticleCreate />
          },
          {
            path: `${pathAdmin}/campaigns`,
            element: <CampaignList />
          },
          {
            path: `${pathAdmin}/campaigns/create`,
            element: <CampaignCreate />
          },
          {
            path: `${pathAdmin}/account-info`,
            element: <AccountInfo />
          },
          {
            path: `${pathAdmin}/vouchers`,
            element: <VoucherList />
          },
          {
            path: `${pathAdmin}/vouchers/create`,
            element: <VoucherCreate />
          },
          {
            path: `${pathAdmin}/banners`,
            element: <BannerList />
          },
          {
            path: `${pathAdmin}/banners/create`,
            element: <BannerCreate />
          },
          {
            path: `${pathAdmin}/trashs/products`,
            element: <ProductTrash />
          },
          {
            path: `${pathAdmin}/trashs/categories`,
            element: <CategoryTrash />
          },
          {
            path: `${pathAdmin}/trashs/articles`,
            element: <ArticleTrash />
          },
          {
            path: `${pathAdmin}/trashs/banners`,
            element: <BannerTrash />
          },
          {
            path: `${pathAdmin}/trashs/users`,
            element: <UserTrash />
          },
          {
            path: `${pathAdmin}/trashs/accounts`,
            element: <AccountTrash />
          },
          {
            path: `${pathAdmin}/trashs/vouchers`,
            element: <VoucherTrash />
          },
          {
            path: `${pathAdmin}/trashs/voucher-gifts`,
            element: <VoucherGiftTrash />
          },
          {
            path: `${pathAdmin}/trashs/brands`,
            element: <BrandTrash />
          },
          {
            path: `${pathAdmin}/trashs/campaigns`,
            element: <CampaignTrash />
          },
          {
            path: `${pathAdmin}/transactions`,
            element: <Transaction />
          },
          {
            path: `${pathAdmin}/contacts`,
            element: <ContactList />
          },
          {
            path: `${pathAdmin}/voucher-gift`,
            element: <VoucherGiftList />
          },
          {
            path: `${pathAdmin}/voucher-gift/create`,
            element: <VoucherGiftCreate />
          },
        ]
      }
    ]
  },
  {
    path: "auth/login",
    element: <Login />
  },
  {
    path: "auth/logout",
    element: <Logout />
  }
]