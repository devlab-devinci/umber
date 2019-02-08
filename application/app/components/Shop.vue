<template>
    <scroll-view class="green">
      <StackLayout flexDirection="column" v-if="shop" orientation="vertical">
        <Image v-if="shop.picture" width="150rem" :src="shop.picture"></Image>
        <Label :text="shop.companyName" col="1" row="0"></Label>
        <Label text="Offres" col="1" row="0"></Label>
        <Button v-if="cart && cart.cartEntries.length && cart.price" :text="cart.cartEntries.length + ' Afficher le panier ' + cart.price.price" col="2" @tap="showCart(cart)" />
        <ListView height="100%" v-if="items && items.length" flexGrow="1" for="(item, index) in items" @itemTap="" item-key="item._id"  width="100%">
          <v-template>
            <StackLayout>
              <Label :text="'Nom :' + item.name" col="1" row="0"></Label>
              <Label :text="item.description" col="1" row="0"></Label>
              <Image v-if="item.cover && item.cover.name" col="0" row="0" :src="$config.url + '/upload/' + item.cover.name"></Image>
              <Label :text="'Prix :' + item.price" col="3" row="1"/>
              <Label v-if="item.promotion" :text="'Promotion :' + item.promotion" col="3" row="1"/>
              <Button text="Voir le produit" col="2" @tap="showProduct(item)" />
            </StackLayout>
          </v-template>
        </ListView>
        <StackLayout v-else>
          <Label text="Aucun produit n'est disponible dans cette boutique"></Label>
        </StackLayout>
      </StackLayout>
    </scroll-view>
</template>

<script>
  export default {
    props: {
      id: String
    },
    data: function () {
      return {
        shop: null,
        items: null,
        cart: null
      };
    },
    mounted: function () {
      this.fetchShop();
      this.fetchProducts();
    },
    methods: {
      fetchShop: function () {
        let vm = this;
        vm.$http.get('users/' + vm.id)
          .then(shop => {
            vm.shop = shop.data;
          })
          .then(() => {
            vm.$http.get('carts', {params: {buyer: vm.$store.state.currentUser._id, seller: vm.id}})
              .then(cart => {
                vm.cart = _.cloneDeep(cart.data.data[0]);
              })
              .catch(error => console.error(error));
          })
          .catch(error => console.error(error));
      },
      fetchProducts: function () {
        let vm = this;
        vm.$http.get('products', {params: {owner: vm.id}})
          .then(products => {
            vm.items = products.data.data;
          })
          .catch(error => console.error(error));
      },
      showProduct(shopItem) {
        let vm = this;
        this.$showModal(vm.$router.product, {
          props: {
            id: shopItem._id
          },
          animated: true,
          transition: {
            name: "slideTop",
            duration: 380,
            curve: "easeIn"
          }
        })
      },
      showCart(cart) {
        let vm = this;
        this.$navigateTo(vm.$router.cart, {
          props: {
            id: cart._id
          },
          animated: true,
          transition: {
            name: "slideTop",
            duration: 380,
            curve: "easeIn"
          }
        })
      }
    }
  };
</script>
