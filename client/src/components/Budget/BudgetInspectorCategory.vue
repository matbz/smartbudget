<template>
<div class="budget-inspector">
   <div class="budget-inspector-category-header pt-15">
      <div class="budget-inspector-category">
         <h1 class="inspector-category-name">
            <span>{{ this.category.category_name }}</span>
         </h1>
         <button class="inspector-category-edit" @click="editCategory()">
           <i class="fa fa-cog"></i>
           Edit
         </button>
      </div>
   </div>
   <div class="budget-inspector-category-overview">
      <div class="inspector">
         <dl>
            <dt>Budgeted</dt>
            <dd><span class="currency" :class="budgetedCurrencyClass">{{ category.budgeted | currency }}</span></dd>
            <dt>Activity</dt>
            <dd><span class="currency" :class="activityCurrencyClass">{{ category.activity | currency }}</span></dd>
         </dl>
         <hr class="clearfix">
         <dl class="inspector-overview-available">
            <dt class="currency">Available</dt>
            <dd><span class="currency" :class="availableCurrencyClass">{{ category.available | currency }}</span></dd>
         </dl>
      </div>
   </div>
   <div class="inspector-quick-budget">
      <h3>Quick Budget</h3>
      <button class="budget-inspector-button" @click="setBudgetedLastMonth(amountToStayOnTrack)">
        Goal Target: <strong><span class="currency positive">{{ amountToStayOnTrack | currency }}</span></strong>
      </button>
      <button class="budget-inspector-button" @click="setBudgetedLastMonth(budgetedLastMonth)">
        Budgeted Last Month: <strong><span class="currency positive">{{ budgetedLastMonth | currency }}</span></strong>
      </button>
   </div>
   <div class="budget-inspector-goals">
      <div v-if="!goal && !showAddGoalVisibility">
        <h3>Goal</h3>
        <button class="link-button budget-inspector-goals-create" @click="showAddGoal()">
          <i class="fa fa-plus-circle"></i>
          Create a goal
        </button>
      </div>
      <budget-inspector-category-goal-display v-else-if="goal && !isEdit" @edit="triggerEdit()"></budget-inspector-category-goal-display>
      <budget-inspector-category-goal-add v-else-if="isEdit" @closed="hideAddGoal()"></budget-inspector-category-goal-add>
      <budget-inspector-category-goal-add v-else @closed="hideAddGoal()"></budget-inspector-category-goal-add>
   </div>
</div>
</template>

<script>
import { mapGetters } from 'vuex';
import { HTTP } from '@/common/utilities';
import moment from 'moment';
import BudgetInspectorCategoryGoalAdd from './BudgetInspectorCategoryGoalAdd';
import BudgetInspectorCategoryGoalDisplay from './BudgetInspectorCategoryGoalDisplay';

export default {
  components: {
    BudgetInspectorCategoryGoalAdd,
    BudgetInspectorCategoryGoalDisplay
  },
  data() {
    return {
      showAddGoalVisibility: false,
      isEdit: false,
      budgetedLastMonth: 0
    };
  },
  computed: {
    ...mapGetters([
      'budgetDate',
      'selectedCategories',
      'goals',
      'budgetList'
    ]),
    goal() {
      return this.goals[0] ? this.goals[0] : null;
    },
    goalAmountLeft() {
      if (this.goal) {
        const amount = this.goal.amount - this.category.available;
        return amount < 0 ? 0 : amount;
      }
    },
    amountToStayOnTrack() {
      const amount = Number((this.goalAmountLeft + Number(this.category.budgeted)) / this.monthsDifference).toFixed(2);
      return amount >= 0 ? amount : 0;
    },
    monthsDifference() {
      if (this.goal) {
        return moment(this.goal.enddate).diff(moment(this.budgetDate), 'month', true) + 1;
      }
    },
    category() {
      return this.selectedCategories[0];
    },
    budgetedCurrencyClass() {
      return {
        positive: this.category.budgeted > 0,
        negative: this.category.budgeted < 0,
        zero: Number(this.category.budgeted) === 0
      };
    },
    activityCurrencyClass() {
      return {
        positive: this.category.activity > 0,
        negative: this.category.activity < 0,
        notxns: Number(this.category.activity) === 0
      };
    },
    availableCurrencyClass() {
      return {
        positive: this.category.available > 0,
        negative: this.category.available < 0,
        zero: Number(this.category.available) === 0 && !(this.amountToStayOnTrack > Number(this.category.budgeted)),
        cautious: this.amountToStayOnTrack && this.amountToStayOnTrack > Number(this.category.budgeted)
      };
    },
    modalNameEditCategory() {
      return `edit-cat-${this.category.category_id}`;
    }
  },
  watch: {
    category: async function () {
      this.isEdit = false;
      this.showAddGoalVisibility = false;
      const reponse = await HTTP.get(`/api/budgets/budgetedlastmonth/${this.budgetDate}/${this.category.category_id}`);
      this.budgetedLastMonth = reponse.data.budgetedlastmonth;
      this.$store.dispatch('getGoals', { categoryid: this.category.category_id });
    }
  },
  methods: {
    showAddGoal() {
      this.showAddGoalVisibility = true;
    },
    hideAddGoal() {
      this.showAddGoalVisibility = false;
      this.isEdit = false;
    },
    triggerEdit() {
      this.isEdit = true;
    },
    editCategory() {
      this.$modal.show(this.modalNameEditCategory);
    },
    async setBudgetedLastMonth(amount) {
      await HTTP.post(`/api/categoriesbudgeted/lastmonth/${this.category.category_id}/${this.budgetDate}`, { amount });
      await this.getBudget();
      let category = {};
      this.budgetList.forEach(e => {
        e.items.forEach(c => {
          if (c.category_id === this.category.category_id) {
            category = c;
          }
        });
      });
      this.$store.dispatch('removeAllSelectedCategories');
      this.$store.dispatch('addSelectedCategory', category);
    },
    async getBudget() {
      try {
        this.$store.dispatch('getToBeBudgeted', this.budgetDate);
        await this.$store.dispatch('getBudgetList', this.budgetDate);
      } catch (error) {
        this.$toasted.error('There was an error getting the budget list.');
      }
    }
  },
  async created() {
    const reponse = await HTTP.get(`/api/budgets/budgetedlastmonth/${this.budgetDate}/${this.category.category_id}`);
    this.budgetedLastMonth = reponse.data.budgetedlastmonth;
    this.$store.dispatch('getGoals', { categoryid: this.category.category_id });
  }
};
</script>

<style scoped>
  .pt-15 {
    padding-top: 1.5px;
  }
</style>
