<template>
  <budget-inspector-default v-if="selectedCategories.length === 0"></budget-inspector-default>
  <budget-inspector-category v-else></budget-inspector-category>
</template>

<script>
import { mapGetters } from 'vuex';
import BudgetInspectorDefault from './BudgetInspectorDefault';
import BudgetInspectorCategory from './BudgetInspectorCategory';

export default {
  components: {
    BudgetInspectorDefault,
    BudgetInspectorCategory
  },
  computed: {
    ...mapGetters([
      'selectedCategories'
    ])
  }
};
</script>

