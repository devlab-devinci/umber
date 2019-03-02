<template>
    <Page>
        <ActionBar title="Mon Compte" android:flat="true">
        </ActionBar>

        <FlexboxLayout style="align-items:center; flex-direction:column;" justifyContent="space-around">
            <StackLayout class="form">
                <StackLayout class="input-field form">
                    <StackLayout class="input-field" width="250">
                        <Label text="Email" class="label font-weight-bold m-b-5" />
                        <TextField class="input"/>
                        <StackLayout class="hr-light"></StackLayout>
                    </StackLayout>
                    <StackLayout class="input-field" width="250">
                        <Label text="Mot de passe" class="label font-weight-bold m-b-5" />
                        <TextField class="input" />
                        <StackLayout class="hr-light"></StackLayout>
                    </StackLayout>
                    <Button text="Connexion" width="70%" class="btn btn-outline"></Button>
                    <StackLayout class="hr-light m-10" width="320"></StackLayout>
                    <Button text="Connectez-vous avec Facebook" class="btn btn-primary btn-rounded-lg classic-btn fb-btn" @tap="login"
                            textWrap="true"/>
                    <Button text="S'inscrire" class="btn classic-btn" @tap="login"
                            textWrap="true"/>
                </StackLayout>

                <StackLayout class="input-field">
                    <TextField class="input"></TextField>
                </StackLayout>
            </StackLayout>
        </FlexboxLayout>
    </Page>
</template>

<script>

    import Router from "./services/Router"
    import API_CONFIG from "../config/api_config"

    const API_url = `${API_CONFIG.protocol}://${API_CONFIG.hostname}:${API_CONFIG.port}`

    import {tnsOauthLogin, tnsOauthLogout} from "./services/Auth";

    import axios from 'axios';

    import {Feedback, FeedbackType} from "nativescript-feedback";
    import {Color} from "tns-core-modules/color";


    export default {
        name: "Authentication",

        component: {
            //my component here
        },
        data() {
            return {}
        },
        methods: {
            login(event) {
                let self = this;
                tnsOauthLogin('facebook')
                    .then(function (response) {
                            self.$store.commit('setAccessToken', response.accessToken) //commit == mutation (update)

                            self.$store
                                .dispatch('findFbUser', response.accessToken) //dispatch == action  (return promise)
                                .then(function (userData) {
                                    console.log(userData);
                                    self.$store
                                        .commit('setFbUser', userData); // update user we get

                                    console.log("LOGGED USER ->", self.$store.getters.getFbUser.email)
                                    console.log("lOGGGEEED", self.$store.getters.getFbUser.picture.data.url)
                                    console.log("lOGGGEEED", response.accessToken);
                                    //first_name  //field api fb graph
                                    //last_name

                                    //TODO create application side -> config file wiht localhost etc
                                    // TODO post on /auth/login/fb -> to create user
                                    console.log("FB USER saved, so lets set currentUser", self.$store.getters.getFbUser)
                                    axios
                                        .post(`${API_url}/auth/login/fb`, {
                                            fullname: self.$store.getters.getFbUser.name,
                                            picture: self.$store.getters.getFbUser.picture.data.url,
                                            email: self.$store.getters.getFbUser.email
                                        })
                                        .then(response => {
                                            self.$store.commit('setCurrentUser', response.data.data); // set currentUser after login fb success
                                            //this variable is to get _id
                                            console.log("CURRENT_USER (made after fb login", self.$store.getters.getCurrentUser);
                                            console.log("AUTH ok.");
                                        })
                                        .catch(error => {
                                            feedback.error({
                                                title: "Oups, une erreur est survenue! réessayer plus tard",
                                                titleColor: new Color("black")
                                            });
                                            console.log("ERRORRRRRRR API", error);
                                            console.log(error);
                                            console.log("ROOT", API_url)
                                        })

                                    self.$navigateTo(Router.choice);
                                })

                                //TODO -> return modal here
                                .catch(err => {
                                    console.log("LOGIN FAILED", err)
                                    feedback.error({
                                        title: "Oups, une erreur est survenue! réessayer plus tard",
                                        titleColor: new Color("black")
                                    });
                                })

                        }
                    )
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

    .btn-outline {
        color: #22a6b3;
    }

    .classic-btn {
        background-color: #22a6b3;
        color: white;
    }
    .fb-btn {
        background-color: #3b5998;
    }
</style>
