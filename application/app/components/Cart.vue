<template>
  <Page>
    <ActionBar class="action-bar" title="Shop">
      <ActionItem @tap="$navigateTo($router.shops)"
                  ios.systemIcon="16" ios.position="right"
                  text="Shops" android.position="popup" />
      <ActionItem @tap="$navigateTo($router.carts)"
                  ios.systemIcon="16" ios.position="right"
                  text="Paniers" android.position="popup" />
    </ActionBar>
    <scroll-view class="green">
      <StackLayout flexDirection="column" v-if="cart && cart.seller && cart.buyer" orientation="vertical">
        <Image v-if="cart.seller.picture" width="150rem" :src="cart.seller.picture"></Image>
        <Label :text="cart.seller.companyName" col="1" row="0"></Label>
        <Label text="Offres" col="1" row="0"></Label>
        <ListView height="100%" v-if="items && items.length" flexGrow="1" for="(item, index) in items" @itemTap="" item-key="item._id"  width="100%">
          <v-template>
            <StackLayout>
              <Button text="-" col="2" @tap="removeProduct(item.product, index)" />
              <Image v-if="item.cover && item.cover.name" col="0" row="0" :src="$config.url + '/upload/' + item.cover.name"></Image>
              <Label :text="'Nom :' + item.product.name" col="1" row="0"></Label>
              <Label :text="'Prix :' + item.price" col="3" row="1"/>
              <Button text="Voir le produit" col="2" @tap="showProduct(item.product)" />
            </StackLayout>
          </v-template>
        </ListView>
        <StackLayout v-else>
          <Label text="Aucun produit n'est disponible dans ce pannier"></Label>
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
        cart: null,
        items: null
      };
    },
    mounted: function () {
      this.fetchCart();
    },
    methods: {
      fetchCart: function () {
        let vm = this;
        vm.$http.get('carts/' + vm.id)
          .then(cart => {
            vm.cart = _.cloneDeep(cart.data);
            vm.items = _.cloneDeep(cart.data.cartEntries);
          })
          .catch(error => console.error(error));
      },
      showProduct(item) {
        let vm = this;
        this.$navigateTo(vm.$router.product, {
          props: {
            id: item._id
          },
          animated: true,
          transition: {
            name: "slideTop",
            duration: 380,
            curve: "easeIn"
          }
        })
      },
      removeProduct: function (product, index) {
        let vm = this;

        vm.cart.price.price = vm.cart.price.price - vm.cart.cartEntries[index].price;

        product.stock = product.stock + vm.cart.cartEntries[index].quantity;
        vm.cart.cartEntries.splice(index, 1);


        vm.$http.put('carts/' + vm.cart._id, vm.cart)
          .then(res => {
            vm.cart = _.cloneDeep(res.data);
          })
          .then(() => {
            vm.$http.put('products/' + product._id, product)
              .then(res => {
                console.log(res);
              })
              .catch(error => console.error(error));
          })
          .catch(error => console.error(error));
      }
    }
  };
</script>
