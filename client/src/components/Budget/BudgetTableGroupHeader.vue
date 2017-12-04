<template>
  <div>
    <ul class="budget-table-row is-master-category">
      <li class="budget-table-cell-checkbox is-draggable">
          <div class="ynab-checkbox">
            <button role="checkbox" class="ynab-checkbox-button">
                <div class="flaticon stroke ynab-checkbox-button-square"></div>
            </button>
          </div>
      </li>
      <li class="budget-table-cell-name">
          <div class="budget-table-cell-name-static-width">
            <button @click="toggleCollapse()"
                    class="fa button flaticon stroke down"
                    :class="[ isCollapsed ? 'fa-caret-right collapse-margin-right' : 'fa-caret-down collapse-margin-down']"></button>
          </div>
          <div class="budget-table-cell-name-row-label-item" @click="editCategoryGroup()">
            <div class="button budget-table-cell-button budget-table-cell-edit-category">{{ header.categorygroup_name }}</div>
          </div>
          <div class="budget-table-cell-name-static-width">
            <div @click="addCategory()" title="Add Category" class="button budget-table-cell-add-category budget-table-cell-button ">
                <i class="fa fa-plus-circle flaticon"></i>
            </div>
          </div>
      </li>
      <li class="budget-table-cell-budgeted">
          <div><span class="currency">{{ header.budgeted | currency }}</span></div>
      </li>
      <li class="budget-table-cell-activity">
          <div class="budget-number"><span class="currency">{{ header.activity | currency }}</span></div>
      </li>
      <li class="budget-table-cell-available">
          <div class="budget-table-cell-available-div"><span class="currency">{{ header.available | currency }}</span></div>
      </li>
    </ul>

    <modal-add-category :name="modalNameAddCategory" :categorygroupid="header.categorygroup_id"></modal-add-category>
    <modal-edit-category-group :name="modalNameEditCategoryGroup" :categorygroupid="header.categorygroup_id"></modal-edit-category-group>
  </div>
</template>

<script>
import ModalEditCategoryGroup from './ModalEditCategoryGroup';
import ModalAddCategory from './ModalAddCategory';

export default {
  components: {
    ModalEditCategoryGroup,
    ModalAddCategory
  },
  props: [
    'header'
  ],
  data() {
    return {
      isCollapsed: false
    };
  },
  computed: {
    modalNameEditCategoryGroup() {
      return `edit-catgroup-${this.header.categorygroup_id}`;
    },
    modalNameAddCategory() {
      return `add-cat-${this.header.categorygroup_id}`;
    }
  },
  methods: {
    toggleCollapse() {
      this.isCollapsed = !this.isCollapsed;
      this.$emit('collapse');
    },
    editCategoryGroup() {
      this.$modal.show(this.modalNameEditCategoryGroup);
    },
    addCategory() {
      this.$modal.show(this.modalNameAddCategory);
    }
  }
};
</script>

