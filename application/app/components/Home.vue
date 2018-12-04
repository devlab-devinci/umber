<template>
    <Page>
       <ActionBar title="Home" android:flat="true"/>
        <TextField :text="this.$store.getters.getFbUser.name" hint="Enter text..." />
    </Page>
</template>
<script>

import { Feedback, FeedbackType, FeedbackPosition } from "nativescript-feedback";
import { Color } from "tns-core-modules/color";

export default {

//callback lifecyclme (vuejs)
beforeCreate(){
                        let feedback = new Feedback();
                        feedback
                        .success    ({
                            title: "Connectez avec succès",
                            titleColor: new Color("#222222"),
                            type: FeedbackType.Custom, // this is the default type, by the way
                            message: `Vous êtes connecté`,
                            messageColor: new Color("#333333"),
                            duration: 2000,
                            backgroundColor: new Color("yellowgreen")
                            })
                        
},
component: {
            //my component here
    },
    data() {
      return {
        
      }
    },
    methods: {
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
