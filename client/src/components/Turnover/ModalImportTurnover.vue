<template>
  <modal class="modal-popup" name="modal-import-turnover" :width="320" height="auto" :pivot-y="0.15">
    <div class="modal-content">
      <div class="fieldset">
        <label>Import turnovers:</label>
        <form v-show="!loading && !uploaded" enctype="multipart/form-data">
          <input ref="fileinput" class="mb" type="file" @change="onFileChange">
        </form>
        <div class="mb" v-show="uploaded">
          <span>Upload finished - Reset:</span><i class="fa fa-refresh" style="font-size: 1.5em; margin-left: 10px" @click="resetFile()"></i>
        </div>
        <i v-show="loading" class="fa fa-circle-o-notch fa-spin" style="font-size:24px"></i>
        <label>Show only imported turnovers:</label>
        <input class="mb" type="checkbox" v-model="checkbox" />
        <label>Mark imported turnovers:</label>
        <el-date-picker
          v-model="date"
          type="date"
          placeholder="Pick a date"
          format="dd.MM.yyyy"
          :clearable="true"
          class="mb modal-date">
        </el-date-picker>
        <label>Manage csv mapping:</label>
        <button class="mb button button-cancel" @click="showCSVMappingModal()">
          CSV Mapping
        </button>
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
    <modal-csv-mapping ref="csvmappings"></modal-csv-mapping>
    <modal-csv-mapping-add @saved="updateMappings()"></modal-csv-mapping-add>
  </modal>
</template>

<script>
import { mapGetters } from 'vuex';
import { HTTP } from '@/common/utilities';
import moment from 'moment';
import ModalCsvMapping from './ModalCSVMapping';
import ModalCsvMappingAdd from './ModalCSVMappingAdd';

export default {
  components: {
    ModalCsvMapping,
    ModalCsvMappingAdd
  },
  data() {
    return {
      loading: false,
      uploaded: false,
      date: null,
      checkbox: false
    };
  },
  computed: {
    ...mapGetters([
      'selectedTurnovers',
      'user'
    ])
  },
  methods: {
    resetFile() {
      this.$refs.fileinput.value = '';
      this.uploaded = false;
    },
    async onFileChange(e) {
      this.loading = true;
      const files = e.target.files || e.dataTransfer.files;
      if (!files.length) {
        return;
      }

      const formData = new FormData();
      formData.append('csvFile', files[0]);

      const result = await HTTP.post(`/api/accounts/1/import?userid=${this.user.id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      this.date = result.data.importDate;
      this.uploaded = true;
      this.loading = false;
    },
    updateMappings() {
      this.$refs.csvmappings.updateMappings();
    },
    showCSVMappingModal() {
      this.$modal.show('modal-csv-mapping');
    },
    close() {
      this.$modal.hide('modal-import-turnover');
    },
    save() {
      let date = moment(this.date).format('YYYY-MM-DD');
      if (date.length > 10) {
        date = null;
      }
      this.$store.dispatch('setTurnoverImportDate', date);
      this.$store.dispatch('setShowOnlyImportedTurnovers', this.checkbox);

      this.$emit('saved');
      this.close();
    },
  }
};
</script>

<style scoped>
  .modal-content {
    overflow: hidden;
  }

  .mb {
    margin-bottom: 1em;
  }

  input {
    padding: 0;
    border: none;
    width: auto;
  }

  .button-cancel {
    cursor: pointer;
  }
</style>
