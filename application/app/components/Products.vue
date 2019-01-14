<template>
  <Page>
    <ActionBar class="action-bar" title="Produits"></ActionBar>
    <scroll-view class="green">
      <ListView v-for="(item, key) in products">
        <v-template>
          <Label :text="item.name" />
          <Image v-if="item.cover && item.cover.name" :src="apiUrl + '/upload/' + item.cover.name"></Image>
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
