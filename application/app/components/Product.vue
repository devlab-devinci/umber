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
        </StackLayout>
        <StackLayout>
          <Label v-if="product.name" :text="'Nom :' + product.name"></Label>
        </StackLayout>
        <StackLayout>
          <Label :text="'Prix :' + product.price"/>
        </StackLayout>
        <StackLayout>
          <Button text="+" @tap="addQuantity()" />
        </StackLayout>
        <StackLayout>
          <Label :text="quantity"></Label>
        </StackLayout>
        <StackLayout>
          <Button text="-" @tap="lessQuantity()" />
        </StackLayout>
        <StackLayout>
          <Button text="Ajouter" @tap="addProductCart(product)" />
        </StackLayout>
      </StackLayout>
    </scroll-view>
  </Page>
</template>

<script>
  export default {
    props: {
      id: String
    },
    data: function () {
      return {
        product: null,
        quantity: 1,
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
            vm.product = product.data;
            vm.$http.get('carts', {params: {owner: vm.$store.state.currentUser._id, recipient: vm.product.owner._id}})
              .then(cart => {
                vm.cart = cart.data.data;
              })
              .catch(error => console.error(error));
          })
          .catch(error => console.error(error));
      },
      addProductCart: function (product) {
        let vm = this;
        let newProduct = {};
        newProduct.recipient = {user: vm.id};
        newProduct.owner = vm.$store.state.currentUser;
        newProduct.cartEntries = [];
        newProduct.cartEntries.push({product: vm.product, quantity: vm.quantity});

        let method = vm.cart ? 'put' : 'post';

        vm.$http[method]('carts', newProduct)
          .then(products => {
            vm.products = products.data.data;
          })
          .catch(error => console.error(error));

        this.$store.commit('setProductCart', product);
      },
      addQuantity: function () {
        if (this.quantity < this.product.max) {
          this.quantity++;
        }
      },
      lessQuantity: function () {
        if (this.quantity > 1) {
          this.quantity--;
        }
      }
    }
  };
</script>
