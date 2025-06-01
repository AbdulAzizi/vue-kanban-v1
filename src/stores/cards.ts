import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { useColumnsStore } from './columns';
import type { KanbanCardType } from '@/types/kanbanTypes';

export const useCardsStore = defineStore('cards', () => {
    const { columns } = useColumnsStore();
    const cards = ref<KanbanCardType[]>([]);

    columns.forEach((column, index) => {
        for (let i = 1; i <= 3; i++) {
            cards.value.push({
                columnId: column.id,
                id: crypto.randomUUID(),
                title: `Card in ${column.title} - ${i}`,
                description: 
                `Description for card in ${column.title} - ${i}
                Order: ${(index * 3) + i}`,
                order: (index * 3) + i,
            });
        }
    });

    const getCardsForColumn = (columnId: string) =>
        computed(() => cards.value.filter(card => card.columnId === columnId));

    return {
        cards,
        getCardsForColumn,
    }
});