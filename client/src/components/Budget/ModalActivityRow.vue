<template>
  <div class="budget-activity ynab-table-row">
    <div class="ynab-table-col" :title="turnover.account_name">{{turnover.account_name}}</div>
    <div class="ynab-table-col">{{turnover.turnover_date}}</div>
    <div class="ynab-table-col" :title="turnover.payee">{{turnover.payee}}</div>
    <div class="ynab-table-col" :title="turnover.note">{{turnover.note}}</div>
    <div class="amount-column ynab-table-col" :class="{ negative: turnover.amount < 0 }">{{ turnover.amount | currency}}</div>
  </div>
</template>

<script>
export default {
  props: [
    'turnover'
  ]
};
</script>

