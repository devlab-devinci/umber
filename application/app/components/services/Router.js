'use strict';

import App from '../App';
import Authentication from '../Authentication';
import Home from '../Home';
import Cart from '../Cart';
import Products from '../Products';
import Shop from '../Shop';

const Router = {
    app:App,
    authentication: Authentication,
    home: Home,
    cart: Cart,
    products: Products,
    shop: Shop
}

export default Router;