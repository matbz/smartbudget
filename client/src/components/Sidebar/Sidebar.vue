<template>
   <nav class="ynab-u sidebar">
      <div class="sidebar-contents">
        <button class="button button-prefs" @dblclick="switchBudget()" @click="goToRecentBudget()">
            SmartBudget
        </button>
        <ul class="nav-main">
          <li @dblclick="switchBudget()" @click="goToBudget()" :class="{ 'active': matchedRoute === 'budget_date' }">
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
              Account
            </a>
          </router-link>
        </ul>
        <!-- <sidebar-account-list></sidebar-account-list> -->
        <!-- <button @click="addAccount()" class="button-sidebar nav-add-account button">
            <i class="fa fa-plus-circle"></i>
            Add Account
        </button> -->
      </div>
      <button class="button-prefs button-prefs-user button">
         <div @click="logout()" class="button-truncate" style="cursor: pointer; float: left">
            <i class="fa fa-sign-out flaticon btnsb"></i>
         </div>
         <div @click="showSettings()" class="button-truncate" style="cursor: pointer; float: right">
            <i class="fa fa-cog flaticon btnsb"></i>
         </div>
        <div @click="switchBudget()" class="button-truncate" style="cursor: pointer; float: right; margin-right: 30px">
            <i class="fa fa-random flaticon btnsb"></i>
         </div>
      </button>

      <modal-add-account></modal-add-account>
      <modal-settings></modal-settings>
   </nav>
</template>

<script>
import { mapGetters } from 'vuex';
import { HTTP } from '@/common/utilities';
import moment from 'moment';
// import SidebarAccountList from './SidebarAccountList';
import ModalAddAccount from './ModalAddAccount';
import ModalSettings from './ModalSettings';

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

export default {
  components: {
    // SidebarAccountList,
    ModalAddAccount,
    ModalSettings
  },
  computed: {
    ...mapGetters([
      'user',
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
      const date = moment(new Date()).format('YYYYMM01');
      this.$store.dispatch('setBudgetDate', date);
      this.$router.push({ name: 'budget_date', params: { date: moment(this.budgetDate).format('YYYYMM') } });
      // this.$router.push({ name: 'budget' });
    },
    addAccount() {
      this.$modal.show('add-account-modal');
    },
    showSettings() {
      this.$modal.show('modal-settings');
    },
    async switchBudget() {
      const response = await HTTP.get(`/api/budgets?userid=${this.user.id}`);
      if (response.data.length === 2) {
        await asyncForEach(response.data, async (o) => {
          await HTTP.put(`/api/budgets/${o.id}`, {
            active: !o.active
          });
        });

        await this.$store.dispatch('getBudgetId', this.$store.getters.user);
        this.$store.dispatch('getAccounts');
        this.$store.dispatch('getTurnovers', {
          start: moment(this.budgetDate).format('YYYYMM01'),
          end: moment(this.budgetDate).format('YYYYMM' + moment(this.budgetDate).daysInMonth().toString())
        });
        this.$store.dispatch('getToBeBudgeted', this.budgetDate);
        this.$store.dispatch('getBudgetedLastMonth', this.budgetDate);
        this.$store.dispatch('getBudgetList', this.budgetDate);
        this.$router.push({ name: 'budget_date', params: { date: moment(this.budgetDate).format('YYYYMM') } });
      } else {
        this.$toasted.show('No other budget found.');
      }
    },
    async logout() {
      try {
        await this.$store.dispatch('logout');
        this.$router.push({ name: 'login' });
      } catch (error) {
        throw new Error(error);
      }
    }
  },
  created() {
    this.$store.dispatch('getAccounts');
  }
};
</script>


