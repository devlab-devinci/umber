
# Umber

  

***Umber est une application mobile ayant pour objectif de connecter consommateurs et vendeurs afin de simplifier la vente d'aliments en tout genre (restauration, traiteur, boulangerie ...), et de permettre aux consommateurs d'avoir un total contrôle sur sa commande***

  

Compatible : IOS / Android

  

## Stack technique

<ul>

<li>Node.js <strong> >= 10.15.2</strong></li>

<li>MongoDB <strong> >= 4.0</strong></li>

<li>Nativescript-vue <strong> >= 10.15.2</strong></li>

<li>Vue.js <strong> >= 2</strong></li>

<li>Typescript <strong> >=3.3.3</strong></li>

<li>npm <strong> >= 6.5.0</strong></li>

</ul>

  

## Structure du projet

  

*Umber se décompose en 3 parties* :

**Application**
Application mobile hybride (Android / IOS), contient l'interface utilisateur (consommateur)  et commerçante (vendeurs)

_Arborescence_
```
umber
│-- application
│------- app
|			api_config.js
|------- App_Resources
|		 app.scss
|------- assets
|------- components
|		 	App.vue
|		 	Authentication.vue
|		 	Cart.vue
|		 	Carts.vue
|		 	Choice.vue
|		 	CustomerHome.vue
|		 	EditProduct.vue
|		 	Home.vue
|		 	ModalProductPicture.vue
|		 	Payment.vue
|		 	Product_detail.vue
|		 	Product.vue
|		 	Products.vue
|		 	SelectPicker.vue
|		 	Shop.vue
|		 	Shops.vue
|		 	Store.vue
|		 	StoreView.vue
|		 	Test.vue
|		 	VendorHome.vue
|--------- services
|				Auth.js
|				FbConfig.js
|				Geolocation.js
|				LoaderConfig.js
|				Router.js
|------- config
|------- fonts
│		 babel.config.js
│------- hooks
|------- node_modules
|		 package.json
|		 package-lock.json
|------- platforms
|		 README.md
|		 webpack.config.js
`
```



**API**
_Arborescence_
```
umber
│-- API
│------- bin
|			www.js
|------- config
|		 	developement.js
|		 	facebook_api.js
|		 	index.js
|		 	Jwt.js
|		 	mapquestapi.js
|		 	CustomerHome.vue
|		 	production.js
|--------- controllers
|				cart.controller.js
|				document.controller.js
|				product.controller.js
|				taxonomy.controller.js
|				user.controller.js
|------- middleware
|				Authentication.js
|------- models
|				cart.model.js
|				CategoryStore.js
|				CategoryStorePicture.js
|				cmdhistorique.model.js
|				command.model.js
|				document.model.js
|				order.model.js
|				product.model.js
|				ProductCategory.model.js
|				Store.model.js
|				storeLike.model.js
|				StorePicture.model.js
|				taxonomy.model.js
|				user.model.js
|				Users.js
│------- node_modules
|------- public
|------- routes
|				advanced.js
|				authentication.js
|				carts.js
|				categoryStore.js
|				document.js
|				index.js
|				position.js
|				productCategory.js
|				product.js
|				store.js
|				taxonomie.js
|				uploads.js
|				users.js
|------- seed
|------- services
|				errorManager.js
|------- upload
|------------- products_pictures
|------- views
|		 README.md
|		 package.json
|		 package-lock.json
|		 server.js
`
```
__advanced.js__
: ***Endpoint  :*** /api/v1/payment/cart/:user_id/:user_name_fb
***Params*** : user_id (mongo objectId) / user_name_fb (token)
***Body*** : N/A
***Method :*** GET
***Authentication :***  required -> fb-access-token (header)
***Data*** : application/json 

: ***Endpoint  :*** /api/v1/dual/categories/:owner_id
***Params*** : owner_id (mongo objectId) 
***Body*** : N/A
***Method :*** GET
***Authentication :***  required -> fb-access-token (header)
***Data*** : application/json 

: ***Endpoint  :*** /api/v1/offer
***Params*** : N/A 
***Body*** : offer (model) / owner_id (mongo ObjectId) 
***Method :*** POST
***Authentication :***  required -> fb-access-token (header)
***Data*** : application/json 

: ***Endpoint  :*** /api/v1/offers/:user_id
***Params*** : user_id (mongo ObjectId) 
***Body*** : N/A
***Method :*** GET
***Authentication :***  required -> fb-access-token (header)
***Data*** : application/json 

: ***Endpoint  :*** /api/v1/offers/:user_id
***Params*** : user_id (mongo ObjectId) 
***Body*** : N/A
***Method :*** GET
***Authentication :***  required -> fb-access-token (header)
***Data*** : application/json 

