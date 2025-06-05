import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { KanbanCardType, KanbanColumnType } from '@/types/kanbanTypes';

export const useDragStore = defineStore('drag', () => {
    const dragType = ref<null | 'column' | 'card'>(null);
    const dragData = ref<null | KanbanColumnType | KanbanCardType>(null);

    function startDrag(type: 'column' | 'card', data: KanbanColumnType | KanbanCardType) {
        dragType.value = type;
        dragData.value = data;
    }

    function clearDrag() {
        dragType.value = null;
        dragData.value = null;
    }

    return {
        dragType,
        dragData,
        startDrag,
        clearDrag,
    };
}, {
    persist: true,
});
