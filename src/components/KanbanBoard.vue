<script lang="ts" setup>
    import { ref } from 'vue';
    import KanbanColumn from './KanbanColumn.vue';
    import KanbanColumnForm from './KanbanColumnForm.vue';
    import { useColumnsStore } from '@/stores/columns';
    import { useCardsStore } from '@/stores/cards';
    import { useUIStore } from '@/stores/ui';
    import BaseButton from './BaseButton.vue';

    const displayColumnForm = ref(false);

    const columnsStore = useColumnsStore();
    const cardsStore = useCardsStore();
    const uiStore = useUIStore();
    
    const handleAddColumn = (title: string) => {
        columnsStore.addColumn(title);
        displayColumnForm.value = false;
    };
</script>

<template>
    <div class="kanban-container">
        <section
        class="kanban-columns"
        aria-label="Kanban Board">
            <KanbanColumn 
                v-for="column in columnsStore.columns" 
                :key="column.id" 
                :column="column"
                @reorder-column="columnsStore.reorderColumns"
                :disabled="uiStore.readonly" 
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
                    <BaseButton
                    :disabled="uiStore.readonly"
                    @click="displayColumnForm = true" 
                    icon="plus">
                        New Column
                    </BaseButton>

                    <BaseButton
                    :disabled="uiStore.readonly" 
                    @click="columnsStore.shuffleColumns" 
                    icon="shuffle">
                        Shuffle Columns
                    </BaseButton>

                    <BaseButton
                    :disabled="uiStore.readonly"
                    @click="cardsStore.shuffleCards" 
                    icon="shuffle">
                        Shuffle Cards
                    </BaseButton>

                    <BaseButton
                    @click="uiStore.toggleReadonly" 
                    :icon="uiStore.readonly ? 'play' : 'pause'">
                        {{ uiStore.readonly ? 'Unlock Editing' : 'Disable Editing'}}
                    </BaseButton>
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
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

.kanban-columns {
    flex: 1;
    display: flex;
    gap: 24px;
    padding: 24px 24px 0px 24px;
    justify-content: flex-start;
    align-items: stretch;
    overflow-x: auto;
}

.kanban-columns::-webkit-scrollbar {
    height: 8px;
}

.kanban-columns::-webkit-scrollbar-thumb {
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


.kanban-footer .base-button {
    margin: 0 4px;
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