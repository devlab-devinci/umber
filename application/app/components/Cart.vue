<template>
  <Page>
    <ActionBar class="action-bar" title="Panier">
      <ActionItem @tap="$navigateTo($router.products)"
                  ios.systemIcon="16" ios.position="right"
                  text="Produits" android.position="popup" />
      <ActionItem @tap="$navigateTo($router.shops)" ios.systemIcon="16" ios.position="right" text="Shop" android.position="popup" />
    </ActionBar>
    <scroll-view class="green">
      <ListView for="item in cart" @itemTap="" item-key="item._id">
        <v-template>
          <GridLayout rows="auto" columns="*,*">
            <Image v-if="item.cover && item.cover.name" col="0" row="0" :src="$config.url + '/upload/' + item.cover.name"></Image>
            <Label :text="item.name" col="1" row="0"></Label>
            <Label :text="item.price" col="1" row="1"/>
            <Button text="Supprimer" col="2" @tap="removeProduct(item)" />
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
        cart: this.$store.state.currentCart
      };
    },
    methods: {
      removeProduct: function () {
        this.$store.commit('removeProductCart', {
          productIndex: this.productIndex
        });
      }
    }
  };
</script>