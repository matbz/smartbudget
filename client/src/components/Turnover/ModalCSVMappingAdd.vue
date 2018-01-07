<template>
  <modal name="modal-csv-mapping-add" :width="400" height="auto" :pivot-y="0.3" @before-open="beforeOpen" @opened="opened">
    <ul class="form-style-1" @keyup.enter="save()">
      <div class="account-widget">
        <div class="account-widget-header">
          <div class="account-widget-header-title">
            <h1>Add CSV-Mapping</h1>
            <div @click="close()" class="account-widget-header-close">
              <button>
                <svg viewBox="0 -32 512 512" width="26" height="26" class="y-icon y-icon-close"><path d="M 381.568,143.68L 302.368,222.88l 79.20,79.20c 6.304,6.24, 6.304,16.384,0.00,22.624l-22.624,22.624 c-6.24,6.24-16.384,6.24-22.624,0.00L 257.152,268.128L 177.952,347.328c-6.24,6.24-16.384,6.24-22.624,0.00L 132.704,324.672 c-6.272-6.24-6.272-16.384,0.00-22.624l 79.20-79.20L 132.704,143.68c-6.272-6.24-6.272-16.384,0.00-22.624l 22.624-22.624 c 6.24-6.24, 16.384-6.24, 22.624,0.00l 79.20,79.20l 79.168-79.20c 6.24-6.24, 16.384-6.24, 22.624,0.00l 22.624,22.624 C 387.872,127.328, 387.872,137.44, 381.568,143.68z"></path></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      <li>
          <label>Payee CSV</label>
          <input ref="payeeCSV" type="text" class="field-long" v-model.trim="mapping.payee_csv"/>
      </li>
      <li>
          <label>Payee</label>
          <input type="text" class="field-long" v-model.trim="mapping.payee"/>
      </li>
      <li>
          <label>Note</label>
          <input type="text" class="field-long" v-model.trim="mapping.note"/>
      </li>
      <li>
          <label>Category</label>
          <el-select class="field-long" placeholder="Category" v-model="mapping.category_id" filterable clearable>
            <el-option-group
              v-for="group in selectDataCategories"
              :key="group.label"
              :label="group.label">
              <el-option
                v-for="item in group.categories"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-option-group>
          </el-select>
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
import { mapGetters } from 'vuex';
import { HTTP } from '@/common/utilities';

export default {
  data() {
    return {
      mapping: {
        id: null,
        payee: null,
        payee_csv: null,
        note: null,
        category_name: null,
        category_id: null
      }
    };
  },
  computed: {
    ...mapGetters([
      'categories',
      'categoryGroups',
      'user'
    ]),
    categoriesFiltered() {
      return this.categories.filter(c => !c.is_hidden);
    },
    categoryGroupsFiltered() {
      return this.categoryGroups.filter(cg => !cg.is_hidden);
    },
    selectDataCategories() {
      const data = [];

      this.categoryGroupsFiltered.forEach(cg => {
        const categories = this.categoriesFiltered.filter(c => cg.id === c.categorygroup_id).map(c => {
          return {
            label: c.name,
            value: c.id
          };
        });

        data.push({
          categories: categories,
          label: cg.name
        });
      });
      return data;
    }
  },
  methods: {
    beforeOpen(event) {
      if (event.params) {
        this.mapping = { ...event.params };
      }
    },
    opened() {
      this.$refs.payeeCSV.focus();
    },
    close() {
      this.mapping = {
        id: null,
        payee: null,
        payee_csv: null,
        note: null,
        category_name: null,
        category_id: null
      };
      this.$modal.hide('modal-csv-mapping-add');
    },
    async save() {
      if (this.mapping.id) {
        await HTTP.put(`/api/csvmappings/${this.mapping.id}`, this.mapping);
      } else {
        await HTTP.post(`/api/${this.user.id}/csvmappings`, this.mapping);
      }
      this.$emit('saved');
      this.close();
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
    height: 38px;
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
