<template>
  <div class="budget-activity ynab-table-row">
    <div class="ynab-table-col" :title="mapping.payee_csv">{{mapping.payee_csv}}</div>
    <div class="ynab-table-col">{{mapping.payee}}</div>
    <div class="ynab-table-col" :title="mapping.note">{{mapping.note}}</div>
    <div class="ynab-table-col" :title="mapping.category_name">{{mapping.category_name}}</div>
    <div class="amount-column ynab-table-col">
      <i class="icon edit fa fa-pencil-square-o" @click="changeMapping()"></i>
      <i class="icon delete fa fa-trash-o" @click="deleteMapping()"></i>
    </div>
  </div>
</template>

<script>
import { HTTP } from '@/common/utilities';

export default {
  props: [
    'mapping'
  ],
  methods: {
    changeMapping() {
      this.$modal.show('modal-csv-mapping-add', this.mapping);
    },
    async deleteMapping() {
      await HTTP.delete(`/api/csvmappings/${this.mapping.id}`);
      this.$emit('deleted');
    }
  }
};
</script>

<<style scoped>
  .icon {
    font-size: 1.1em;
  }

  .delete {
    margin-left: 1em;
    padding-right: 0.1em;
    color: #d33c2d;
  }
</style>


