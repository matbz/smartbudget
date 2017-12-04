import Vue from 'vue';

Vue.filter('currency', value => Number(value).toLocaleString(undefined, { minimumFractionDigits: 2 }) + '€');
