<template>
  <div v-if="budgetId" class="container">
    <sidebar v-if="user"></sidebar>
    <router-view></router-view>
    <v-dialog/>
  </div>
  <div v-else-if="!user" class="container">
    <router-view></router-view>
  </div>
  <div v-else class="load-wrapper">
    <div class="cssload-thecube">
      <div class="cssload-cube cssload-c1"></div>
      <div class="cssload-cube cssload-c2"></div>
      <div class="cssload-cube cssload-c4"></div>
      <div class="cssload-cube cssload-c3"></div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Sidebar from './components/Sidebar/Sidebar';

function isMobile() {
  if (navigator.userAgent.match(/Android/i)
    || navigator.userAgent.match(/webOS/i)
    || navigator.userAgent.match(/iPhone/i)
    || navigator.userAgent.match(/iPad/i)
    || navigator.userAgent.match(/iPod/i)
    || navigator.userAgent.match(/BlackBerry/i)
    || navigator.userAgent.match(/Windows Phone/i)
  ) {
    return true;
  }
  return false;
}

export default {
  name: 'app',
  components: {
    Sidebar
  },
  computed: {
    ...mapGetters([
      'user',
      'budgetId'
    ]),
  },
  created() {
    if (isMobile()) {
      window.location = 'http://www.m.b.matbz.com';
    }

    if (this.user) {
      this.$store.dispatch('getBudgetId', this.user);
    }
  }
};
</script>
