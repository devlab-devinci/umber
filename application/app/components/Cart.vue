<template>
  <Page>
    <ActionBar class="action-bar" title="Panier">
      <ActionItem @tap="$navigateTo($router.products)"
                  ios.systemIcon="16" ios.position="right"
                  text="Produits" android.position="popup" />
      <ActionItem @tap="$navigateTo($router.shops)" ios.systemIcon="16" ios.position="right" text="Shop" android.position="popup" />
    </ActionBar>
    <scroll-view class="green">
      <ListView v-if="carts && carts.length" for="item in carts" @itemTap="" item-key="item._id">
        <v-template>
          <StackLayout v-if="item && item.recipient && item.price && item.cartEntries.length" class="list-group-item">
            <Image v-if="item.recipient.picture" col="0" row="0" :src="item.recipient.picture"></Image>
            <Label :text="'Magasin : ' + item.recipient.companyName" col="1" row="0"></Label>
            <Label v-if="(item.cartEntries && item.cartEntries.length)" :text="'Nombres d\'articles : ' + item.cartEntries.length"></Label>
            <Label :text="'Prix total : ' + item.price.price + ' ' + item.price.devise" col="1" row="1"/>
            <ListView v-if="item.cartEntries && item.cartEntries.length" for="entry in item.cartEntries"  @itemTap="" item-key="entry._id">
              <v-template>
                <StackLayout v-if="entry && entry.product">
                  <Label :text="entry.product.name" col="1" row="0"></Label>&ndash;&gt;
                  <Label :text="entry.price" col="1" row="1"/>
                  <Button text="Supprimer" col="2" @tap="removeProduct(entry)" />
                  <Image v-if="entry.product.cover && entry.product.cover.name" col="0" row="0" :src="$config.url + '/upload/' + entry.product.cover.name"></Image>
                </StackLayout>
              </v-template>
            </ListView>
          </StackLayout>
        </v-template>
      </ListView>
    </scroll-view>
  </Page>
</template>

<script>
  export default {
    data: function () {
      return {
        cart: this.$store.state.currentCart,
        carts: null
      };
    },
    mounted: function () {
      this.fetchCarts();
    },
    methods: {
      fetchCarts: function () {
        let vm = this;
        vm.$http.get('carts', {params: {owner: vm.$store.state.currentUser._id}})
          .then(cart => {
            vm.carts = _.cloneDeep(cart.data.data);
          })
          .catch(error => console.error(error));
      },
      removeProduct: function () {
        let findEntry = vm.cartEntries.findIndex(entry => entry.product._id === vm.product._id);
        if (vm.cartEntries.length && findEntry !== -1) {
          vm.cartEntries.splice(findEntry, 1);
        }
        this.$store.commit('removeProductCart', {
          productIndex: this.productIndex
        });
      }
    }
  };
</script>