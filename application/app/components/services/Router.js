'use strict';

import App from '../App';
import Choice from '../Choice';
import Authentication from '../Authentication';
import Home from '../Home';
import Cart from '../Cart';
import Products from '../Products';
import VendorHome from "../VendorHome";
import CustomerHome from "../CustomerHome";
import Product from '../Product';
import Shop from '../Shop';
import Shops from '../Shops';

const Router = {
    app:App,
    authentication: Authentication,
    choice:Choice,
    home: Home,
    cart: Cart,
    vendorHome: VendorHome,
    customerHome: CustomerHome,
    shop: Shop,
    shops: Shops,
    product: Product,
    products: Products
}

export default Router;