<template>
  <tr>
    <td class="reports-inspector-table-color">
      <svg class="reports-inspector-color-dot" style="width: 16px; height: 16px;" :style="{ fill: color }">
        <circle cx="8" cy="8" r="8"></circle>
      </svg>
    </td>
    <td class="reports-inspector-table-name">
      <button>
      <span>{{ name }}</span>
      </button>
    </td>
    <td class="reports-inspector-table-value">
      <span class="currency positive">{{ amount | currency }}</span>
    </td>
  </tr>
</template>

<script>
export default {
  props: [
    'name',
    'amount',
    'color'
  ],
  computed: {

  },
};
</script>
