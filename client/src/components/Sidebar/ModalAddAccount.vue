<template>
  <modal name="add-account-modal" :width="400" height="auto" :pivot-y="0.3" @opened="opened">
    <ul class="form-style-1" @keyup.esc="close()" @keyup.enter="save()">
      <div class="account-widget">
        <div class="account-widget-header">
          <div class="account-widget-header-title">
            <h1>Add Account</h1>
            <div @click="close()" class="account-widget-header-close">
              <button>
                <svg viewBox="0 -32 512 512" width="26" height="26" class="y-icon y-icon-close"><path d="M 381.568,143.68L 302.368,222.88l 79.20,79.20c 6.304,6.24, 6.304,16.384,0.00,22.624l-22.624,22.624 c-6.24,6.24-16.384,6.24-22.624,0.00L 257.152,268.128L 177.952,347.328c-6.24,6.24-16.384,6.24-22.624,0.00L 132.704,324.672 c-6.272-6.24-6.272-16.384,0.00-22.624l 79.20-79.20L 132.704,143.68c-6.272-6.24-6.272-16.384,0.00-22.624l 22.624-22.624 c 6.24-6.24, 16.384-6.24, 22.624,0.00l 79.20,79.20l 79.168-79.20c 6.24-6.24, 16.384-6.24, 22.624,0.00l 22.624,22.624 C 387.872,127.328, 387.872,137.44, 381.568,143.68z"></path></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      <li>
          <label>Name</label>
          <input ref="accountName" type="text" class="field-long" v-model.trim="account.name"/>
      </li>
      <li>
          <label>CSV-Delimiter</label>
          <input type="text" class="field-long" v-model.trim="account.csv_delimiter"/>
      </li>
      <li>
          <label>CSV-Decimalsymbol</label>
          <input type="text" class="field-long" v-model.trim="account.csv_decimalsymbol"/>
      </li>
      <li>
          <label>CSV-Offset</label>
          <input type="text" class="field-long" v-model.trim="account.csv_offset"/>
      </li>
      <li>
          <label>CSV-Encoding</label>
          <input type="text" class="field-long" v-model.trim="account.csv_encoding"/>
      </li>
      <li style="margin-top: 20px"></li>
      <li class="account-widget-footer">
          <button
            class="button button-cancel x-14"
            @click="close()"
          >
            Cancel
            <i class="fa fa-times-circle-o"></i>
          </button>
          <button
            type="submit"
            class="button button-primary x-14"
            @click="save()"
            style="float: right"
          >
            Save
            <i class="fa fa-check-circle-o"></i>
          </button>
      </li>
    </ul>
  </modal>
</template>

<script>
export default {
  data() {
    return {
      account: {
        name: '',
        csv_delimiter: '',
        csv_decimalsymbol: '',
        csv_offset: '',
        csv_encoding: ''
      }
    };
  },
  methods: {
    opened() {
      this.$refs.accountName.focus();
    },
    close() {
      this.account = {
        name: '',
        csv_delimiter: '',
        csv_decimalsymbol: '',
        csv_offset: '',
        csv_encoding: ''
      };
      this.$modal.hide('add-account-modal');
    },
    async save() {
      if (this.account.name) {
        try {
          await this.$store.dispatch('createAccount', this.account);
          await this.$store.dispatch('getAccounts');
          this.$modal.hide('add-account-modal');
        } catch (error) {
          this.$toasted.error('Error');
        }
      } else {
        this.$toasted.error('Account name is required.');
      }
    }
  }
};
</script>

<style lang="scss" scoped>
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
.form-style-1 label{
    margin:0 0 5px 1px;
    padding:0px;
    display:block;
    font-weight: bold;
    font-size: 14px;
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
