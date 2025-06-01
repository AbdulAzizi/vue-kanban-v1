import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { KanbanColumnType } from '@/types/kanbanTypes';
import { useDragStore } from './dragStore';

export const useColumnsStore = defineStore('columns', () => {
    const dragStore = useDragStore();

    const columns = ref<KanbanColumnType[]>([
        { id: crypto.randomUUID(), title: 'Todo', order: 1 },
        { id: crypto.randomUUID(), title: 'In progress', order: 2 },
        { id: crypto.randomUUID(), title: 'Done', order: 3 },
        { id: crypto.randomUUID(), title: 'Backlog', order: 4 },
        { id: crypto.randomUUID(), title: 'Archive', order: 5 },
    ]);

    const reorderColumns = (hoveredColumn: KanbanColumnType) => {
        if (!dragStore.dragData || dragStore.dragData.id === hoveredColumn.id) return;

        const from = dragStore.dragData;
        const to = hoveredColumn;

        const temp = from.order;
        from.order = to.order;
        to.order = temp;
    };

    const shuffleColumns = () => {
        const orders = columns.value.map(col => col.order);
        for (let i = orders.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [orders[i], orders[j]] = [orders[j], orders[i]];
        }
        columns.value.forEach((col, i) => {
            col.order = orders[i];
        });
    };

    const addColumn = (title: string) => {
        const maxOrder = Math.max(...columns.value.map(c => c.order), 0);
        columns.value.push({
            id: crypto.randomUUID(),
            title,
            order: maxOrder + 1,
        });
    };

    return {
        columns,
        reorderColumns,
        shuffleColumns,
        addColumn,
    };
});
