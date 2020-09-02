<template>
  <div>
    <router-link :to="{ name: 'accounts_id', params: { accountid: account.id }}" tag="div" active-class="active" class="nav-account-row">
      <div class="nav-account-notification">
        <i @click.prevent="edit" class="fa fa-pencil-square-o"></i>
      </div>
      <div class="nav-account-name">
          <div class="nav-account-name-val">
            <span>{{ account.name }}</span>
          </div>
      </div>
      <!-- <div class="nav-account-value"><span class="currency positive">{{ account.balance | currency }}</span></div> -->
    </router-link>
    <modal-edit-account :name="account.name" :data="account"></modal-edit-account>
  </div>
</template>

<script>
import ModalEditAccount from './ModalEditAccount';

export default {
  components: {
    ModalEditAccount
  },
  props: ['account'],
  methods: {
    edit() {
      this.$modal.show(this.account.name, this.account);
    }
  }
};
</script>

