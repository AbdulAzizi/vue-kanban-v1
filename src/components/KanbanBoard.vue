<script lang="ts" setup>
    import { ref } from 'vue';
    import KanbanColumn from './KanbanColumn.vue';
    import KanbanColumnForm from './KanbanColumnForm.vue';
    import { useColumnsStore } from '@/stores/columns';

    const {
        columns,
        setDraggedColumn,
        reorderColumns,
        shuffleColumns,
        addColumn,
    } = useColumnsStore();

    const displayColumnForm = ref(false);
    
    const handleAddColumn = (title: string) => {
        addColumn(title);
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
                @save="handleAddColumn"
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