'use strict';

import App from '../App';
import Choice from '../Choice';
import Authentication from '../Authentication';
import Home from '../Home';
import Cart from '../Cart';
import Carts from '../Carts';
import Products from '../Products';
import VendorHome from "../VendorHome";
import CustomerHome from "../CustomerHome";
import Product from '../Product';
import Shop from '../Shop';
import Shops from '../Shops';
import EditProduct from "../EditProduct";
import Store from '../Store';
import StoreView from '../StoreView';
import ProductDetail from '../Product_detail';

const Router = {
    app: App,
    authentication: Authentication,
    choice: Choice,
    home: Home,
    carts: Carts,
    cart: Cart,
    editProduct: EditProduct,
    vendorHome: VendorHome,
    customerHome: CustomerHome,
    shop: Shop,
    shops: Shops,
    product: Product,
    products: Products,
    storeView: StoreView,
    store: Store,
    product_detail: ProductDetail
};

export default Router;