<template>
   <nav class="ynab-u sidebar">
      <div class="sidebar-contents">
        <button class="button button-prefs" @click="goToRecentBudget()">
            SmartBudget
        </button>
        <ul class="nav-main">
          <li @click="goToBudget()" :class="{ 'active': matchedRoute === 'budget_date' }">
           <a>
            <i class=" fa fa-envelope-o"></i>
             Budget
           </a>
          </li>
          <router-link :to="{ name: 'reports' }" tag="li">
            <a>
              <i class=" fa fa-bar-chart"></i>
              Reports
            </a>
          </router-link>
          <router-link :to="{ name: 'accounts' }" tag="li" exact>
            <a>
              <i class=" fa fa-university"></i>
              All Accounts
            </a>
          </router-link>
        </ul>
        <sidebar-account-list></sidebar-account-list>
        <button @click="addAccount()" class="button-sidebar nav-add-account button">
            <i class="fa fa-plus-circle"></i>
            Add Account
        </button>
      </div>
      <button class="button-prefs button-prefs-user button">
         <div @click="logout()" class="button-truncate" style="cursor: pointer">
            <i class="fa fa-sign-out flaticon"></i>
         </div>
      </button>

      <modal-add-account></modal-add-account>
   </nav>
</template>

<script>
import { mapGetters } from 'vuex';
import moment from 'moment';
import SidebarAccountList from './SidebarAccountList';
import ModalAddAccount from './ModalAddAccount';

export default {
  components: {
    SidebarAccountList,
    ModalAddAccount,
  },
  computed: {
    ...mapGetters([
      'budgetDate'
    ]),
    budgetRouteDate() {
      return moment(this.budgetDate).format('YYYYMM');
    },
    matchedRoute() {
      if (this.$route.matched[0]) {
        return this.$route.matched.length && this.$route.matched[0].name;
      }
    }
  },
  methods: {
    goToBudget() {
      this.$router.push({ name: 'budget_date', params: { date: this.budgetRouteDate } });
    },
    goToRecentBudget() {
      this.$router.push({ name: 'budget' });
    },
    addAccount() {
      this.$modal.show('add-account-modal');
    },
    async logout() {
      try {
        await this.$store.dispatch('logout');
        this.$router.push({ name: 'login' });
      } catch (error) {
        throw new Error(error);
      }
    }
  }
};
</script>


