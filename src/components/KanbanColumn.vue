<script lang="ts" setup>
    import type { 
        KanbanColumnType, 
        KanbanCardType 
    } from '../types/kanbanTypes';

    const props = defineProps<{
        column: KanbanColumnType,
        cards: KanbanCardType[],
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
  <section 
    class="kanban-column" 
    :aria-label="props.column.title"
    @dragend="ondragend"
    @dragover.prevent="ondragover"
    @dragstart="ondragstart"
    :draggable="true"
  >
    <header class="kanban-column-title">{{ props.column.title }}</header>
    <ul class="kanban-cards-container">
        <li class="kanban-card-item" v-for="card in cards" :key="card.id">
            <article class="kanban-card">
                <h5 class="kanban-card-title">{{ card.title }}</h5>
                <p class="kanban-card-description">{{ card.description }}</p>
            </article>
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

.kanban-column-title {
    text-transform: uppercase;
    font-size: 13px;
    color: var(--vt-c-black-03);
}

.dragging {
    opacity: 0.7;
    background-color: var(--vt-c-grey-bright-trasparent);
}

.kanban-cards-container {
    margin: 0;
    padding: 0;
}

.kanban-card-item {
    list-style: none;
}

.kanban-card-item .kanban-card{
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
</style>