: ***Endpoint  :*** /api/v1/commands
***Params*** : N/A
***Body*** : command (model) / store_id (mongo ObjectId)
***Method :*** POST
***Authentication :***  required -> fb-access-token (header)
***Data*** : application/json 

: ***Endpoint  :*** /api/v1/cart
***Params*** : N/A
***Body*** : cart (model)
***Method :*** POST
***Authentication :***  required -> fb-access-token (header)
***Data*** : application/json 

: ***Endpoint  :*** /api/products/ajusted
***Params*** : N/A
***Body*** : product (model)
***Method :*** POST
***Authentication :***  required -> fb-access-token (header)
***Data*** : application/json 

: ***Endpoint  :*** /api/v1/commands/:user_id/prepare
***Params*** : user_id (mongo ObjectId) 
***Body*** : N/A
***Method :*** GET
***Authentication :***  required -> fb-access-token (header)
***Data*** : application/json 


: ***Endpoint  :*** /api/v1/commands/:user_id/historic
***Params*** : user_id (mongo ObjectId) 
***Body*** : N/A
***Method :*** GET
***Authentication :***  required -> fb-access-token (header)
***Data*** : application/json 

: ***Endpoint  :*** /api/v1/commands/:user_id/vendor/prepare
***Params*** : user_id (mongo ObjectId) 
***Body*** : N/A
***Method :*** GET
***Authentication :***  required -> fb-access-token (header)
***Data*** : application/json 

: ***Endpoint  :*** /api/v1/commands/:user_id/vendor/historic
***Params*** : user_id (mongo ObjectId) 
***Body*** : N/A
***Method :*** GET
***Authentication :***  required -> fb-access-token (header)
***Data*** : application/json 

: ***Endpoint  :*** /api/v1/commands/archived
***Params*** : N/A
***Body*** : command (model)
***Method :*** PUT
***Authentication :***  required -> fb-access-token (header)
***Data*** : application/json 

: ***Endpoint  :*** /api/v1/search
***Params*** : N/A
***Body*** : search_value (string)
***Method :*** POST
***Authentication :***  required -> fb-access-token (header)
***Data*** : application/json 

: ***Endpoint  :*** /api/v1/like
***Params*** : N/A
***Body*** : store (model) / user_id (mongo ObjectId)
***Method :*** POST
***Authentication :***  required -> fb-access-token (header)
***Data*** : application/json 

: ***Endpoint  :*** /api/product/picture
***Params*** : N/A
***Body*** : file (buffer)
***Method :*** POST
***Authentication :***  required -> fb-access-token (header)
***Data*** : application/json 

: ***Endpoint  :*** /api/stats/:time
***Params*** : time (string enum ['today', 'week' ,'month', 'year'])
***Body*** : N/A
***Method :*** POST
***Authentication :***  required -> fb-access-token (header)
***Data*** : application/json 
	
	__authentication.js__
: ***Endpoint  :*** /api/v1/login/fb
***Params*** : N/A 
***Body*** : user_email (string)
***Method :*** POST
***Authentication :***  required -> fb-access-token (header)
***Data*** : application/json 

: ***Endpoint  :*** /api/v1/current_user/role
***Params*** : N/A 
***Body*** : user (model)
***Method :*** POST
***Authentication :***  required -> fb-access-token (header)
***Data*** : application/json 

__categoryStore.js__
: ***Endpoint  :*** /api/v1/category
***Params*** : N/A 
***Body*** : category (model)
***Method :*** POST
***Authentication :***  required -> fb-access-token (header)
***Data*** : application/json 

: ***Endpoint  :*** /api/v1/category
***Params*** : N/A 
***Body*** : user (model)
***Method :*** DELETE
***Authentication :***  required -> fb-access-token (header)
***Data*** : application/json 

: ***Endpoint  :*** /api/v1/category
***Params*** : N/A 
***Body*** : user (model)
***Method :*** PUT
***Authentication :***  required -> fb-access-token (header)
***Data*** : application/json 

: ***Endpoint  :*** /api/v1/category/:id
***Params*** : user_id (mongo objectid)
***Body*** : N/A
***Method :*** GET
***Authentication :***  required -> fb-access-token (header)
***Data*** : application/json 

: ***Endpoint  :*** /api/v1/category
***Params*** : N/A
***Body*** : N/A
***Method :*** GET
***Authentication :***  required -> fb-access-token (header)
***Data*** : application/json 

: ***Endpoint  :*** /api/v1/category/picture
***Params*** : N/A
***Body*** : id (mongo id) 
***Method :*** POST
***Authentication :***  required -> fb-access-token (header)
***Data*** : application/json 

