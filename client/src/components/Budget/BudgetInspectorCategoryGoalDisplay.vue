<template>
  <div class="budget-inspector-goals">
    <h3>Goal</h3>
    <div class="goal-progress-container">
      <div class="goal-progress-flexbox">
          <div class="goal-progress-label-container">
            <span class="label">Budgeted</span><br>
            <span class="figure"><span class="currency positive">{{ category.budgeted | currency }}</span></span>
          </div>
          <div class="goal-progress-chart">
            <div class="c100" :class="[percentClass, progressColor]">
              <span v-if="progressPercent < 100" class="number">{{ progressPercent }}</span>
              <span v-if="progressPercent < 100" class="percent">%</span>
              <span v-if="progressPercent < 100" class="complete">Complete</span>
              <i v-if="progressPercent >= 100" class="fa fa-check"></i>
              <div class="slice">
                <div class="bar"></div>
                <div class="fill"></div>
              </div>
            </div>
          </div>
          <div class="goal-progress-label-container right">
            <span class="label">To go</span><br>
            <span class="figure"><span class="currency positive">{{ goalAmountLeft | currency }}</span></span>
          </div>
      </div>
      <button class="button link-button edit-goal" @click="editGoal()">
        Edit
      </button>
    </div>
    <div v-if="goal.enddate && !isOnTrack && goalAmountLeft > 0" class="goal-message">
      Budget {{ amountToStayOnTrack | currency }} more to stay on track towards reaching your {{ goal.amount | currency }} goal.
    </div>
    <div v-if="goal.enddate && isOnTrack && goalAmountLeft > 0" class="goal-message">
      You're on track to reach your {{ goal.amount | currency }} goal by {{ monthsOfDate }} of {{ yearOfDate }}.
    </div>    
    <div v-if="!goal.enddate && category.budgeted > 0 && goalAmountLeft > 0" class="goal-message">
      If you budget {{ category.budgeted | currency }} each month, you will reach your {{ goal.amount | currency }} goal in {{ monthsToAchieveGoalWithoutTarget }} months.
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import moment from 'moment';

export default {
  computed: {
    ...mapGetters([
      'budgetDate',
      'goals',
      'selectedCategories'
    ]),
    monthsOfDate() {
      return moment(this.goal.enddate).format('MMMM');
    },
    yearOfDate() {
      return moment(this.goal.enddate).format('YYYY');
    },
    goal() {
      return this.goals[0];
    },
    goalAmountLeft() {
      const amount = this.goal.amount - this.category.available;
      return amount < 0 ? 0 : amount;
    },
    category() {
      return this.selectedCategories[0];
    },
    monthsToAchieveGoalWithoutTarget() {
      return Math.round(Number(this.goalAmountLeft) / Number(this.category.budgeted));
    },
    monthsDifference() {
      return moment(this.goal.enddate).diff(moment(this.budgetDate), 'month', true) + 1;
    },
    isOnTrack() {
      return this.amountToStayOnTrack <= 0;
    },
    amountToStayOnTrack() {
      return Number((this.goalAmountLeft + Number(this.category.budgeted)) / this.monthsDifference).toFixed(2) - Number(this.category.budgeted);
    },
    progressColor() {
      if (this.goal.enddate && !this.isOnTrack) {
        return 'orange';
      }
      return 'green';
    },
    progressPercent() {
      const percent = Math.floor((Number(this.goal.amount) - this.goalAmountLeft) / Number(this.goal.amount) * 100);
      if (percent < 0) {
        return 0;
      }

      if (percent > 100) {
        return 100;
      }
      return percent;
    },
    percentClass() {
      return `p${this.progressPercent}`;
    }
  },
  methods: {
    editGoal() {
      this.$emit('edit');
    }
  },
};
</script>

<style scoped>
  button {
    cursor: pointer;
  }
</style>

