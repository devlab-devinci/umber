'use strict';

import App from '../App';
import Choice from '../Choice';
import Authentication from '../Authentication';
import Home from '../Home';
import VendorHome from "../VendorHome";
import CustomerHome from "../CustomerHome";


const Router = {
    app:App,
    authentication: Authentication,
    choice:Choice,
    home: Home,
    vendorHome: VendorHome,
    customerHome: CustomerHome,
};

export default Router;