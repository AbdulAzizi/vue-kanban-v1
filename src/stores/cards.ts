import { computed, reactive } from 'vue';
import { defineStore } from 'pinia';
import { useColumnsStore } from './columns';
import type { KanbanCardType } from '@/types/kanbanTypes';
import { useDragStore } from './drag';

export const useCardsStore = defineStore('cards', () => {
    const { columns } = useColumnsStore();
    const cards = reactive<KanbanCardType[]>([]);

    const dragStore = useDragStore();

    columns.forEach((column, index) => {
        for (let i = 1; i <= 3; i++) {
            cards.push({
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
        computed(() => cards.filter(card => card.columnId === columnId));

    const swapCards = (hoveredCard: KanbanCardType) => {
        const dragData = dragStore.dragData;
        if (!dragData || dragData.id === hoveredCard.id) return;

        const fromCard = cards.find(card => card.id === dragData.id);
        const toCard = cards.find(card => card.id === hoveredCard.id);

        if (!fromCard || !toCard) return;

        if (fromCard.columnId !== toCard.columnId) {
            fromCard.columnId = toCard.columnId;
        }

        const tempOrder = fromCard.order;
        fromCard.order = toCard.order;
        toCard.order = tempOrder;
    };

    const changeCardColumn = (columnId: string, cardId: string) => {
        const card = cards.find(c => c.id === cardId);
        if (card) {
            card.columnId = columnId;
        }
    };

    const shuffleCards = () => {
        const columnIds = columns.map(col => col.id);
        cards.forEach(card => {
            card.columnId = columnIds[Math.floor(Math.random() * columnIds.length)];
        });
    };

    const addCard = ({ columnId, title, description }: { columnId: string; title: string; description: string }) => {
        const newCard: KanbanCardType = {
            columnId,
            id: crypto.randomUUID(),
            title,
            description,
            order: cards.length + 1,
        };
        cards.push(newCard);
    };

    return {
        addCard,
        changeCardColumn,
        cards,
        getCardsForColumn,
        swapCards,
        shuffleCards,
    }
});