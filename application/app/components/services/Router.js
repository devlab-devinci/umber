'use strict';

import App from '../App';
import Authentication from '../Authentication';
import Home from '../Home';
import Cart from '../Cart';
import Products from '../Products';


const Router = {
    app:App,
    authentication: Authentication,
    home: Home,
    cart: Cart,
    products: Products
}

export default Router;