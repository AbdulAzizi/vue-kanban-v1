<script lang="ts" setup>
    import type { KanbanCardType } from '../types/kanbanTypes';
    import { useDragStore } from '@/stores/drag';

    const props = defineProps<{
        card: KanbanCardType,
        disabled: boolean,
    }>();

    const emit = defineEmits<{
        (e: 'reorder-card', card: KanbanCardType): void
    }>();

    const dragStore = useDragStore();

    const ondragstart = (event: DragEvent) => {
        if (props.disabled) return;

        if (event.dataTransfer) {
            event.dataTransfer.effectAllowed = 'move';
            event.dataTransfer.dropEffect = 'move';
        }

        dragStore.startDrag('card', props.card);

        (event.target as HTMLElement).classList.add('dragging');
    };

    const ondragover = () => {
        if (props.disabled) return;

        if (dragStore.dragType === 'card') {
            emit('reorder-card', props.card);
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
  <article 
    class="kanban-card" 
    :aria-label="props.card.title"
    @dragend="ondragend"
    @dragover.prevent="ondragover"
    @dragstart.stop="ondragstart"
    :draggable="!disabled"
  >
    <h5 class="kanban-card-title">{{ props.card.title }} ({{ props.card.order }})</h5>
    <p class="kanban-card-description">{{ props.card.description }}</p>
  </article>
</template>

<style scoped>
.kanban-card {
    margin-top: 8px;
    padding: 16px;
    background-color: var(--color-background);
    border-radius: 8px;
}

.kanban-card .kanban-card-title {
    font-weight: 600;
    margin: 0;
}

.kanban-card .kanban-card-description {
    font-size: 14px;;
    color: var(--vt-c-black-03);
    margin: 8px 0 0 0;
}

.kanban-card.dragging {
    opacity: 0.5;
    cursor: grabbing;
}
</style>