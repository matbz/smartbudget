<template>
  <div class="nav-accounts">
    <div class="nav-account">
      <div class="nav-account-block">
          <div class="nav-account-name">
            <button class="nav-account-name-button">ACCOUNTS</button>
          </div>
          <!-- <div class="nav-account-value">
            <span>{{ accountsTotal | currency }}</span>
          </div> -->
      </div>
      <sidebar-account-list-item
        v-for="account in accounts"
        :account = "account"
        :key="account.id"
      ></sidebar-account-list-item>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import SidebarAccountListItem from './SidebarAccountListItem';

export default {
  components: {
    SidebarAccountListItem
  },
  computed: {
    ...mapGetters([
      'accounts'
    ]),
    accountsTotal() {
      return this.accounts
        ? this.accounts.reduce((total, value) => total + Number(value.balance), 0)
        : null;
    }
  },
  created() {
    this.$store.dispatch('getAccounts');
  }
};
</script>
