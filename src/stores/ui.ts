import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUIStore = defineStore('ui', () => {
    const readonly = ref(false);

    const toggleReadonly = () => {
        readonly.value = !readonly.value;
    };

    return {
        readonly,
        toggleReadonly,
    };
}, {
    persist: true,
});
