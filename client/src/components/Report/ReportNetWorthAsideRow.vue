<template>
  <tr>
    <td>
        <button>{{ dateFormatted }}</button>
    </td>
    <td>
        <span class="currency">{{ balance | currency }}</span>
        <i :class="iconClass"></i>
    </td>
  </tr>
</template>

<script>
import moment from 'moment';

export default {
  props: [
    'date',
    'balance',
    'prevBalance'
  ],
  computed: {
    iconClass() {
      const nBalance = Number(this.balance);
      const nPrevBalance = Number(this.prevBalance);

      if (nBalance > nPrevBalance) {
        return 'fa fa-arrow-up positive-net-worth';
      } else if (nBalance < nPrevBalance) {
        return 'fa fa-arrow-down negative-net-worth';
      }

      return 'fa fa-minus';
    },
    dateFormatted() {
      const dateParts = this.date.split('/');
      return moment(new Date(dateParts[1], dateParts[0] - 1, '01')).format('MMM YYYY');
    }
  },
};
</script>
