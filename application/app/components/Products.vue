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
      <ListView for="item in products" @itemTap="" item-key="item._id">
        <v-template>
          <GridLayout rows="auto" columns="*,*">
            <Image v-if="item.cover && item.cover.name" col="0" row="0" :src="$config.url + '/upload/' + item.cover.name"></Image>
            <Label :text="'Nom :' + item.name" col="1" row="0"></Label>
            <Label :text="'Prix :' + item.price" col="3" row="1"/>
            <Button text="Ajouter" col="2" @tap="addProductCart(item)" />
          </GridLayout>
        </v-template>
      </ListView>
    </scroll-view>
  </Page>
</template>

<script>
  export default {
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
        /*vm.$http.get('cart')
          .then(products => {
            vm.products = products.data.data;
          })
          .catch(error => console.error(error));*/
        this.$store.commit('setProductCart', product);
      }
    }
  };
</script>
