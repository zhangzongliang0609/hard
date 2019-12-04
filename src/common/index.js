

import selInput from './selectionInput';
import select from './select.vue';

const selection = {
    install (Vue) {
        Vue.component('p-input', selInput);
        Vue.component('p-sel', select);
    }
};
export default selection;
