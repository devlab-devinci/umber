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
      clientId: "334703143750899",
      clientSecret: "3caf594b2d3724da7a52a3a798c9c40f",
      redirectUri: "https://www.facebook.com/connect/login_success.html",
      scopes: ["email"]
    };
    const facebookProvider = new TnsOaProviderFacebook(facebookProviderOptions);
    return facebookProvider;
  }
  
  export function tnsOauthLogin(providerType) {
    client = new TnsOAuthClient(providerType);

    return new Promise(function(resolve, reject) {
      client.loginWithCompletion((access_token, error) => {
        if (error) {
          reject("error");
        } else {
          resolve(access_token);
        }
      });
    });
  }
  
  export function tnsOauthLogout() {
    if (client) {
      client.logout();
    }
  }
