<script lang="ts" setup>
    import type { KanbanColumnType } from '../types/kanbanTypes';
    const props = defineProps<{ column: KanbanColumnType }>();
</script>

<template>
    <article class="kanban-column" :aria-label="props.column.title">
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
    box-sizing: border-box;
}

.kanban-column-title {
    text-transform: uppercase;
    font-size: 13px;
    color: var(--vt-c-black-03);
}
</style>