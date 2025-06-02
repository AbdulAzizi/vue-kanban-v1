<script lang="ts" setup>
    import type { KanbanColumnType } from '../types/kanbanTypes';
    import KanbanCard from './KanbanCard.vue';
    import { useDragStore } from '@/stores/drag';
    import { useCardsStore } from '@/stores/cards';
    
    const props = defineProps<{
        column: KanbanColumnType,
        disabled: boolean,
    }>();
    
    const emit = defineEmits<{
        (e: 'reorder-column', column: KanbanColumnType): void
    }>();
    
    const dragStore = useDragStore();
    const cardsStore = useCardsStore();
    const cards = cardsStore.getCardsForColumn(props.column.id)

    const ondragstart = (event: DragEvent) => {
        if (props.disabled) return;

        if (event.dataTransfer) {
            event.dataTransfer.effectAllowed = 'move';
            event.dataTransfer.dropEffect = 'move';
        }

        dragStore.startDrag('column', props.column);

        (event.target as HTMLElement).classList.add('dragging');
    };

    const ondragover = () => {
        if (props.disabled) return;

        if (dragStore.dragType === 'column') {
            emit('reorder-column', props.column);
        }
        if (dragStore.dragType === 'card' && dragStore.dragData) {
            cardsStore.changeCardColumn(props.column.id, dragStore.dragData.id);
        }
    };

    const ondragend = (event: DragEvent) => {
        if (props.disabled) return;

        dragStore.clearDrag();

        const target = event.target as HTMLElement | null;
        
        if (target) {
            target.classList.remove('dragging');
        }
    };
</script>

<template>
  <section 
    class="kanban-column" 
    :aria-label="props.column.title"
    @dragend="ondragend"
    @dragover.prevent="ondragover"
    @dragstart="ondragstart"
    :draggable="!disabled"
  >
    <header class="kanban-column-title">{{ props.column.title }}</header>
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
    </ul>
  </section>
</template>


<style>
.kanban-column {
    flex: 0 0 auto;
    width: 448px;
    background-color: var(--color-column-background);
    border-radius: 12px;
    padding: 16px;
    cursor: grab;
}

.kanban-column.dragging {
    opacity: 0.7;
    background-color: var(--vt-c-grey-bright-trasparent);
}

.kanban-column-title {
    text-transform: uppercase;
    font-size: 13px;
    color: var(--vt-c-black-03);
}

.kanban-cards-container {
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow-y: auto;
}

.kanban-card-item {
    list-style: none;
}
</style>