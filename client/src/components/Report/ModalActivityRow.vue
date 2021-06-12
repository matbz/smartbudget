<template>
  <div class="budget-activity ynab-table-row">
    <!-- <div class="ynab-table-col" :title="turnover.account_name">{{turnover.account_name}}</div> -->
    <div class="ynab-table-col" style="width:30%">{{turnover.turnover_date}}</div>
    <!-- <div class="ynab-table-col" :title="turnover.payee">{{turnover.payee}}</div> -->
    <div class="ynab-table-col" style="width:45%" :title="turnover.note">{{turnover.note}}</div>
    <div class="amount-column ynab-table-col" style="width:25%" :class="{ negative: turnover.amount < 0 }">{{ turnover.amount | currency}}</div>
  </div>
</template>

<script>
export default {
  props: [
    'turnover'
  ]
};
</script>

