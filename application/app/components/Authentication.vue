<template>
    <Page>
        <ActionBar title="Authentication" android:flat="true"/>

        <TabView android:tabBackgroundColor="#53ba82"
                 android:tabTextColor="#c4ffdf"
                 android:selectedTabTextColor="#ffffff"
                 androidSelectedTabHighlightColor="#ffffff">

            <TabViewItem title="Login">
                <!-- user columns=*rows =* pour du responsive peut aussi servir pour faire les offset -->
                <GridLayout columns="*" rows="*" backgroundColor="#FFF">
                    <Button text="Login with fb" @tap="login" />
                </GridLayout>
            </TabViewItem>

            <TabViewItem title="Register">
                <GridLayout columns="*" rows="*">
                </GridLayout>
            </TabViewItem>

        </TabView>
    </Page>
</template>

<script>
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
                        .commit('setFbUser', userData) // update user we get 

                        console.log("LOGGED USER ->", self.$store.getters.getFbUser.email)
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
