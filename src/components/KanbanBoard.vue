<script lang="ts" setup>
    import { reactive, useId, ref } from 'vue';
    import type { KanbanColumnType } from '../types/kanbanTypes';
    import KanbanColumn from './KanbanColumn.vue';
    import KanbanColumnForm from './KanbanColumnForm.vue';

    const columns = reactive<KanbanColumnType[]>([
        { id: useId(), title: 'Todo', order: 1, cards: [] },
        { id: useId(), title: 'In progress', order: 2, cards: [] },
        { id: useId(), title: 'Done', order: 3, cards: [] },
        { id: useId(), title: 'Backlog', order: 4, cards: [] },
        { id: useId(), title: 'Archive', order: 5, cards: [] },
    ]);

    const draggedColumn = ref<KanbanColumnType | null>(null);
    const displayColumnForm = ref(false);

    const setDraggedColumn = (column: KanbanColumnType) => {
        draggedColumn.value = column;
    };

    const reorderColumns = (hoveredColumn: KanbanColumnType) => {
        if (!draggedColumn.value || draggedColumn.value.id === hoveredColumn.id) return;

        const from = draggedColumn.value;
        const to = hoveredColumn;

        const temp = from.order;
        from.order = to.order;
        to.order = temp;
    };

    const shuffleColumns = () => {
        const orders = columns.map(col => col.order);
        for (let i = orders.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [orders[i], orders[j]] = [orders[j], orders[i]];
        }
        columns.forEach((col, i) => {
            col.order = orders[i];
        });
    };

    const addColumn = (title: string) => {
        const maxOrder = Math.max(...columns.map(c => c.order), 0);
        columns.push({
            id: useId(),
            title,
            order: maxOrder + 1,
            cards: [],
        });
        displayColumnForm.value = false;
    };
</script>

<template>
    <div class="kanban-container">
        <section class="kabnban-columns" aria-label="Kanban Board">
            <KanbanColumn 
                v-for="column in columns" 
                :key="column.id" 
                :column="column"
                :style="{ order: column.order }"
                @drag-start="setDraggedColumn"
                @reorder="reorderColumns"
            />
            <KanbanColumnForm
                v-if="displayColumnForm"
                @save="addColumn"
                @cancel="displayColumnForm = false"
            />
        </section>
        
        <footer class="kanban-footer">
            <div class="kanban-actions">
                <div class="buttons-row">
                    <button @click="displayColumnForm = true" type="button" class="button icon-button">
                        <img alt="" src="../assets/plus.svg" class="icon" />
                        <span>New Column</span>
                    </button>
                    <button @click="shuffleColumns" type="button" class="button icon-button">
                        <img alt="" src="../assets/shuffle.svg" class="icon" />
                        <span>Shuffle Columns</span>
                    </button>
                    <button type="button" class="button icon-button">
                        <img alt="" src="../assets/shuffle.svg" class="icon" />
                        <span>Shuffle Cards</span>
                    </button>
                    <button type="button" class="button icon-button">
                        <img alt="" src="../assets/pause.svg" class="icon" />
                        <span>Disable Editing</span>
                    </button>
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

.buttons-row {
    display: flex;
    align-items: center;
}

.kanban-footer .button {
    height: 24px;
    padding: 0 10px;
    margin: 0 4px;
    font-size: 13px;
    background-color: var(--color-button-light);
    border-radius: 16px;
    border: 2px solid var(--vt-c-black-005);
    cursor: pointer;
    transition: background-color 0.2s;
}

.kanban-footer .button:hover {
    border-color: transparent;
    background-color: var(--vt-c-black-005);
}

.kanban-footer .icon-button {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding-left: 4px;
}

.kanban-footer .icon-button .icon {
    width: 16px;
    height: 16px;
    display: inline-block;
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