import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { KanbanColumnType } from '@/types/kanbanTypes';
import { useDragStore } from './drag';

export const useColumnsStore = defineStore('columns', () => {
    const dragStore = useDragStore();

    const columns = ref<KanbanColumnType[]>([
        { id: crypto.randomUUID(), title: 'Todo' },
        { id: crypto.randomUUID(), title: 'In progress' },
        { id: crypto.randomUUID(), title: 'Done' }
    ]);

    const getRelativeTime = (date?: Date | null): string => {
        if (!date) return '';
        const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
        if (seconds < 60) return 'Last edit just now';
        if (seconds < 3600) return `Last edit ${Math.floor(seconds / 60)} min ago`;
        if (seconds < 86400) return `Last edit ${Math.floor(seconds / 3600)} hour ago`;
        return `Last edit ${Math.floor(seconds / 86400)} day ago`;
    };

    const reorderColumns = (hoveredColumn: KanbanColumnType) => {
        if (!dragStore.dragData || dragStore.dragData.id === hoveredColumn.id) return;
        const fromIndex = columns.value.findIndex(col => col.id === dragStore.dragData!.id);
        const toIndex = columns.value.findIndex(col => col.id === hoveredColumn.id);

        if (fromIndex === -1 || toIndex === -1) return;

        const [movedColumn] = columns.value.splice(fromIndex, 1);
        columns.value.splice(toIndex, 0, { ...movedColumn, editedAt: new Date() });     
    };

    const shuffleColumns = () => {
        for (let i = columns.value.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [columns.value[i], columns.value[j]] = [columns.value[j], columns.value[i]];
        }
        columns.value.forEach(col => {
            col.editedAt = new Date();
        });
    };

    const addColumn = (title: string) => {
        columns.value.push({
            id: crypto.randomUUID(),
            title,
            editedAt: new Date(),
        });
    };

    const deleteColumn = (columnId: string) => {
        const index = columns.value.findIndex(col => col.id === columnId);
        if (index !== -1) {
            columns.value.splice(index, 1);
        }
    };

    const renameColumn = (columnId: string, newTitle: string) =>{
        const column = columns.value.find(c => c.id === columnId);
        if (column) {
            column.title = newTitle.trim();
            column.editedAt = new Date();
        }
    }

    return {
        getRelativeTime,
        columns,
        reorderColumns,
        shuffleColumns,
        addColumn,
        deleteColumn,
        renameColumn,
    };
}, {
    persist: true,
});
