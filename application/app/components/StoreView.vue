<template>
    <Page>
        <ActionBar :title="shop && shop.name | capitalize " android:flat="true">
            <AbsoluteLayout>
                <Button text="pannier" left="2" top="1" width="20" height="40" backgroundColor="#550C5C"/>
                <Button text="nb product" left="10" top="4" width="40" height="30" backgroundColor="#FAC152"/>
            </AbsoluteLayout>
            <ActionItem v-if="cart && cart.cartEntries && cart.cartEntries.length > 0 && cart.price && cart.price.price" ios.systemIcon="9" ios.position="right" :text="'Produits : ' + cart.cartEntries.length + ' Afficher le panier ' + cart.price.price" col="2" @tap="showCart(cart)" android.position="popup" />
        </ActionBar>
        <scroll-view class="green">
            <StackLayout flexDirection="column" v-if="shop" orientation="vertical">
                <Image v-if="shop.picture" width="150rem" :src="shop.picture"></Image>
                <Label :text="shop.companyName" col="1" row="0"></Label>
                <Label text="Offres" col="1" row="0"></Label>
                <ListView style="margin: 15px" v-if="items && items.length" flexGrow="1" for="(item, index) in items" @itemTap="" item-key="item._id"  width="100%">
                    <v-template>
                        <StackLayout>
                            <Label :text="'Nom :' + item.name" col="1" row="0"></Label>
                            <Label :text="item.description" col="1" row="0"></Label>
                            <Image v-if="item.cover && item.cover.name" col="0" row="0" :src="$config.url + '/upload/' + item.cover.name"></Image>
                            <Label :text="'Prix :' + item.price" col="3" row="1"/>
                            <Label v-if="item.promotion" :text="'Promotion :' + item.promotion" col="3" row="1"/>
                            <Button text="Voir le produit" col="2" @tap="showProduct(item)" />
                        </StackLayout>
                    </v-template>
                </ListView>
                <StackLayout v-else>
                    <Label text="Aucun produit n'est disponible dans cette boutique"></Label>
                </StackLayout>
            </StackLayout>
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
                shop: null,
                items: null,
                cart: null
            };
        },
        created: function () {
            if (this.id) {
                this.fetchProducts();
            }
        },
        methods: {
            fetchShop: function () {
                let vm = this;const headers = {
                    'fb-access-token': this.$store
                      .getters.getAccessToken

                };
                vm.$http.get('api/v1/store/' + vm.id, {headers: headers})
                  .then(shop => {
                      vm.shop = shop.data;
                      console.log(1, vm.shop);
                  })
                  .then(() => {
                      vm.$http.get('api/v1/carts', {params: {buyer: vm.$store.getters.getCurrentUser._id, seller: vm.id}})
                        .then(cart => {
                            vm.cart = _.cloneDeep(cart.data.data[0]);
                            console.log(1, vm.cart);
                        })
                        .catch(error => console.error(error));
                  })
                  .catch(error => console.error(error));
            },
            fetchProducts: function () {
                let vm = this;
                vm.$http.get('api/v1/products', {params: {store: vm.id}})
                  .then(products => {
                      vm.items = products.data.data;
                      console.log(1, vm.items);
                      vm.fetchShop();
                  })
                  .catch(error => console.error(error));
            },
            showProduct(shopItem) {
                let vm = this;
                this.$showModal(vm.$router.product, {
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
            },
            showCart(cart) {
                let vm = this;
                this.$navigateTo(vm.$router.cart, {
                    props: {
                        id: cart._id
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

<style scoped>
    ActionBar {
        background-color: #53ba82;
        color: #ffffff;
    }

    .message {
        vertical-align: center;
        text-align: center;
        font-size: 20;
        color: #333333;
    }
</style>
