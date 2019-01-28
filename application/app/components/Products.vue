<template>
  <Page>
    <ActionBar class="action-bar" :title="seller ? 'Mes offres' : 'Produits'">
      <ActionItem @tap="$navigateTo($router.carts)"
                  ios.systemIcon="16" ios.position="right"
                  text="Paniers" android.position="popup" />
      <ActionItem @tap="$navigateTo($router.shops)"
                  ios.systemIcon="16" ios.position="right"
                  text="Shops" android.position="popup" />
    </ActionBar>
    <scroll-view class="green">
      <ListView v-if="items && items.length" :items="items" @itemTap="" item-key="item._id">
        <v-template>
          <StackLayout rows="auto" columns="*,*">
            <Label :text="'Nom :' + item.name" col="1" row="0"></Label>
            <Label :text="item.description" col="1" row="0"></Label>
            <Image v-if="item.cover && item.cover.name" col="0" row="0" :src="$config.url + '/upload/' + item.cover.name"></Image>
            <Label :text="'Prix :' + item.price" col="3" row="1"/>
            <Label :text="'Promotion :' + item.promotion" col="3" row="1"/>
            <Label :text="item.stock > 0 ? 'Quantité :' + item.stock : 'Produit indisponible'"/>
            <Button text="Voir le produit" col="2" @tap="showProduct(item)" />
          </StackLayout>
        </v-template>
      </ListView>
      <StackLayout v-else>
        <StackLayout>
          <Label text="Aucun produit n'est disponible"></Label>
        </StackLayout>
      </StackLayout>
    </scroll-view>
  </Page>
</template>

<script>
  export default {
    props: {
      seller: {
        type: Boolean,
        default: true
      }
    },
    data: function () {
      return {
        items: null
      };
    },
    mounted: function () {
      this.fetchProducts();
    },
    methods: {
      fetchProducts: function () {
        let vm = this;
        vm.$http.get('products', vm.seller && {params: { owner: vm.$store.state.currentUser._id}})
          .then(products => {
            vm.items = products.data.data;
          })
          .catch(error => console.error(error));
      },
      showProduct(productItem) {
        let vm = this;
        let method = vm.$store.state.currentUser.userTypes === 'seller' ? '$showModal' : '$navigateTo';
        this[method](vm.$router[vm.$store.state.currentUser.userTypes === 'seller' ? 'editProduct' : 'product'],{
          props: {
            id: productItem._id
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
