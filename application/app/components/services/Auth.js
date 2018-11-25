'use strict'; 

import {
    TnsOAuthClient,
    configureTnsOAuth,
    ITnsOAuthTokenResult
  } from "nativescript-oauth2";
  import {
    TnsOaProvider,
    TnsOaProviderOptionsFacebook,
    TnsOaProviderFacebook,
  } from "nativescript-oauth2/providers";
  
  let client = null;
  
  export function configureOAuthProviders() {
    const facebookProvider = configureOAuthProviderFacebook();
    configureTnsOAuth([facebookProvider]);
  }
  

function configureOAuthProviderFacebook() {
    const facebookProviderOptions = {
      openIdSupport: "oid-none",
      clientId: "2018393531588331",
      clientSecret: "c1253a6ceb1431ad2278e4abf069f754",
      redirectUri: "https://www.facebook.com/connect/login_success.html",
      scopes: ["email"]
    };
    const facebookProvider = new TnsOaProviderFacebook(facebookProviderOptions);
    return facebookProvider;
  }
  
  export function tnsOauthLogin(providerType) {
    client = new TnsOAuthClient(providerType);

    let response = {error:true, data:"", token: ""}; // default
  
    client.loginWithCompletion((access_token, error) => {
      if (error) {
        //console.error("back to main page with error: ");
        //console.error(error);
        response = {
          error: true,
          data: error,
          token: "Error is occured"
        }
        console.log("ERROR LOGIN", response)
        return response;
      } else {
        //console.log("back to main page with access token: ");
        //console.log(token);
        response = {
          error: false,
          data: "",
          token: access_token
        }
        console.log("SUCCESS LOGIN", response)
        return response;
      }
    });
  }
  
  export function tnsOauthLogout() {
    if (client) {
      client.logout();
    }
  }
