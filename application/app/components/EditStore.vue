<template>
  <StackLayout class="form">
    <StackLayout class="input-field">
      <Label text="Nom du magasin" class="label font-weight-bold m-b-5" />
      <TextField class="input" v-model="input.name" />
      <StackLayout class="hr-light"></StackLayout>
    </StackLayout>
    <StackLayout class="input-field">
      <Label text="Adresse" class="label font-weight-bold m-b-5" />
      <TextField class="input" hint="3 Allée Autocomplete to do wiht google places ..." v-model="input.address" />
      <StackLayout class="hr-light"></StackLayout>
    </StackLayout>
    <StackLayout class="input-field">
      <Label text="Ville" class="label font-weight-bold m-b-5" />
      <TextField class="input" hint="City's name" v-model="input.city"></TextField>
      <StackLayout class="hr-light"></StackLayout>
    </StackLayout>

    <StackLayout class="input-field">
      <Label text="Code postal" class="label font-weight-bold m-b-5" />
      <TextField class="input" hint="Zipcode ...." v-model="input.zipcode"></TextField>
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
    <GridLayout rows="auto, auto" columns="*, *">
      <Button text="Save" @tap="save" class="btn btn-primary" row="0" col="0" />
      <!-- <Button text="Load" @tap="load" class="btn btn-primary" row="0" col="1"  />
       <Button text="Clear" @tap="clear" class="btn btn-primary" row="1" col="0" colSpan="2"  />-->
    </GridLayout>
  </StackLayout>
</template>

<script>
  import _ from 'lodash';
  import {Color} from "tns-core-modules/color";
  import * as camera from "nativescript-camera";
  import * as imagepicker from "nativescript-imagepicker";

  import { Image } from "tns-core-modules/ui/image";
  import {LoadingIndicator} from "nativescript-loading-indicator";

  const loader = new LoadingIndicator();
  import {Feedback, FeedbackType, FeedbackPosition} from "nativescript-feedback";

  export default {
    props: {
      id: String
    },
    data: function () {
      return {
        input: {},
        indexSelectCat: null,
        listCategories: [],
        categories: null,
        image: null
      }
    },
    created: function () {
      if (this.id) {
        this.fetchStore();
      }
      this.fetchCategory();
    },
    methods: {
      fetchCategory: function () {
        let vm = this;
        const headers = {
          'fb-access-token': this.$store
            .getters.getAccessToken

        };
        vm.$http.get('api/v1/taxonomies', {params: { type: 'store'}, header: headers})
          .then(cat => {
            let cats = _.cloneDeep(cat.data.data);

            _.each(cats, function (cat, index) {
              vm.listCategories.push(cat.name);
              if (cat.name === (vm.input.categories_store && vm.input.categories_store.name)) {
                vm.indexSelectCat = index;
              }
            });
            vm.categories = cats;
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
      fetchStore: function () {
        let vm = this;
        const headers = {
          'fb-access-token': this.$store
            .getters.getAccessToken

        };
        vm.$http.get('api/v1/store/' + vm.id)
          .then(product => {
            if (product.data && product.data.owner && product.data.owner._id === vm.id) {
              vm.input = _.cloneDeep(product.data);
            }
          })
          .catch(error => console.error(error));
      },
      selectedIndexChanged: function (picker) {
        this.input.categories_store = this.categories[picker.object.selectedIndex];
      },
      save: function () {
        let vm = this;
        const headers = {
          'fb-access-token': this.$store
            .getters.getAccessToken

        };

        let feedback = new Feedback();
        let newStore = _.cloneDeep(vm.input);
        let method = newStore._id ? 'put' : 'post';
        let resource = method === 'put' ? 'store/' + newStore._id : 'store';

        // formData = vm.images[0] || null;
        newStore.cover = vm.input.cover || null;
        newStore.owner = vm.$store.getters.getCurrentUser;

// upload configuration
        var request = {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        };
        console.log(vm.image);

        let errorValidation = [];

        if (!newStore.name) {
          errorValidation.push("invalide name");
        }

        if (!newStore.address) {
          errorValidation.push("invalide adress");
        }

        if (!newStore.city) {
          errorValidation.push("invalide city");
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

          vm.$http[method]('api/v1/'+resource, newStore, {headers: headers})
          //vm.$http.post('upload', {file: vm.image}, request)
            .then(store => {
              if (store) {
                loader.hide();
                feedback
                  .success({
                    title: "Félicitation !",
                    titleColor: new Color("#222222"),
                    type: FeedbackType.Custom, // this is the default type, by the way
                    message: `Store ajouté !`,
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
