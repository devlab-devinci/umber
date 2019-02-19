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
import EditProduct from "../EditProduct";
import Store from '../Store';
import StoreView from '../StoreView';

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
    product: Product,
    products: Products,
    storeView: StoreView,
    store: Store
};

export default Router;
