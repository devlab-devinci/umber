<template>
  <Page>
    <ActionBar class="action-bar" title="Produits"></ActionBar>
    <scroll-view class="green">
      <ListView v-for="item in products" @itemTap="">
        <v-template>
          <GridLayout rows="auto" columns="*,*">
            <Image v-if="item.cover && item.cover.name" col="0" row="0" :src="apiUrl + '/upload/' + item.cover.name"></Image>
            <Label :text="item.name" col="1" row="0"></Label>
            <Label :text="item.price" col="1" row="1"/>
          </GridLayout>
        </v-template>
      </ListView>
    </scroll-view>
  </Page>
</template>

<script>
  import axios from 'axios';
  import APIConfig from '../config/api_config';

  const APIUrl = `${APIConfig.protocol}://${APIConfig.hostname}:${APIConfig.port}`;

  export default {
    data: function () {
      return {
        products: null,
        apiUrl: APIUrl
      };
    },
    mounted: function () {
      this.fetchProducts();
    },
    methods: {
      fetchProducts: function () {
        let vm = this;
        axios.get(APIUrl + '/products')
          .then(products => {
            vm.products = products.data.data;
          })
          .catch(error => console.error(error));
      }
    }
  };
</script>
