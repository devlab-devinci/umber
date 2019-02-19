<template>
  <Page>
    <scroll-view class="green">
      <StackLayout v-if="product">
        <StackLayout>
          <Label :text="'Nom :' + product.name" col="1" row="0"></Label>
          <Label :text="product.description" col="1" row="0"></Label>
          <Image v-if="product.cover && product.cover.name" col="0" row="0" :src="$config.url + '/upload/' + product.cover.name"></Image>
          <Label :text="'Prix :' + product.price" col="3" row="1"/>
          <Label v-if="product.promotion" :text="'Promotion :' + product.promotion" col="3" row="1"/>
          <Label :text="product.stock > 0 ? 'Restant :' + product.stock : 'Produit indisponible'"/>
        </StackLayout>
        <template v-if="product.stock > 0">
          <StackLayout>
            <Button text="+" @tap="addQuantity()" />
            <Label :text="quantity"></Label>
            <Button text="-" @tap="lessQuantity()" />
            <Button :text="((cart && cart.cartEntries && cart.cartEntries.findIndex(entry => entry.product._id === product._id) !== -1) ? 'Mettre à jour ' : 'Ajouter ' ) + price + '€'" @tap="addProductCart()" />
          </StackLayout>
        </template>
      </StackLayout>
    </scroll-view>
  </Page>
</template>

<script>
  import _ from 'lodash';
  import {LoadingIndicator} from "nativescript-loading-indicator";
  const loaderOptions = require('./services/LoaderConfig').getOptions();
  const loader = new LoadingIndicator();
  import {Feedback, FeedbackType, FeedbackPosition} from "nativescript-feedback";

  export default {
    props: {
      id: String
    },
    data: function () {
      return {
        product: null,
        quantity: 1,
        stock: 0,
        price: 0,
        cart: null
      };
    },
    mounted: function () {
      // this.fetchProduct();
    },
    created: function () {
      let vm = this;
      const headers = {
        'fb-access-token': this.$store
          .getters.getAccessToken

      };
      console.log(vm.id);
      vm.$http.get('api/v1/products/' + vm.id,  {headers: headers})
        .then(product => {
          vm.product = _.cloneDeep(product.data);
          vm.price = vm.product.promotion || vm.product.price;
          vm.stock = vm.product.stock - 1;
        })
        .then(() => {
          vm.$http.get('api/v1/carts', {params: {buyer: vm.$store.getters.getCurrentUser._id, seller: vm.product.owner._id}, headers: headers})
            .then(cart => {
              vm.cart = _.cloneDeep(cart.data.data[0]);
            })
            .catch(error => console.error(error));
        })
        .catch(error => console.error(error));
    },
    methods: {
      fetchProduct: function () {
        let vm = this;
        const headers = {
          'fb-access-token': this.$store
            .getters.getAccessToken

        };
        vm.$http.get('api/v1/products/' + vm.id,  {headers: headers})
          .then(product => {
            console.log(product);
            vm.product = _.cloneDeep(product.data);
            vm.price = vm.product.promotion || vm.product.price;
            vm.stock = vm.product.stock - 1;
          })
          .then(() => {
            vm.$http.get('api/v1/carts', {params: {buyer: vm.$store.getters.getCurrentUser._id, seller: vm.product.owner._id}, headers: headers})
              .then(cart => {
                vm.cart = _.cloneDeep(cart.data.data[0]);
              })
              .catch(error => console.error(error));
          })
          .catch(error => console.error(error));
      },
      addProductCart: function () {
        let vm = this;
        let method = 'put';
        const headers = {
          'fb-access-token': this.$store
            .getters.getAccessToken

        };
        let feedback = new Feedback();
        let newProduct = _.cloneDeep(vm.cart);

        if (!vm.cart) {
          method = 'post';
          newProduct = {};
          newProduct.seller = vm.product.owner;
          newProduct.buyer = vm.$store.state.currentUser;
          newProduct.cartEntries = [];
          newProduct.price = { price: 0 };
        }

        let resource = method === 'put' ? 'carts/' + vm.cart._id : 'carts';

        let findEntry = newProduct.cartEntries.findIndex(entry => entry.product._id === vm.product._id);

        if (newProduct.cartEntries.length && findEntry !== -1) {
          let oldEntryQuantity = newProduct.cartEntries[findEntry].quantity;
          newProduct.cartEntries[findEntry].quantity = vm.quantity;
          newProduct.cartEntries[findEntry].price = vm.price;

          if (vm.quantity === 0 && newProduct.price) {
            newProduct.price.price = (!newProduct.price.price || newProduct.price.price === 0) ? 0 : parseInt(newProduct.price.price - newProduct.cartEntries[findEntry].price);
            vm.product.stock = vm.product.stock + oldEntryQuantity;
            newProduct.cartEntries.splice(findEntry, 1);

          } else{
            vm.product.stock = vm.stock;
          }

        } else if (vm.quantity > 0) {
          newProduct.cartEntries.push({product: vm.product, quantity: vm.quantity, price: vm.price});
          vm.product.stock = vm.stock;
        }

        newProduct.price.price = 0;

        _.each(newProduct.cartEntries, function (entry) {
          newProduct.price.price = newProduct.price.price + entry.price;
        });

        vm.$http[method](`api/v1/${resource}`, newProduct, {headers: headers})
          .then(cart => {
            vm.cart = _.cloneDeep(cart.data);
            if (cart.data) {
              loader.hide();
              feedback
                .success({
                  title: "Félicitation !",
                  titleColor: new Color("#222222"),
                  type: FeedbackType.Custom, // this is the default type, by the way
                  message: `Offre ajouté !`,
                  messageColor: new Color("#333333"),
                  duration: 2000,
                  backgroundColor: new Color("yellowgreen")
                });
            } else {
              loader.hide()
              feedback
                .error({
                  message: "Une erreur survenue. Veuillez réessayer"
                });
            }
          })
          /* .then(() => {
            vm.$http.put('products/' + vm.product._id, vm.product)
              .then(product => {
                vm.product = _.cloneDeep(product.data);
                vm.stock = vm.product.stock - 1;
                vm.price = vm.product.promotion || vm.product.price;
                vm.quantity = 1;
              })
              .catch(error => console.error(error));
          })*/
          .catch((error) => {
            console.error(error)
            loader.hide()
            feedback
              .warning("Oups, une erreur est surevenue. Veuillez réessayer plus tard")
          });
      },
      addQuantity: function () {
        if (0 < this.stock) {
          this.quantity++;
          this.price = Math.round(((this.product.promotion || this.product.price) * this.quantity)*100)/100;
          this.stock--;
        }
      },
      lessQuantity: function () {
        if (this.quantity > 0) {
          this.quantity--;
          this.price = Math.round(((this.product.promotion || this.product.price) * this.quantity)*100)/100;
          this.stock++;
        }
      }
    }
  };
</script>
