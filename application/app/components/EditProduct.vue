<template>
  <Page class="page">
    <ActionBar class="action-bar" :title="input && input._id ? 'Mettre a jour ' + input.name : 'Ajouter un produit'"></ActionBar>

    <scroll-view class="green">
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
          <WrapLayout>
            <Image v-if="images && images.length" v-for="img in images" :src="img.src" width="75" height="75" :key="img.id"/>
            <Image v-else-if="input.cover && input.cover.name" :src="$config.url + '/upload/' + input.cover.name" data-img-alt="input.cover.name" width="75" height="75"/>
          </WrapLayout>
          <StackLayout class="hr-light"></StackLayout>
        </StackLayout>
       <!-- <StackLayout class="input-field">
          <Label text="Categorie" class="label font-weight-bold m-b-5" />
          <ListPicker :items="listCategories" selectedIndex="0"
                      @selectedIndexChange="selectedIndexChanged" />

          <TextField keyboardType="number" class="input" v-model="input.categories" />
          <StackLayout class="hr-light"></StackLayout>
        </StackLayout>-->
        <GridLayout rows="auto, auto" columns="*, *">
          <Button text="Save" @tap="save" class="btn btn-primary" row="0" col="0" />
         <!-- <Button text="Load" @tap="load" class="btn btn-primary" row="0" col="1"  />
          <Button text="Clear" @tap="clear" class="btn btn-primary" row="1" col="0" colSpan="2"  />-->
        </GridLayout>
      </StackLayout>
    </scroll-view>
  </Page>
</template>

<script>
  import _ from 'lodash';
  import * as camera from "nativescript-camera";
  import * as imagepicker from "nativescript-imagepicker";

  import { InputImage } from './InputImage';
  import { Image } from "tns-core-modules/ui/image";
  export default {
    props: {
      id: String
    },
    data: function () {
      return {
        listCategories: [],
        input: {},
        images: []
      }
    },
    mounted: function () {
      if (this.id) {
        this.fetchProduct();
      }
    },
    methods: {
      selectPicture() {

        let vm = this;
        let context = imagepicker.create({
          mode: 'multiple'
        });

        context.authorize()
          .then(function() {
            return context.present();
          })
          .then(selection => {
            selection.forEach(selected => {

              console.log(1, JSON.stringify(selected));
              let img = new Image();
              img.src = selected;
              console.log(1, img.src);
              // console.log(adb.toByteArray(vm.images[0].src));
              vm.images.push(img);
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
                vm.images.push(img);
                console.log('ive got '+vm.images.length+' images now.');
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
        vm.$http.get('products/' + vm.id)
          .then(product => {
            if (product.data && product.data.owner && product.data.owner._id === vm.$store.state.currentUser._id) {
              vm.input = _.cloneDeep(product.data);
            }
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

        // formData = vm.images[0] || null;
        newProduct.cover = vm.input.cover || null;
        newProduct.owner = vm.$store.state.currentUser;

// upload configuration
        // var request = {
          // headers: {
            // 'Content-Type': 'multipart/form-data',
          // }
        // };
        // var formData = new FormData();

        // formData.append('image', vm.images[0]);
        vm.$http[method](resource, newProduct)
        // vm.$http.post('upload', formData, request)
          .then(product => {
            console.log(product)
            vm.images[0] = _.cloneDeep(product.data);
          })
          .catch(error => console.error(error));
      }
    }
  };
</script>
