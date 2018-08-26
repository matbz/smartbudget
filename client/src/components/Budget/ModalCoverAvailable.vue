<template>
  <modal class="modal-popup" :name="name" :width="288" height="auto" :pivot-y="0.3" :pivot-x="0.45" @closed="closed">
  <div class="modal-content">
    <div class="fieldset">
      <label>Cover this overspending with:</label>
      <el-select class="modal-select" placeholder="" v-model="moveCategoryId" filterable clearable>
        <el-option-group
          v-for="group in selectDataCategories"
          :key="group.label"
          :label="group.label">
          <el-option
            v-for="item in group.categories"
            :key="item.value"
            :label="item.label"
            :value="item.value">
             <span style="float: left">{{ item.label }}</span>
             <span
                class="select-available select-available-zero"
                :class="{
                  'select-available-positive': item.available > 0,
                  'select-available-negative': item.available < 0
                }"
              >
                {{ item.available | currency }}
              </span>
          </el-option>
        </el-option-group>
      </el-select>
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
import { HTTP } from '@/common/utilities';
import moment from 'moment';

export default {
  props: [
    'name',
    'categoryid',
    'available',
    'mode'
  ],
  data() {
    return {
      moveCategoryId: null
    };
  },
  computed: {
    ...mapGetters([
      'budgetDate',
      'budgetList'
    ]),
    selectDataCategories() {
      const data = [];

      this.budgetList.forEach(e => {
        if (!e.header.categorygroup_is_hidden) {
          const categories = e.items.map(c => {
            return {
              label: c.category_name,
              value: c.category_id,
              available: c.available,
              isHidden: c.category_is_hidden
            };
          }).filter(cf => !cf.isHidden);

          data.push({
            categories: categories,
            label: e.header.categorygroup_name
          });
        }
      });

      return data;
    }
  },
  methods: {
    closed() {
      this.$emit('closed');
    },
    close() {
      this.moveCategoryId = null;
      this.$modal.hide(this.name);
    },
    async save() {
      if (this.moveCategoryId) {
        if (this.mode !== 'tbb') {
          const srcCat = await HTTP.get(`/api/categoriesbudgeted?categoryid=${this.categoryid}&date=${moment(this.budgetDate).format('YYYYMM01')}`);
          let srcCatAmount;
          if (srcCat.data.amount) {
            srcCatAmount = Number(srcCat.data.amount) - Number(this.available);
          } else {
            srcCatAmount = Number(this.available) * -1;
          }
          await HTTP.put(`/api/categoriesbudgeted/${this.categoryid}/${moment(this.budgetDate).format('YYYYMM01')}`, { amount: srcCatAmount });
        }

        const moveCat = await HTTP.get(`/api/categoriesbudgeted?categoryid=${this.moveCategoryId}&date=${moment(this.budgetDate).format('YYYYMM01')}`);
        let moveCatAmount;
        if (moveCat.data.amount) {
          moveCatAmount = Number(moveCat.data.amount) + Number(this.available);
        } else {
          moveCatAmount = Number(this.available);
        }
        await HTTP.put(`/api/categoriesbudgeted/${this.moveCategoryId}/${moment(this.budgetDate).format('YYYYMM01')}`, { amount: moveCatAmount });

        await this.getBudget();
        this.close();
      } else {
        this.$toasted.error('Category Group is required.');
      }
    },
    async getBudget() {
      try {
        this.$store.dispatch('getToBeBudgeted', this.budgetDate);
        this.$store.dispatch('getBudgetedLastMonth', this.budgetDate);
        await this.$store.dispatch('getBudgetList', this.budgetDate);
      } catch (error) {
        this.$toasted.error('There was an error getting the budget list.');
      }
    }
  }
};
</script>

