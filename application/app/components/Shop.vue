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
      <Label :text="id" col="1" row="0"></Label>
      <!--<Button text="Supprimer" col="2" @tap="$navigateTo($router.shop)" />-->
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
        items: null
      };
    },
    mounted: function () {
        let vm = this;
        vm.$http.get('product', {owner: vm.id})
          .then(products => {
            console.log(products.data.data);
            vm.items = products.data.data;
          })
          .catch(error => console.error(error)); 
    },
    methods: {
      fetchProducts: function () {
        console.log(this.$navigateTo.arguments);
        console.log(this.$router); 
       let vm = this;
        vm.$http.get('product', {owner: id})
          .then(products => {
            console.log(products.data.data);
            vm.items = products.data.data;
          })
          .catch(error => console.error(error));
      } 
    }
  };
</script>
