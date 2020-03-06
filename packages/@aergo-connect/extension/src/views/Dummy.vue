<template>
  <ScrollView class="page">
    <div class="content">
      <section class="dialog-header">
        <BackButton />
      </section>
      <Heading>{{$route.name || $route.path}}</Heading>
      <router-view></router-view>
    </div>
  </ScrollView>
</template>


<script lang="ts">
import Vue from 'vue';
import { BackButton } from '@aergo-connect/lib-ui/src/buttons';
import { ScrollView } from '@aergo-connect/lib-ui/src/layouts';
import Heading from '@aergo-connect/lib-ui/src/content/Heading.vue';

export default Vue.extend({
  components: {
    ScrollView,
    BackButton,
    Heading,
  },
});
</script>