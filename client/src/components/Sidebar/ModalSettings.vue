<template>
  <modal name="modal-settings" :width="400" height="auto" :pivot-y="0.3">
    <ul class="form-style-1" @keyup.esc="close()">
      <div class="account-widget">
        <div class="account-widget-header">
          <div class="account-widget-header-title">
            <h1>Settings</h1>
            <div @click="close()" class="account-widget-header-close">
              <button>
                <svg viewBox="0 -32 512 512" width="26" height="26" class="y-icon y-icon-close"><path d="M 381.568,143.68L 302.368,222.88l 79.20,79.20c 6.304,6.24, 6.304,16.384,0.00,22.624l-22.624,22.624 c-6.24,6.24-16.384,6.24-22.624,0.00L 257.152,268.128L 177.952,347.328c-6.24,6.24-16.384,6.24-22.624,0.00L 132.704,324.672 c-6.272-6.24-6.272-16.384,0.00-22.624l 79.20-79.20L 132.704,143.68c-6.272-6.24-6.272-16.384,0.00-22.624l 22.624-22.624 c 6.24-6.24, 16.384-6.24, 22.624,0.00l 79.20,79.20l 79.168-79.20c 6.24-6.24, 16.384-6.24, 22.624,0.00l 22.624,22.624 C 387.872,127.328, 387.872,137.44, 381.568,143.68z"></path></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      <li>
          <button
            class="button button-cancel x-14 fbtn"
            @click="backup()"
          >
            <i class="fa fa-download"></i>
            Backup
          </button>

        <form enctype="multipart/form-data">
          <input class="inputfile" ref="fileinput" name="file" id="file" type="file" @change="onFileChange">
        </form>
        <label class="button button-cancel x-14 btn" for="file">
        <i class="fa fa-upload"></i> Restore</label>
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
    color: #009cc2;
    text-align: left;
    cursor: pointer;
}

.btn:hover {
  background-color: #005076;
  border-color: #005076;
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