__position.js__
: ***Endpoint  :*** /api/v1/position/stores/:lat/:lon
***Params*** :  lat (latitude) / lon (longitutde)
***Body*** : N/A
***Method :*** GET
***Authentication :***  required -> fb-access-token (header)
***Data*** : application/json 

__position.js__
: ***Endpoint  :*** /api/v1/position/stores/:lat/:lon
***Params*** :  lat (latitude) / lon (longitutde)
***Body*** : N/A
***Method :*** GET
***Authentication :***  required -> fb-access-token (header)
***Data*** : application/json 

: ***Endpoint  :*** /api/v1/geocoding/localisation/:fullAddress/define/localisation
***Params*** :  fullAddress
***Body*** : N/A
***Method :*** GET
***Authentication :***  required -> fb-access-token (header)
***Data*** : application/json 

__productCategory.js__
: ***Endpoint  :*** /api/v1/product/categories
***Params*** :  N/A
***Body*** : N/A
***Method :*** GET
***Authentication :***  required -> fb-access-token (header)
***Data*** : application/json 

__store.js__
: ***Endpoint  :*** /api/v1/store
***Params*** :  N/A
***Body*** : store (model)
***Method :*** POST
***Authentication :***  required -> fb-access-token (header)
***Data*** : application/json 

: ***Endpoint  :*** /api/v1/store
***Params*** :  N/A
***Body*** : N/A
***Method :*** GET
***Authentication :***  required -> fb-access-token (header)
***Data*** : application/json 

: ***Endpoint  :*** /api/v1/store/:id
***Params*** :  store_id
***Body*** : N/A
***Method :*** GET
***Authentication :***  required -> fb-access-token (header)
***Data*** : application/json 

: ***Endpoint  :*** /api/v1/store
***Params*** :  N/A
***Body*** : store_id
***Method :*** DELETE
***Authentication :***  required -> fb-access-token (header)
***Data*** : application/json 

 : ***Endpoint  :*** /api/v1/store
***Params*** :  N/A
***Body*** : store_id
***Method :*** PUT
***Authentication :***  required -> fb-access-token (header)
***Data*** : application/json 

  : ***Endpoint  :*** /api/v1/store/picture
***Params*** :  N/A
***Body*** : store_id
***Method :*** POST
***Authentication :***  required -> fb-access-token (header)
***Data*** : application/json 

  : ***Endpoint  :*** /api/v1/store/pictures
***Params*** :  N/A
***Body*** : store_id
***Method :*** POST
***Authentication :***  required -> fb-access-token (header)
***Data*** : application/json 

  : ***Endpoint  :*** /api/v1/store/product
***Params*** :  N/A
***Body*** : store_id / product_id
***Method :*** POST
***Authentication :***  required -> fb-access-token (header)
***Data*** : application/json 

  : ***Endpoint  :*** /api/v1/store/product
***Params*** :  N/A
***Body*** : store_id / product_id
***Method :*** DELETE
***Authentication :***  required -> fb-access-token (header)
***Data*** : application/json 

 :  ***Endpoint  :*** /api/v1/:name/category/store
***Params*** :  store_category_name
***Body*** : N/A
***Method :*** POST
***Authentication :***  required -> fb-access-token (header)
***Data*** : application/json 


**Payment_Server**
_Arborescence_
```
umber
│-- Payment_Server
│------- bin
|			[uploads_files_qr_codes]
|			www.js
|------- config
|		 	api_config.js
|		 	Jwt.js
|		 	Stripe.js
|--------- routes
|				index.js
|--------- public
|--------- node_modules
|--------- views
|				error.ejs
|				index.ejs
|				success.ejs
|		   app.js
|		   package.json
|		   package-lock.js
`
```
## Workflow
<img src="https://image.noelshack.com/fichiers/2019/10/2/1551789479-untitled-diagram.png"/>

## Databases



## Run 

__Facebook__ 
<ul>
	<li>Créer un compte facebook developper</li>
	<li>Crééer une application et Configurer le fichier FbConfig.js en fonction de vos données (endpoint etc) de votre application</li>
</ul>

__Stripe__ 
<ul>
	<li>Crééer un compte sur stripe</li>
	<li>Configurer le fichier stripe.js avec vos données stripe</li>
</ul>

__Servers__
<ul>
<li>Lancer pour chaque projects un server via ngrok ou serveo</li>
<li>Configurer pour chaque projet le fichier api_config.js avec les ports et l'url donner par ngrok ou serveo</li>
</ul>

__Commands__
		Tous les projets : 
```terminal$ npm i```
```terminal$ npm -g nodemon```

API : 
```terminal$ nodemon bin/www```

Payment_server :
```terminal $ nodemon bin/www```

Application : 
```terminal
$ npm install -g nativescript
```
```terminal
 tns run ios --bundle (IOS) // tns run android --bundle (Android)```
