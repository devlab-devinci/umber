<template>
  <Page>
    <ActionBar class="action-bar" title="Shops">
      <ActionItem @tap="$navigateTo($router.products)"
                  ios.systemIcon="16" ios.position="right"
                  text="Produits" android.position="popup" />
      <ActionItem @tap="$navigateTo($router.carts)"
                  ios.systemIcon="16" ios.position="right"
                  text="Paniers" android.position="popup" />
    </ActionBar>
    <scroll-view class="green">
      <ListView v-if="items && items.length" :items="items" item-key="item._id">
        <v-template>
          <GridLayout rows="auto" columns="*,*">
            <Image v-if="item.picture" col="0" row="0" :src="item.picture"></Image>
            <Label :text="item.companyName" col="1" row="0"></Label>
            <Button text="Voir le shop" col="2" @tap="showShop(item)" />
            <Button class="btn btn-outline" text="Border + Transparent Background"></Button>
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
        items: null
      };
    },
    mounted: function () {
      this.fetchShops();
    },
    methods: {
      fetchShops: function () {
        let vm = this;
        vm.$http.get('users', {params: {userTypes: 'seller'}})
          .then(shops => {
            vm.items = shops.data.data;
          })
          .catch(error => console.error(error));
      },
      showShop(shopItem) {
        let vm = this;
        this.$navigateTo(vm.$router.shop,{
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
