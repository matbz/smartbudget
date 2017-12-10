<template>
  <tr>
    <td>
        <button>{{ dateFormatted }}</button>
    </td>
    <td>
        <span class="currency">{{ balance | currency }}</span>
        <i :class="iconClass"></i>
        <!-- <i class="icon-placeholder"></i> -->
    </td>
  </tr>
  <!-- <tr>
    <td>
        <button>Nov 2017</button>
    </td>
    <td>
        <span class="currency">7.180,00<bdi>€</bdi></span>
        <i class="fa fa-arrow-down negative-net-worth"></i>
    </td>
  </tr>
  <tr>
    <td>
        <button>Oct 2017</button>
    </td>
    <td>
        <span class="currency">8.680,00<bdi>€</bdi></span>
        <i class="fa fa-arrow-up positive-net-worth"></i>
    </td>
  </tr>
  <tr>
    <td>
        <button>Aug 2017</button>
    </td>
    <td>
        <span class="currency">6.380,00<bdi>€</bdi></span>
        <i class="fa fa-minus"></i>
    </td>
  </tr> -->
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
