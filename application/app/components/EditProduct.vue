<template>
  <Page class="page">
    <ActionBar class="action-bar" title="Ajouter un produit"></ActionBar>
    <StackLayout class="form">
      <StackLayout class="input-field">
        <Label text="Nom du produit" class="label font-weight-bold m-b-5" />
        <TextField class="input" v-model="input.name" />
        <StackLayout class="hr-light"></StackLayout>
      </StackLayout>
      <StackLayout class="input-field">
        <Label text="Description" class="label font-weight-bold m-b-5" />
        <TextField class="input" v-model="input.description" />
        <StackLayout class="hr-light"></StackLayout>
      </StackLayout>
      <StackLayout class="input-field">
        <Label text="Stock" class="label font-weight-bold m-b-5" />
        <TextField keyboardType="number" class="input" v-model="input.stock" />
        <StackLayout class="hr-light"></StackLayout>
      </StackLayout>
      <StackLayout class="input-field">
        <Label text="Prix de base" class="label font-weight-bold m-b-5" />
        <TextField keyboardType="number"class="input" v-model="input.price" />
        <StackLayout class="hr-light"></StackLayout>
      </StackLayout>
      <StackLayout class="input-field">
        <Label text="Promotion" class="label font-weight-bold m-b-5" />
        <TextField keyboardType="number" class="input" v-model="input.promotion" />
        <StackLayout class="hr-light"></StackLayout>
      </StackLayout>
      <StackLayout class="input-field">
        <Label text="Photo du produit" class="label font-weight-bold m-b-5" />
        <!--<TextField keyboardType="number" class="input" v-model="input.cover" />-->
        <StackLayout class="hr-light"></StackLayout>
      </StackLayout>
      <StackLayout class="input-field">
        <Label text="Categorie" class="label font-weight-bold m-b-5" />
        <ListPicker :items="listCategories" selectedIndex="0"
                    @selectedIndexChange="selectedIndexChanged" />

        <!--<TextField keyboardType="number" class="input" v-model="input.categories" />-->
        <StackLayout class="hr-light"></StackLayout>
      </StackLayout>
      <GridLayout rows="auto, auto" columns="*, *">
        <Button text="Save" @tap="save" class="btn btn-primary" row="0" col="0" />
        <Button text="Load" @tap="load" class="btn btn-primary" row="0" col="1"  />
        <Button text="Clear" @tap="clear" class="btn btn-primary" row="1" col="0" colSpan="2"  />
      </GridLayout>
    </StackLayout>
  </Page>
</template>

<script>
  import _ from 'lodash';
  export default {
    props: {
      id: String
    },
    data: function () {
      return {
        listCategories: [],
        input: {}
      }
    },
    mounted: function () {
      if (this.id) {
        this.fetchProduct();
      }
    },
    methods: {
      fetchProduct: function () {
        let vm = this;
        vm.$http.get('products/' + vm.id)
          .then(product => {
            vm.input = _.cloneDeep(product.data);
          })
          .catch(error => console.error(error));
      },
      selectedIndexChanged: function () {

      },
      save: function () {
        let vm = this;
        let newProduct = _.cloneDeep(vm.input);
        let method = newProduct._id ? 'put' : 'post';
        let resource = method === 'put' ? 'products/' + newProduct._id : 'products';

        newProduct.owner = vm.$store.state.currentUser;

        vm.$http[method](resource, newProduct)
          .then(product => {
            vm.input = _.cloneDeep(product.data);
          })
          .catch(error => console.error(error));
      },
      load: function () {
        this.$store.commit("load");
      },
      clear: function () {
      }
    }
  };
</script>

<style>

</style>