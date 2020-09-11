<template>
  <modal name="modal-settings" :width="400" height="auto" :pivot-y="0.3">
    <ul class="form-style-1" @keyup.esc="close()">
      <div class="account-widget">
        <div class="account-widget-header">
          <div class="account-widget-header-title">
            <h1 style="color:#383e41">Settings</h1>
            <div @click="close()" class="account-widget-header-close">
              <button style="margin-bottom:.5em">
<svg height="26" width="26" viewBox="0 0 24 24" id="ember343" class="y-icon y-icon-close-circle ember-view"><path fill-rule="evenodd" clip-rule="evenodd" d="M24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12ZM15.096 7.42814C15.474 7.0501 16.0869 7.05005 16.4649 7.42803C16.8429 7.80602 16.8428 8.4189 16.4648 8.79694L13.2721 11.9897L16.4037 15.1213C16.7817 15.4993 16.7817 16.1122 16.4036 16.4903C16.0256 16.8683 15.4127 16.8684 15.0347 16.4904L11.903 13.3587L8.71023 16.5515C8.33218 16.9295 7.7193 16.9296 7.34132 16.5516C6.96333 16.1736 6.96338 15.5607 7.34143 15.1827L10.5342 11.9899L7.40257 8.85825C7.02459 8.48026 7.02464 7.86738 7.40268 7.48933C7.78073 7.11129 8.39361 7.11124 8.7716 7.48922L11.9033 10.6209L15.096 7.42814Z"></path>
</svg>              </button>
            </div>
          </div>
        </div>
      </div>
      <li>
          <button
            class="button button-cancel x-14 fbtn btn"
            @click="backup()"
          >
            <i class="fa fa-download"></i>
            Backup
          </button>

        <form enctype="multipart/form-data">
          <input class="inputfile" ref="fileinput" name="file" id="file" type="file" @change="onFileChange">
        </form>
        <label class="button button-cancel x-14 btn" for="file">
        <i class="fa fa-upload"></i>
        Restore</label>
      </li>
      <li style="margin-top: 20px"></li>
      <li class="account-widget-footer">
          <button
            class="button button-cancel x-14"
            @click="close()"
          >
            Close
          </button>
      </li>
    </ul>
  </modal>
</template>

<script>
import { mapGetters } from 'vuex';
import { HTTP } from '@/common/utilities';

export default {
  computed: {
    ...mapGetters([
      'user',
      'budgetId'
    ]),
  },
  methods: {
    close() {
      this.$modal.hide('modal-settings');
    },
    backup() {
      this.$store.dispatch('backupBudget', this.user);
      this.$toasted.success('Backup created. Downloading file...');
      this.close();
    },
    async onFileChange(e) {
      const files = e.target.files || e.dataTransfer.files;
      if (!files.length) {
        return;
      }

      const formData = new FormData();
      formData.append('backupFile', files[0]);

      HTTP.post(`/api/${this.budgetId}/budgets/restore`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });

      this.close();
      this.$toasted.success('Backup restored. Page reloading...');

      setTimeout(() => {
        location.reload();
      }, 2000);
    },
  }
};
</script>

<style lang="scss" scoped>
.inputfile {
	width: 0.1px;
	height: 0.1px;
	opacity: 0;
	overflow: hidden;
	position: absolute;
  z-index: -1;
}

.fbtn {
  padding: .3em 1.9em !important;
  margin-bottom: 15px;
}

.btn {
    padding: .3em 1.9em;
    -webkit-border-radius: .4em;
    border-radius: .4em;
    border: 2px solid #dee3e8;
    background-color: transparent;
    color: #4495d7;
    text-align: left;
    cursor: pointer;
}

.btn:hover {
  background-color: #3674a7;
  border-color: #3674a7;
  color: #fff;
}

button {
  cursor: pointer;
}
.form-style-1{
    margin:10px auto;
    max-width: 400px;
    padding: 5px 12px 10px 20px;
    color: black;
}
.form-style-1 li {
    padding: 0;
    display: block;
    list-style: none;
    margin: 2px 0 0 0;
}

.form-style-1 input[type=text],
.form-style-1 input[type=date],
.form-style-1 input[type=datetime],
.form-style-1 input[type=number],
.form-style-1 input[type=search],
.form-style-1 input[type=time],
.form-style-1 input[type=url],
.form-style-1 input[type=email],
textarea,
select{
    width: 100%;
    font-size: 1em;
    padding: .5em;
    margin-bottom: .5em;
    border: 2px solid #88979d;
    -webkit-border-radius: .3em;
    border-radius: .3em;
}
.form-style-1 input[type=text]:focus,
.form-style-1 input[type=date]:focus,
.form-style-1 input[type=datetime]:focus,
.form-style-1 input[type=number]:focus,
.form-style-1 input[type=search]:focus,
.form-style-1 input[type=time]:focus,
.form-style-1 input[type=url]:focus,
.form-style-1 input[type=email]:focus,
.form-style-1 textarea:focus,
.form-style-1 select:focus{
    border: 2px solid #009cc2;
}
.form-style-1 .field-divided{
    width: 49%;
}

.form-style-1 .field-long{
    width: 100%;
}
.form-style-1 .field-select{
    width: 100%;
}
.form-style-1 .field-textarea{
    height: 100px;
}
</style>
