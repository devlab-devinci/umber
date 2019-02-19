<template>
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
      <Button text="Take Picture" @tap="takePicture" />
      <Button text="Choose Picture" @tap="selectPicture" />
      <WrapLayout ref="images">
        <Image v-if="image" :src="image.src" v-model="image.src" width="75" height="75" />
        <Image v-else-if="input.cover && input.cover.name" :src="$config.url + '/upload/' + input.cover.name" data-img-alt="input.cover.name" width="75" height="75"/>
      </WrapLayout>
      <StackLayout class="hr-light"></StackLayout>
    </StackLayout>
    <StackLayout v-if="listCategories && listCategories.length" class="input-field">
      <Label text="Categorie" class="label font-weight-bold m-b-5" />
      <ListPicker :items="listCategories" @selectedIndexChange="selectedIndexChanged" selectedIndex="indexSelectCat"/>
      <StackLayout class="hr-light"></StackLayout>
    </StackLayout>
    <StackLayout v-if="listStore && listStore.length" class="input-field">
      <Label text="Categorie" class="label font-weight-bold m-b-5" />
      <ListPicker :items="listStore" @selectedIndexChange="selectedStoreIndexChanged" selectedIndex="indexSelectCat"/>
      <StackLayout class="hr-light"></StackLayout>
    </StackLayout>
    <GridLayout rows="auto, auto" columns="*, *">
      <Button text="Save" @tap="save" class="btn btn-primary" row="0" col="0" />
      <!-- <Button text="Load" @tap="load" class="btn btn-primary" row="0" col="1"  />
       <Button text="Clear" @tap="clear" class="btn btn-primary" row="1" col="0" colSpan="2"  />-->
    </GridLayout>
  </StackLayout>
</template>

<script>
  import _ from 'lodash';
  import * as camera from "nativescript-camera";
  import * as imagepicker from "nativescript-imagepicker";

  import { Image } from "tns-core-modules/ui/image";
  import {LoadingIndicator} from "nativescript-loading-indicator";

  const loaderOptions = require('./services/LoaderConfig').getOptions();
  const loader = new LoadingIndicator();
  import {Feedback, FeedbackType, FeedbackPosition} from "nativescript-feedback";

  export default {
    props: {
      id: String
    },
    data: function () {
      return {
        input: {},
        indexSelectStore: null,
        indexSelectCat: null,
        listCategories: [],
        categories: null,
        listStore: [],
        stores: null,
        image: null
      }
    },
    created: function () {
      if (this.id) {
        this.fetchProduct();
      }
      this.fetchCategory();
      this.fetchStore();
    },
    methods: {
      fetchCategory: function () {
        let vm = this;
        const headers = {
          'fb-access-token': this.$store
            .getters.getAccessToken

        };
        vm.$http.get('api/v1/taxonomies', {params: { type: 'product'}, headers: headers})
          .then(cat => {
            let cats = _.cloneDeep(cat.data.data);

            _.each(cats, function (cat, index) {
              vm.listCategories.push(cat.name);
              if (cat.name === (vm.input.categories && vm.input.categories.name)) {
                vm.indexSelectCat = index;
              }
            });
            vm.categories = cats;
          })
          .catch(error => console.error(error));
      },
      fetchStore: function () {
        let vm = this;
        const headers = {
          'fb-access-token': this.$store
            .getters.getAccessToken

        };
        vm.$http.get('api/v1/store', {params: {owner: vm.$store.getters.getCurrentUser._id}, headers: headers})
          .then(res => {
            let stores = _.cloneDeep(res.data.data);

            _.each(stores, function (store, index) {
              vm.listCategories.push(store.name);
              if (vm.input.owner && store.name === (vm.input.owner._id && vm.input.categories.name)) {
                vm.indexSelectStore = index;
              }
            });
            vm.stores = stores;
          })
          .catch(error => console.error(error));
      },
      selectPicture() {

        let vm = this;
        let context = imagepicker.create({
          mode: 'single'
        });

        context.authorize()
          .then(function() {
            return context.present();
          })
          .then(selection => {
            selection.forEach(selected => {
              let img = new Image();
              img.src = selected;
              vm.image = img;
            });
          }).catch(function (e) {
          console.log('error in selectPicture', e);
        });

      },
      takePicture() {
        let vm = this;
        camera.requestPermissions()
          .then(() => {
            camera.takePicture({ width: 300, height: 300, keepAspectRatio: true, saveToGallery:false })
              .then(imageAsset => {
                let img = new Image();
                img.src = imageAsset;
                vm.image = img;
                console.log('ive got '+vm.image.length+' image now.');
              })
              .catch(e => {
                console.log('error:', e);
              });
          })
          .catch(e => {
            console.log('Error requesting permission');
          });
      },
      fetchProduct: function () {
        let vm = this;
        const headers = {
          'fb-access-token': this.$store
            .getters.getAccessToken

        };
        vm.$http.get('api/v1/products/' + vm.id, {headers: headers})
          .then(product => {
            if (product.data && product.data.owner && product.data.owner._id === vm.$store.getters.getCurrentUser._id) {
              vm.input = _.cloneDeep(product.data);
            }
          })
          .catch(error => console.error(error));
      },
      selectedIndexChanged: function (picker) {
        this.input.categories = this.categories[picker.object.selectedIndex];
      },
      selectedStoreIndexChanged: function (picker) {
        this.input.owner = this.stores[picker.object.selectedIndex];
      },
      save: function () {
        let vm = this;const headers = {
          'fb-access-token': this.$store
            .getters.getAccessToken

        };
        let feedback = new Feedback();
        let newProduct = _.cloneDeep(vm.input);
        let method = newProduct._id ? 'put' : 'post';
        let resource = method === 'put' ? 'products/' + newProduct._id : 'products';

        // formData = vm.images[0] || null;
        newProduct.cover = vm.input.cover || null;
        newProduct.owner = vm.$store.state.currentUser;

        console.log(newProduct.categories);
// upload configuration
        var request = {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        };
        console.log(vm.image);

        let errorValidation = [];

        if (!newProduct.name) {
          errorValidation.push("invalide name");
        }

        if (newProduct.price <= 0) {
          errorValidation.push("invalide price");
        }

        if (newProduct.stock <= 0) {
          errorValidation.push("invalide stock");
        }

        if (newProduct.promotion <= newProduct.price) {
          errorValidation.push("invalide promotion");
        }

        if (errorValidation.length > 0) {
          //error
          setTimeout(function () {
            feedback
              .warning({
                message: "Erreur, vérifier les champs !"
              });
            loader.hide()
          }, 1000);
        } else {

          vm.$http[method]('api/v1/'+resource, newProduct, {headers: headers})
          //vm.$http.post('upload', {file: vm.image}, request)
            .then(product => {
              if (product.data.status === 200) {
                loader.hide();
                feedback
                  .success({
                    title: "Félicitation !",
                    titleColor: new Color("#222222"),
                    type: FeedbackType.Custom, // this is the default type, by the way
                    message: `Offre ajouté !`,
                    messageColor: new Color("#333333"),
                    duration: 2000,
                    backgroundColor: new Color("yellowgreen")
                  });
              } else {
                loader.hide()
                feedback
                  .error({
                    message: "Une erreur survenue. Veuillez réessayer"
                  });
              }
            })
            .catch(function (err) {
              loader.hide()
              console.error(err)
              feedback
                .warning("Oups, une erreur est surevenue. Veuillez réessayer plus tard")
            });
        }
      }
    }
  };
</script>
