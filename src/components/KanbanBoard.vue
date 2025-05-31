<script lang="ts" setup>
    import KanbanColumn from './KanbanColumn.vue';
    import type { KanbanColumnType } from '../types/kanbanTypes';
    
    const props = defineProps<{ columns: KanbanColumnType[] }>();
</script>

<template>
    <div class="kanban-container">
        <section class="kabnban-columns" aria-label="Kanban Board">
            <KanbanColumn 
                v-for="column in props.columns" 
                :column="column"
                :key="column.id" 
            />
        </section>
        <footer class="kanban-footer">
            <div class="kanban-actions">
                <div class="buttons-row">
                    <button type="button">New Column</button>
                    <button type="button">Shuffle Columns</button>
                    <button type="button">Shuffle Cards</button>
                    <button type="button">Disable Editing</button>
                </div>
                <div class="label">Board Actions</div>
            </div>
        </footer>
    </div> 
</template>

<style scoped>
.kanban-container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    box-sizing: border-box;
}
.kabnban-columns {
    flex: 1;
    display: flex;
    gap: 24px;
    padding: 24px 24px 0px 24px;
    justify-content: flex-start;
    align-items: stretch;
    overflow-x: auto;
}
.kabnban-columns::-webkit-scrollbar {
    height: 8px;
}

.kabnban-columns::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
}
.kanban-footer {
    padding: 24px 0;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;
    background: linear-gradient(var(--vt-c-white), var(--vt-c-grey-bright));
}

.kanban-footer button {
    height: 24px;
    padding: 0 12px;
    margin: 0 4px;
    font-size: 13px;
    background-color: var(--color-button-light);
    border-radius: 16px;
    border: 2px solid var(--vt-c-black-005);
    cursor: pointer;
    transition: background-color 0.2s;
}

.kanban-footer button:hover {
    border-color: transparent;
    background-color: var(--vt-c-black-005);
}

.kanban-actions {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
}

.kanban-actions .label {
    font-size: 14px;
    background: linear-gradient(var(--vt-c-black-03), var(--vt-c-black-015));
    -webkit-background-clip: text;
            background-clip: text;
    -webkit-text-fill-color: transparent;
}
</style>