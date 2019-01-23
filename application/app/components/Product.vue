<template>
  <Page>
    <ActionBar class="action-bar" :title="product && product.name">
      <ActionItem @tap="$navigateTo($router.cart)"
                  ios.systemIcon="16" ios.position="right"
                  text="Panier" android.position="popup" />
      <ActionItem @tap="$navigateTo($router.shops)"
                  ios.systemIcon="16" ios.position="right"
                  text="Shop" android.position="popup" />
      <ActionItem @tap="$navigateTo($router.products)"
                  ios.systemIcon="16" ios.position="right"
                  text="Products" android.position="popup" />
    </ActionBar>
    <scroll-view class="green">
      <StackLayout v-if="product">
        <StackLayout>
          <Image v-if="product.cover && product.cover.name" :src="$config.url + '/upload/' + product.cover.name"></Image>
          <Label v-if="product.name" :text="'Nom :' + product.name"></Label>
          <Label :text="'Prix :' + product.price"/>
          <Label :text="product.stock > 0 ? 'Quantité :' + product.stock : 'Produit indisponible'"/>
        </StackLayout>
        <template v-if="product.stock > 0">
          <StackLayout>
            <Button text="+" @tap="addQuantity()" />
            <Label :text="quantity"></Label>
            <Button text="-" @tap="lessQuantity()" />
            <Button :text="quantity > 0 ? 'Ajouter' : 'Retirer'" @tap="addProductCart()" />
          </StackLayout>
        </template>
      </StackLayout>
    </scroll-view>
  </Page>
</template>

<script>
  import _ from 'lodash';
  export default {
    props: {
      id: String
    },
    data: function () {
      return {
        product: null,
        quantity: 1,
        stock: 0,
        cart: null
      };
    },
    mounted: function () {
      this.fetchProduct();
    },
    methods: {
      fetchProduct: function () {
        let vm = this;
        vm.$http.get('products/' + vm.id)
          .then(product => {
            vm.product = _.cloneDeep(product.data);
            vm.stock = vm.product.stock - 1;
          })
          .then(() => {
            vm.cart.recipient = vm.product.recipient;
            vm.$http.get('carts', {params: {owner: vm.$store.state.currentUser._id, recipient: vm.product.owner._id}})
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
        let newProduct = _.cloneDeep(vm.cart);

        if (!vm.cart) {
          method = 'post';
          newProduct = {};
          newProduct.recipient = vm.product.owner;
          newProduct.owner = vm.$store.state.currentUser;
          newProduct.cartEntries = [];
          newProduct.price = { price: 0 };
        }

        let resource = method === 'put' ? 'carts/' + vm.cart._id : 'carts';

        let findEntry = newProduct.cartEntries.findIndex(entry => entry.product._id === vm.product._id);

        if (newProduct.cartEntries.length && findEntry !== -1) {
          newProduct.cartEntries[findEntry].quantity = vm.quantity;
          newProduct.cartEntries[findEntry].price = parseInt(vm.quantity * vm.product.price);
          if (vm.quantity === 0) {
            if (newProduct.price) {
              newProduct.price.price = (!newProduct.price.price || newProduct.price.price === 0) ? 0 : parseInt(newProduct.price.price - newProduct.cartEntries[findEntry].price);
            }
            newProduct.cartEntries.splice(findEntry, 1);
          }
        } else if (vm.quantity > 0) {
          newProduct.cartEntries.push({product: vm.product, quantity: vm.quantity, price: parseInt(vm.quantity * vm.product.price)});
        }

        newProduct.price.price = 0;
        _.each(newProduct.cartEntries, function (entry) {
          newProduct.price.price = newProduct.price.price + entry.price;
        });

        vm.product.stock = vm.stock;
        vm.$http[method](resource, newProduct)
          .then(cart => {
            vm.cart = _.cloneDeep(cart.data);
          })
          .then(() => {
            vm.$http.put('products/' + vm.product._id, vm.product)
              .then(product => {
                vm.product = _.cloneDeep(product.data);
                vm.stock = vm.product.stock - 1;
                vm.quantity = 1;
              })
              .catch(error => console.error(error));
          })
          .catch(error => console.error(error));
      },
      addQuantity: function () {
        if (0 < this.stock) {
          this.quantity++;
          this.stock--;
        }
      },
      lessQuantity: function () {
        if (this.quantity > 0) {
          this.quantity--;
          this.stock++;
        }
      }
    }
  };
</script>
