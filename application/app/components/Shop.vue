<template>
  <Page>
    <ActionBar class="action-bar" title="Shop">
      <ActionItem @tap="$navigateTo($router.products)"
                  ios.systemIcon="16" ios.position="right"
                  text="Produits" android.position="popup" />
      <ActionItem @tap="$navigateTo($router.cart)"
                  ios.systemIcon="16" ios.position="right"
                  text="Panier" android.position="popup" />
    </ActionBar>
    <scroll-view class="green">
      <StackLayout flexDirection="column" v-if="shop" orientation="vertical">
        <Image v-if="shop.picture" width="150rem" :src="shop.picture"></Image>
        <Label :text="shop.companyName" col="1" row="0"></Label>
        <Label text="Offres" col="1" row="0"></Label>
        <ListView height="100%" v-if="items && items.length" flexGrow="1" :items="items" @itemTap="" item-key="item._id"  width="100%">
          <v-template>
            <StackLayout>
              <Image v-if="item.cover && item.cover.name" col="0" row="0" :src="$config.url + '/upload/' + item.cover.name"></Image>
              <Label :text="'Nom :' + item.name" col="1" row="0"></Label>
              <Label :text="'Prix :' + item.price" col="3" row="1"/>
              <Button text="Voir le produit" col="2" @tap="showProduct(item)" />
            </StackLayout>
          </v-template>
        </ListView>
        <StackLayout v-else>
          <Label text="Aucun produit n'est disponible dans cette boutique"></Label>
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
        shop: null,
        items: null
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
        this.$navigateTo(vm.$router.product, {
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
      }
    }
  };
</script>
