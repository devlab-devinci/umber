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
                    <Button text="Login with fb" @tap="onButtonTap" />
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
            //my component
    },
    data() {
      return {
        msg: 'Hello World!',
        store_firstname: this.$store.state.firstname,
        store_lastname: this.$store.state.lastname
      }
    },
    methods: {
            onButtonTap(event) {
                console.log("TAPPED");
                tnsOauthLogin('facebook'); // TODO -> dans la fonction loggin si success on envoi un event au store 
                //todo dans le store on aura le token et ajouter une method pour decodé le token access 
                  //todo regarder pour la gestion du refresh access_token
                //todo dispatch la state access_token avec le token recuperer     
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
