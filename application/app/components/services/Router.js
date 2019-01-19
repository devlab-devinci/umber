'use strict';

import App from '../App';
import Choice from '../Choice';
import Authentication from '../Authentication';
import Home from '../Home';
import Cart from '../Cart';
import Products from '../Products';
import VendorHome from "../VendorHome";
import CustomerHome from "../CustomerHome";

const Router = {
    app:App,
    authentication: Authentication,
    choice:Choice,
    home: Home,
    cart: Cart,
    products: Products,
    vendorHome: VendorHome,
    customerHome: CustomerHome,
};

export default Router;