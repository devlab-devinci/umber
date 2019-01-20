'use strict';

import App from '../App';
import Authentication from '../Authentication';
import Home from '../Home';
import Cart from '../Cart';
import Products from '../Products';
import Shop from '../Shop';
import Shops from '../Shops';

const Router = {
    app:App,
    authentication: Authentication,
    home: Home,
    cart: Cart,
    /*'shop': {
        path: '/shop/:_id',
        component: Shop
    },*/
    shop: Shop,
    shops: Shops,
    /*'product': {
        path: '/product/:_id',
        component: Products
    },*/
    products: Products
}

export default Router;