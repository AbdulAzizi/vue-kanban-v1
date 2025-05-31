<script lang="ts" setup>
    import type { KanbanColumnType } from '../types/kanbanTypes';

    const props = defineProps<{
        column: KanbanColumnType
    }>();

    const emit = defineEmits<{
        (e: 'drag-start', column: KanbanColumnType): void
        (e: 'reorder', column: KanbanColumnType): void
    }>();

    const ondragstart = (event: DragEvent) => {
        if (event.dataTransfer) {
            event.dataTransfer.effectAllowed = 'move';
            event.dataTransfer.dropEffect = 'move';
        }

        (event.target as HTMLElement).classList.add('dragging');
        emit('drag-start', props.column);
    };

    const ondragover = () => {
        emit('reorder', props.column);
    };

    const ondragend = (event: DragEvent) => {
        const target = event.target as HTMLElement | null;
        
        if (target) {
            target.classList.remove('dragging');
        }
    };
</script>

<template>
  <article 
    class="kanban-column" 
    :aria-label="props.column.title"
    @dragend="ondragend"
    @dragover.prevent="ondragover"
    @dragstart="ondragstart"
    :draggable="true"
  >
    <span class="kanban-column-title">{{ props.column.title }}</span>
  </article>
</template>


<style scoped>
.kanban-column {
    flex: 0 0 auto;
    width: 448px;
    background-color: var(--color-column-background);
    border-radius: 12px;
    padding: 16px;
    cursor: grab;
}

.kanban-column-title {
    text-transform: uppercase;
    font-size: 13px;
    color: var(--vt-c-black-03);
}

.dragging {
    opacity: 0.7;
    background-color: var(--vt-c-grey-bright-trasparent);
}
</style>