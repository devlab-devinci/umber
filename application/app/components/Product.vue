<template>
  <Page>
    <ActionBar class="action-bar" title="Produits">
      <ActionItem @tap="$navigateTo($router.cart)"
                  ios.systemIcon="16" ios.position="right"
                  text="Panier" android.position="popup" />
      <ActionItem @tap="$navigateTo($router.shops)"
                  ios.systemIcon="16" ios.position="right"
                  text="Shop" android.position="popup" />
    </ActionBar>
    <scroll-view class="green">
      <Label :text="'Nom :' + item.id" col="1" row="0"></Label>
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
        products: null
      };
    },
    mounted: function () {
      this.fetchProducts();
    },
    methods: {
      fetchProducts: function () {
        let vm = this;
        vm.$http.get('products')
          .then(products => {
            vm.products = products.data.data;
          })
          .catch(error => console.error(error));
      },
      addProductCart: function (product) {
        vm.$http.get('cart')
          .then(products => {
            vm.products = products.data.data;
          })
          .catch(error => console.error(error));
        this.$store.commit('setProductCart', product);
      }
    }
  };
</script>
