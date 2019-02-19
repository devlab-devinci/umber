<template>
  <StackLayout v-if="items && items.length">
    <ListView :items="items" @itemTap="" item-key="item._id">
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
  </StackLayout>
  <StackLayout v-else>
    <StackLayout>
      <Label text="Aucun produit n'est disponible"></Label>
    </StackLayout>
  </StackLayout>
</template>

<script>
  import {LoadingIndicator} from "nativescript-loading-indicator";
  const loader = new LoadingIndicator();

  import {Feedback, FeedbackType, FeedbackPosition} from "nativescript-feedback";
  import {Color} from "tns-core-modules/color";
  export default {
    props: {
      seller: {
        type: Boolean,
        default: false
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
        const headers = {
          'fb-access-token': this.$store
            .getters.getAccessToken

        };
        console.log(vm.seller, vm.$store.getters.getCurrentUser);
        let owner = vm.seller ? vm.$store.getters.getCurrentUser._id : vm.id;
        let feedback = new Feedback();
        vm.$http.get('api/v1/products', {params: { owner: owner}, headers: headers})
          .then(products => {
            vm.items = products.data.data;
          })
          .catch(function (err) {
            loader.hide();
            feedback.error({
              title: "Oups, une erreur est survenue! réessayer plus tard",
              titleColor: new Color("black")
            });
            console.error("ERROR:", err);
          })
      },
      showProduct(productItem) {
        let vm = this;
        let method = vm.seller ? '$showModal' : '$navigateTo';
        this[method](vm.$router[vm.seller ? 'editProduct' : 'product'],{
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
