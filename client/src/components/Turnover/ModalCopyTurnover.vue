<template>
  <modal class="modal-popup" name="modal-copy-turnover" :width="224" height="auto" :pivot-y="0.15">
    <div class="modal-content">
      <div class="fieldset">
      <label>Copy turnovers to date:</label>
      <el-date-picker
        v-model="date"
        type="date"
        placeholder=""
        format="dd.MM.yyyy"
        :clearable="true"
        class="modal-date">
      </el-date-picker>
      </div>
    </div>
    <div class="modal-actions">
      <button class="button button-primary" @click="save()">
          OK
          <i class="fa fa-check-circle-o"></i>
      </button>
      <button class="button button-cancel" @click="close()">
          Cancel
          <i class="fa fa-times-circle-o"></i>
      </button>
    </div>
  </modal>
</template>

<script>
import { mapGetters } from 'vuex';
import moment from 'moment';

export default {
  data() {
    return {
      date: new Date()
    };
  },
  computed: {
    ...mapGetters([
      'selectedTurnovers'
    ])
  },
  methods: {
    close() {
      this.date = new Date();
      this.$modal.hide('modal-copy-turnover');
    },
    async save() {
      if (this.date) {
        const data = {
          ids: [...this.selectedTurnovers],
          date: moment(this.date).format('YYYY-MM-DD')
        };

        this.$emit('saved', data);
        this.close();
      } else {
        this.$toasted.error('Date is required.');
      }
    },
  }
};
</script>

