<template>
  <Page>
    <ActionBar title="Shop" class="action-bar">
      <ActionItem @tap="$navigateTo($router.products)"
                  ios.systemIcon="16" ios.position="right"
                  text="Produits" android.position="popup" />
      <ActionItem @tap="$navigateTo($router.cart)"
                  ios.systemIcon="16" ios.position="right"
                  text="Panier" android.position="popup" />
    </ActionBar>
    <scroll-view class="green">
      <ListView for="item in shops" @itemTap="" item-key="item._id">
        <v-template>
          <GridLayout rows="auto" columns="*,*">
           <Image v-if="item.picture" col="0" row="0" :src="item.picture"></Image>
           <Label :text="item.companyName" col="1" row="0"></Label>
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
        shops: null
      };
    },
    mounted: function () {
      this.fetchShops();
    },
    methods: {
      fetchShops: function () {
        let vm = this;
        vm.$http.get('users', {params:{userTypes: 'seller'}})
          .then(shops => {
            vm.shops = shops.data.data;
          })
          .catch(error => console.error(error));
      }
    }
  };
</script>
