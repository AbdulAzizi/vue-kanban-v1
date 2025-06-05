import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { useColumnsStore } from './columns';
import type { KanbanCardType } from '@/types/kanbanTypes';
import { useDragStore } from './drag';

export const useCardsStore = defineStore('cards', () => {
    const columnsStore = useColumnsStore();
    const cards = ref<KanbanCardType[]>([]);

    const dragStore = useDragStore();

    columnsStore.columns.forEach((column) => {
        for (let i = 1; i <= 3; i++) {
            cards.value.push({
                columnId: column.id,
                id: crypto.randomUUID(),
                title: `Card in ${column.title} - ${i}`,
                description: `Description for card in ${column.title} - ${i}`
            });
        }
    });

    const getCardsForColumn = (columnId: string) =>
        computed(() => cards.value.filter(card => card.columnId === columnId));

    const swapCards = (hoveredCard: KanbanCardType) => {
        const dragData = dragStore.dragData;
        if (!dragData || dragData.id === hoveredCard.id) return;

        const fromIndex = cards.value.findIndex(card => card.id === dragData.id);
        const toIndex = cards.value.findIndex(card => card.id === hoveredCard.id);

        if (fromIndex === -1 || toIndex === -1) return;

        const [movedColumn] = cards.value.splice(fromIndex, 1);
        cards.value.splice(toIndex, 0, movedColumn);
    };

    const updateCard = (cardId: string, updatedCard: Partial<KanbanCardType>) => {
        const card = cards.value.find(c => c.id === cardId);
        if (card) {
            Object.assign(card, updatedCard);
        }
    };

    const shuffleCards = () => {
        const columnIds = columnsStore.columns.map(col => col.id);
        cards.value.forEach(card => {
            card.columnId = columnIds[Math.floor(Math.random() * columnIds.length)];
        });
    };

    const addCard = ({ columnId, title, description }: { columnId: string; title: string; description: string }) => {
        const newCard: KanbanCardType = {
            columnId,
            id: crypto.randomUUID(),
            title,
            description
        };
        cards.value.push(newCard);
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
      };
      

    const deleteCardsByColumnId = (columnId: string) => {
        const remaining = cards.value.filter(card => card.columnId !== columnId);
        cards.value.splice(0, cards.value.length, ...remaining);
    };


    const deleteCardById = (cardId: string) => {
        const index = cards.value.findIndex(card => card.id === cardId);
        if (index !== -1) {
            cards.value.splice(index, 1);
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
});