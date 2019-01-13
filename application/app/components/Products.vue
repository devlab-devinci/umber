<template>
  <Page>
    <ActionBar class="action-bar" title="Produits"></ActionBar>
    <StackLayout>
      <Image src="https://user-images.githubusercontent.com/544280/42960643-66d498ac-8b5a-11e8-8946-7224eefea6a5.jpg"></Image>
    </StackLayout>
  </Page>
</template>

<script>
  import axios from "axios";
  import APIConfig from "../config/api_config";

  const APIUrl = `${APIConfig.protocol}://${APIConfig.hostname}:${APIConfig.port}`;

  export default {
    data() {
      return {
        products: []
      };
    },
    mounted() {
      let vm = this;
      axios.get(APIUrl + '/products')
        .then(response => {
          console.log(response);
          console.log(response.data);
          vm.products = response.data
        })
        .catch(error => console.log(error));
    }
  };
</script>
