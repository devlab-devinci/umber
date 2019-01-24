<template>
  <Page>
    <ActionBar class="action-bar" title="Produits">
      <ActionItem @tap="$navigateTo($router.products)"
                  ios.systemIcon="16" ios.position="right"
                  text="Produits" android.position="popup" />
      <ActionItem @tap="$navigateTo($router.shops)"
                  ios.systemIcon="16" ios.position="right"
                  text="Shops" android.position="popup" />
    </ActionBar>
    <scroll-view class="green">
      <ListView v-if="items && items.length" for="item in items" @itemTap="" item-key="item._id">
        <v-template>
          <StackLayout v-if="item.cartEntries && item.seller && item.cartEntries.length" rows="auto" columns="*,*">
            <Image v-if="item.seller.picture" width="150rem" :src="item.seller.picture"></Image>
            <Label :text="item.companyName" col="1" row="0"></Label>
            <Button text="Voir le panier" col="2" @tap="showCart(item)" />
            <Label :text="'Nombres d\'articles ' + item.cartEntries.length" col="1" row="0"></Label>
          </StackLayout>
        </v-template>
      </ListView>
      <StackLayout v-else>
        <StackLayout>
          <Label text="Aucun panier n'est disponible"></Label>
        </StackLayout>
      </StackLayout>
    </scroll-view>
  </Page>
</template>

<script>
  export default {
    data: function () {
      return {
        items: null
      };
    },
    mounted: function () {
      this.fetchCarts();
    },
    methods: {
      fetchCarts: function () {
        let vm = this;
        vm.$http.get('carts', {params: {buyer: vm.$store.state.currentUser._id}})
          .then(carts => {
            vm.items = carts.data.data;
            console.log(vm.items);
          })
          .catch(error => console.error(error));
      },
      showCart(cartItem) {
        let vm = this;
        this.$navigateTo(vm.$router.cart,{
          props: {
            id: cartItem._id
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
