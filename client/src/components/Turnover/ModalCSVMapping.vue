<template>
  <modal class="modal-popup modal-budget-activity" name="modal-csv-mapping" :width="512" height="auto" :pivot-y="0.2" :pivot-x="0.45" @before-open="beforeOpen" @closed="closed">
    <div class="modal-content">
      <span class="activity-header">
        CSV Mapping
      </span>
      <span class="activity-header"><i class="fa fa-plus-circle" @click="addMapping"></i></span>
      <div class="ynab-table-5-col ynab-table" :class="scrollbarClass">
        <div class="ynab-table-head">
          <div class="ynab-table-col user-data">Payee CSV</div>
          <div class="ynab-table-col user-data">Payee</div>
          <div class="ynab-table-col user-data">Note</div>
          <div class="ynab-table-col user-data">Category</div>
          <div class="amount-column ynab-table-col user-data">Actions</div>
        </div>
        <div class="ynab-table-body">
          <modal-csv-mapping-row
            v-for="mapping in mappings"
            :mapping="mapping"
            :key="mapping.id"
            @deleted="updateMappings">
          </modal-csv-mapping-row>
        </div>
      </div>
      <div class="modal-actions">
      <button class="button button-primary" @click="close()">
          Close
          <i class="fa fa-check-circle-o"></i>
      </button>
      </div>
    </div>
  </modal>
</template>

<script>
import { mapGetters } from 'vuex';
import { HTTP } from '@/common/utilities';
import ModalCsvMappingRow from './ModalCSVMappingRow';

export default {
  components: {
    ModalCsvMappingRow
  },
  data() {
    return {
      mappings: []
    };
  },
  computed: {
    ...mapGetters([
      'user'
    ]),
    scrollbarClass() {
      if (this.mappings.length > 6) {
        return 'has-scrollbar';
      }
    }
  },
  methods: {
    addMapping() {
      this.$modal.show('modal-csv-mapping-add');
    },
    closed() {
      this.$emit('closed');
    },
    close() {
      this.$modal.hide('modal-csv-mapping');
    },
    async updateMappings() {
      const response = await HTTP.get(`/api/${this.user.id}/csvmappings`);
      this.mappings = response.data;
    },
    beforeOpen() {
      this.updateMappings();
    }
  }
};
</script>

