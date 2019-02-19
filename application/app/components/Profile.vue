<template>
  <StackLayout>
    <card-view margin="10" elevation="100" radius="1" ripple="true" shadowRadius="10"
               shadowColor="#000000"
               background="#fffff4">
      <stack-layout padding="5" class="m-l-5 m-t-5">
        <Label horizontalAlignment="left" class="m-t-3 h4" id="welcomText" :text="welcomMessage"
               textWrap="true"/>
        <Image id="profile-pic" horizontalAlignment="center" class="text-justify"
               :src="this.$store.getters.getFbUser.picture.data.url"
               stretch="aspectFit"/>
        <Label textWrap="true" class="mt-4">
          <FormattedString>
            <Span class="fa" style="color: #78e08f;" :text="'fa-map-marker' | fonticon"></Span>
            <Span text=" Poisition"/>
          </FormattedString>
        </Label>
        <Label textWrap="true">
          <FormattedString>
            <Span class="body"
                  :text="this.$store.getters.getCurrentLocationInfos.display_name"/>
          </FormattedString>
        </Label>

        <StackLayout class="hr-light m-10"></StackLayout>

        <Label textWrap="true">
          <FormattedString>
            <Span style="color: #78e08f;" class="fa" :text="'fa-envelope' | fonticon"></Span>
            <Span text=" Contact"/>
          </FormattedString>
        </Label>
        <Label textWrap="true">
          <FormattedString>
            <Span class="body" :text="this.$store.getters.getFbUser.email"/>
          </FormattedString>
        </Label>
      </stack-layout>
    </card-view>
  </StackLayout>
</template>

<script>
  export default {
    props: {
      welcomMessage: String
    }
  };
</script>

<style>

</style>
