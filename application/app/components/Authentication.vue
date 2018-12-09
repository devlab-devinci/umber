<template>
    <Page>
        <ActionBar title="Authentication" android:flat="true"/>

        <TabView android:tabBackgroundColor="#53ba82"
                 android:tabTextColor="#c4ffdf"
                 android:selectedTabTextColor="#ffffff"
                 androidSelectedTabHighlightColor="#ffffff">

            <TabViewItem title="Login">
                <!-- user columns=*rows =* pour du responsive peut aussi servir pour faire les offset -->
                <GridLayout columns="115, 115" rows="115, 115" backgroundColor="red">
                    <Image src="~/logo.png" stretch="none" />
                    <Button text="Connectez-vous avec Facebook" textWrap=true @tap="login" />
                </GridLayout>
            </TabViewItem>
        
            <TabViewItem title="Register">
                <StackLayout class="form">
                    <StackLayout class="input-field">
                        <TextField class="input"></TextField>
                    </StackLayout>

                    <StackLayout class="input-field">
                        <TextField class="input"></TextField>
                    </StackLayout>
                <Button text="Log In" class="btn btn-primary"></Button>
                </StackLayout>
            </TabViewItem>

        </TabView>
    </Page>
</template>

<script>

import Router from "./services/Router"

import { tnsOauthLogin, tnsOauthLogout } from "./services/Auth";


export default {
component: {
            //my component here
    },
    data() {
      return {
      }
    },
    methods: {
            login(event) {
                let self = this;
                tnsOauthLogin('facebook')
                .then(function(response){
                    self.$store.commit('setAccessToken', response.accessToken) //commit == mutation (update)

                    self.$store
                    .dispatch('findFbUser', response.accessToken) //dispatch == action  (return promise)
                    .then(function(userData){
                        self.$store
                        .commit('setFbUser', userData); // update user we get

                        console.log("LOGGED USER ->", self.$store.getters.getFbUser.email)
                        console.log("lOGGGEEED", self.$store.getters.getFbUser.picture.data.url)
                        console.log("lOGGGEEED", response.accessToken);

                        self.$navigateTo(Router.home);
                    })

                    //TODO -> return modal here
                    .catch(err => {console.log("LOGIN FAILED",err)})

                }) 
                .catch(err => console.log(err))
                //TODO -> return error  with modal (voir tuto)
            }
    }
  }
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
