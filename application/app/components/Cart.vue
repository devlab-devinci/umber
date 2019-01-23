<template>
  <Page>
    <ActionBar class="action-bar" title="Panier">
      <ActionItem @tap="$navigateTo($router.products)"
                  ios.systemIcon="16" ios.position="right"
                  text="Produits" android.position="popup" />
      <ActionItem @tap="$navigateTo($router.shops)" ios.systemIcon="16" ios.position="right" text="Shop" android.position="popup" />
    </ActionBar>
    <scroll-view class="green">
      <ListView v-if="carts && carts.length" for="(item, index) in carts" @itemTap="" item-key="item._id">
        <v-template>
          <StackLayout v-if="item && item.recipient && item.price && item.cartEntries.length" class="list-group-item">
            <Image v-if="item.recipient.picture" col="0" row="0" :src="item.recipient.picture"></Image>
            <Label :text="'Magasin : ' + item.recipient.companyName" col="1" row="0"></Label>
            <Label v-if="(item.cartEntries && item.cartEntries.length)" :text="'Nombres d\'articles : ' + item.cartEntries.length"></Label>
            <Label :text="'Prix total : ' + item.price.price + ' ' + item.price.devise" col="1" row="1"/>
            <ListView v-if="item.cartEntries && item.cartEntries.length" for="entry in item.cartEntries"  @itemTap="" item-key="entry._id">
              <v-template>
                <GridLayout v-if="entry.product">
                  <Label :text="entry.product.name" col="1" row="0"></Label>
                  <Label :text="'Quantité : ' + entry.quantity" col="1" row="0"></Label>
                  <Label :text="'Prix: ' + entry.price" col="1" row="1"/>
                  <Button text="Supprimer" col="2" @tap="removeProduct(index, entry)" />
                  <Image v-if="entry.product.cover && entry.product.cover.name" col="0" row="0" :src="$config.url + '/upload/' + entry.product.cover.name"></Image>
                </GridLayout>
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
      removeProduct: function (index, product) {
        let vm = this;
        let findEntry = vm.carts[index].cartEntries.findIndex(entry => entry.product._id === product.product._id);

        if (vm.carts[index].cartEntries.length && findEntry !== -1) {
          product = _.cloneDeep(vm.carts[index].cartEntries[findEntry]);
          product.product.stock = product.product.stock + vm.carts[index].cartEntries[findEntry].quantity;
          vm.carts[index].cartEntries.splice(findEntry, 1);
        }

        vm.carts[index].price.price = 0;
        _.each(vm.carts[index].cartEntries, function (entry) {
          vm.carts[index].price.price = vm.carts[index].price.price + entry.price;
        });

        vm.$http.put('carts/' + vm.carts[index]._id, vm.carts[index])
          .then(res => {
            vm.carts[index] = _.cloneDeep(res.data);
          })
          .then(() => {
            vm.$http.put('products/' + product.product._id, product.product)
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