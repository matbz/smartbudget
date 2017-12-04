<template>
  <div>
    <div class="budget-inspector-goals-edit-section">
        <h3>Goal</h3>
        <div>
          <dl>
              <dt>
                Target Balance:
              </dt>
              <dd @keyup.esc="cancel()" @keyup.enter="save()">
                <vue-numeric
                  currency="€"
                  currency-symbol-position="suffix"
                  separator="."
                  v-model="goal.amount"
                  :minus="true"
                  :precision="2"
                ></vue-numeric>
              </dd>
          </dl>
          <dl>
              <dt>Target Month &amp; Year:</dt>
              <dd class="datepicker-goal">
                <div class="fake-input">{{ dateFormatted }}</div>
                <el-date-picker
                  v-model="date"
                  type="month"
                  popper-class="sb-datepicker"
                  @change="onDateChange()">
                </el-date-picker>
              </dd>
          </dl>
        </div>
    </div>
    <div class="fieldset">
        <dl>
          <dd class="actions">
              <button class="button link-button" @click="deleteGoal()">Delete</button>
              <button v-if="dateFormatted" class="button link-button clear-date" @click="clearDate()">Clear Date</button>
              <button class="button link-button" @click="cancel()">Cancel</button>
              <button class="button button-primary" @click="save()">
                OK <i class="fa fa-check-circle-o"></i>
              </button>
          </dd>
        </dl>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { HTTP } from '@/common/utilities';
import moment from 'moment';

export default {
  data() {
    return {
      isEdit: true,
      date: null,
      goal: {
        amount: 0,
        enddate: null,
        category_id: null
      }
    };
  },
  computed: {
    ...mapGetters([
      'budgetDate',
      'selectedCategories',
      'goals'
    ]),
    goalData() {
      return this.goals[0] ? this.goals[0] : null;
    },
    dateFormatted() {
      if (this.date) {
        return moment(this.date).format('MMMM YYYY');
      }
      return '';
    },
    categoryId() {
      return this.selectedCategories[0].category_id;
    }
  },
  methods: {
    close() {
      this.$emit('closed');
    },
    async deleteGoal() {
      await HTTP.delete(`/api/goals/${this.goalData.id}`);
      await this.$store.dispatch('getGoals', { categoryid: this.goal.category_id });
      this.getBudget();
      this.close();
    },
    cancel() {
      this.close();
    },
    clearDate() {
      this.date = null;
      this.goal.enddate = null;
    },
    onDateChange() {
      this.goal.enddate = moment(this.date).format('YYYY-MM-DD');
    },
    async save() {
      const todayDate = moment(new Date()).format('YYYY-MM-01');

      if (this.goal.enddate && this.goal.enddate <= todayDate) {
        this.$toasted.error('Target Date must be in the future.');
        return;
      }

      if (this.goal.amount <= 0) {
        this.$toasted.error('Target Balance must be greater than 0,00€.');
        return;
      }

      if (this.goalData) {
        await HTTP.put(`/api/goals/${this.goalData.id}`, this.goal);
      } else {
        await HTTP.post('/api/goals', this.goal);
      }

      await this.$store.dispatch('getGoals', { categoryid: this.goal.category_id });
      this.getBudget();
      this.close();
    },
    getBudget() {
      try {
        this.$store.dispatch('getToBeBudgeted', this.budgetDate);
        this.$store.dispatch('getBudgetList', this.budgetDate);
      } catch (error) {
        this.$toasted.error('There was an error getting the budget list.');
      }
    }
  },
  created() {
    this.goal.category_id = this.categoryId;
    if (this.goalData) {
      this.goal.amount = Number(this.goalData.amount);
      this.goal.enddate = this.goalData.enddate ? moment(this.goalData.enddate).format('YYYY-MM-01') : null;
      this.date = this.goalData.enddate;
    }
  }
};
</script>

<style scoped>
  button {
    cursor: pointer;
  }
</style>

