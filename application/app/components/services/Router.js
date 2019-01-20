'use strict';

import App from '../App';
import Authentication from '../Authentication';
import Home from '../Home';
import Cart from '../Cart';
import Products from '../Products';
import Product from '../Product';
import Shop from '../Shop';
import Shops from '../Shops';

const Router = {
    app:App,
    authentication: Authentication,
    home: Home,
    cart: Cart,
    shop: Shop,
    shops: Shops,
    product: Product,
    products: Products
}

export default Router;