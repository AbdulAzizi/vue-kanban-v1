<script lang="ts" setup>
    import { ref, watch } from 'vue';
    import type { KanbanColumnType } from '../types/kanbanTypes';
    import KanbanCard from './KanbanCard.vue';
    import { useDragStore } from '@/stores/drag';
    import { useCardsStore } from '@/stores/cards';
    import BaseButton from './BaseButton.vue';
    
    const props = defineProps<{
        column: KanbanColumnType,
        disabled: boolean,
    }>();
    
    const emit = defineEmits<{
        (e: 'reorder-column', column: KanbanColumnType): void
    }>();
    
    const disabled = ref(props.disabled);
    const ascending = ref(true);

    watch(() => props.disabled, (newVal) => {
        disabled.value = newVal;
    });

    const dragStore = useDragStore();
    const cardsStore = useCardsStore();
    const cards = cardsStore.getCardsForColumn(props.column.id)

    const ondragstart = (event: DragEvent) => {
        if (disabled.value) return;

        if (event.dataTransfer) {
            event.dataTransfer.effectAllowed = 'move';
            event.dataTransfer.dropEffect = 'move';
        }

        dragStore.startDrag('column', props.column);

        (event.target as HTMLElement).classList.add('dragging');
    };

    const ondragover = () => {
        if (disabled.value) return;

        if (dragStore.dragType === 'column') {
            emit('reorder-column', props.column);
        }
        if (dragStore.dragType === 'card' && dragStore.dragData) {
            cardsStore.changeCardColumn(props.column.id, dragStore.dragData.id);
        }
    };

    const ondragend = (event: DragEvent) => {
        if (disabled.value) return;

        dragStore.clearDrag();

        const target = event.target as HTMLElement | null;
        
        if (target) {
            target.classList.remove('dragging');
        }
    };

    const handleNewCard = () => {
        cardsStore.addCard({
            title: 'Add title',
            description: 'Add description',
            columnId: props.column.id
        });
    };

    const handleSortCardsByTitle = () => {
        ascending.value = !ascending.value;
        cardsStore.sortCardsByTitle(props.column.id, ascending.value);
    };
</script>

<template>
  <section 
    class="kanban-column"
    :class="{ disabled }"
    :aria-label="props.column.title"
    @dragend="ondragend"
    @dragover.prevent="ondragover"
    @dragstart="ondragstart"
    :draggable="!disabled"
  >
    <header class="kanban-column-title kanban-column-header">
        <h2 class="kanban-column-heading">
            {{ props.column.title }}
            <span v-if="cards.length" aria-label="Number of cards">{{ cards.length }}</span>
        </h2>
        <nav class="kanban-column-nav">
            <BaseButton
                @click="disabled = !disabled" 
                :icon="disabled ? 'play' : 'pause'"
                :aria-pressed="disabled"
            >
                {{ disabled ? 'Unlock Editing' : 'Disable Editing' }}
            </BaseButton>
        </nav>
    </header>
    <ul class="kanban-cards-container">
        <li class="kanban-card-item" 
            v-for="card in cards" 
            :key="card.id" 
            :style="{ order: card.order }">
                <KanbanCard 
                    :card="card"
                    @reorder-card="cardsStore.swapCards"
                    :disabled="disabled"
                />
        </li>
        <li class="kanban-card-item"
            style="order: 99999999;
            margin-top: 8px;">
            <BaseButton
                @click="handleNewCard" 
                icon="plus"
                :aria-pressed="disabled"
                variant="tile"
                color="var(--vt-c-grey)"
                :disabled="disabled"
            >
                New Card
            </BaseButton>
        </li>
    </ul>
    <footer>
        <BaseButton
            @click="handleSortCardsByTitle"
            icon="sort"
            :aria-pressed="disabled"
            :disabled="disabled"
        >
            Sort: {{ ascending ? 'Ascending' : 'Descending' }}
        </BaseButton>
        <BaseButton
            @click="cardsStore.deleteCardsByColumnId(props.column.id)" 
            icon="close"
            :aria-pressed="disabled"
            :disabled="disabled"
        >
            Clear All
        </BaseButton>
    </footer>
  </section>
</template>


<style>
.kanban-column {
    flex: 0 0 auto;
    width: 448px;
    background-color: var(--color-column-background);
    border-radius: 12px;
    padding: 16px;
    display: flex;
    flex-direction: column;
}

.kanban-column.dragging {
    opacity: 0.7;
    background-color: var(--vt-c-grey-bright-trasparent);
}

.kanban-column.disabled {
    background-color: var(--vt-c-grey-bright-2);
}

.kanban-column-heading {
    font-weight: 400;
    text-transform: uppercase;
    font-size: 13px;
    color: var(--vt-c-black-03);
    margin: 0;
}

.kanban-cards-container {
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow-y: auto;
}

.disabled .kanban-cards-container {
    opacity: 0.5;
}

.kanban-card-item {
    list-style: none;
}

.kanban-column-header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
}

.kanban-column footer {
    padding-top: 20px;
    display: flex;
    justify-content: center;
    gap: 4px;
}
</style>