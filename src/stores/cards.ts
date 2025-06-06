import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { useColumnsStore } from './columns';
import type { KanbanCardType } from '@/types/kanbanTypes';
import { useDragStore } from './drag';

export const useCardsStore = defineStore('cards', () => {
    const columnsStore = useColumnsStore();
    const cards = ref<KanbanCardType[]>([]);

    const dragStore = useDragStore();

    const getCardsForColumn = (columnId: string) =>
        computed(() => cards.value.filter(card => card.columnId === columnId));

    const swapCards = (hoveredCard: KanbanCardType) => {
        const dragData = dragStore.dragData;
        if (!dragData || dragData.id === hoveredCard.id) return;

        const fromIndex = cards.value.findIndex(card => card.id === dragData.id);
        const toIndex = cards.value.findIndex(card => card.id === hoveredCard.id);

        if (fromIndex === -1 || toIndex === -1) return;

        const [movedCard] = cards.value.splice(fromIndex, 1);
        cards.value.splice(toIndex, 0, movedCard);

        const originalCard = cards.value.find(card => card.id === dragData.id);
        if (originalCard && movedCard.columnId !== hoveredCard.columnId) {
            movedCard.columnId = hoveredCard.columnId;
        }

        const fromColumn = columnsStore.columns.find(col => col.id === originalCard?.columnId);
        const toColumn = columnsStore.columns.find(col => col.id === hoveredCard.columnId);

        const now = new Date();
        if (fromColumn) fromColumn.editedAt = now;
        if (toColumn && toColumn !== fromColumn) toColumn.editedAt = now;
    };

    const updateCard = (cardId: string, updatedCard: Partial<KanbanCardType>) => {
        const card = cards.value.find(c => c.id === cardId);
        if (card) {
            Object.assign(card, updatedCard);
        }
    };

    const shuffleCards = () => {
        for (let i = cards.value.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cards.value[i], cards.value[j]] = [cards.value[j], cards.value[i]];
        }

        const now = new Date();
        columnsStore.columns.forEach(col => {
            col.editedAt = now;
        });
    };

    const addCard = (newCard: KanbanCardType) => {
        cards.value.push(newCard);
        const column = columnsStore.columns.find(col => col.id === newCard.columnId);
        if (column) column.editedAt = new Date();
    };

    const sortCardsByTitle = (columnId: string, ascending = true) => {
        const sorted = cards.value
          .filter(c => c.columnId === columnId)
          .sort((a, b) => {
                const titleA = a.title.toLowerCase();
                const titleB = b.title.toLowerCase();
                return ascending
                    ? titleA.localeCompare(titleB)
                    : titleB.localeCompare(titleA);
          });

        let idx = 0;
        for (let i = 0; i < cards.value.length; i++) {
            if (cards.value[i].columnId === columnId) {
                cards.value[i] = sorted[idx++];
            }
        }

        const column = columnsStore.columns.find(col => col.id === columnId);
        if (column) column.editedAt = new Date();
      };
      

    const deleteCardsByColumnId = (columnId: string) => {
        const remaining = cards.value.filter(card => card.columnId !== columnId);
        cards.value.splice(0, cards.value.length, ...remaining);

        const column = columnsStore.columns.find(col => col.id === columnId);
        if (column) column.editedAt = new Date();
    };


    const deleteCardById = (cardId: string) => {
        const index = cards.value.findIndex(card => card.id === cardId);
        if (index !== -1) {
            const card = cards.value[index];
            cards.value.splice(index, 1);

            const column = columnsStore.columns.find(col => col.id === card.columnId);
            if (column) column.editedAt = new Date();
        }
    };

    return {
        addCard,
        updateCard,
        cards,
        getCardsForColumn,
        swapCards,
        shuffleCards,
        sortCardsByTitle,
        deleteCardsByColumnId,
        deleteCardById,
    }
}, {
    persist: true,
});