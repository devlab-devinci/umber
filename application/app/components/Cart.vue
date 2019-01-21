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
          <GridLayout rows="auto" columns="*,*">
            <Image v-if="item.recipient.picture && item.recipient.picture.name" col="0" row="0" :src="$config.url + '/upload/' + item.recipient.picture.name"></Image>
            <Label :text="item.name" col="1" row="0"></Label>
            <Label :text="item.price" col="1" row="1"/>
            <Button text="Supprimer" col="2" @tap="removeProduct(item)" />
          </GridLayout>
        </v-template>
        <stackLayout>
          <ListView v-if="item && item.cartEntries && item.cartEntries.length" for="entry in item.cartEntries" @itemTap="" item-key="entry._id">
            <v-template>
              <GridLayout for="entry in item.cartEntries" @itemTap="" item-key="entry._id" rows="auto" columns="*,*">
                <Image v-if="entry.product && entry.product.cover && entry.cover.name" col="0" row="0" :src="$config.url + '/upload/' + entry.product.cover.name"></Image>
                <Label :text="entry.product && entry.product.name" col="1" row="0"></Label>
                <Label :text="entry.price" col="1" row="1"/>
                <Button text="Supprimer" col="2" @tap="removeProduct(entry)" />
              </GridLayout>
            </v-template>
          </ListView>
        </stackLayout>
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
            console.log(vm.carts);
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