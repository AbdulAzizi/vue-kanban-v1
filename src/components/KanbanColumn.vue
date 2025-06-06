<script lang="ts" setup>
    import { ref, watch, onMounted } from 'vue';
    import type { KanbanColumnType } from '../types/kanbanTypes';
    import KanbanCard from './KanbanCard.vue';
    import { useDragStore } from '@/stores/drag';
    import { useCardsStore } from '@/stores/cards';
    import { useColumnsStore } from '@/stores/columns';
    import BaseButton from './BaseButton.vue';
    
    const props = defineProps<{
        column: KanbanColumnType,
        disabled: boolean,
    }>();
    
    const emit = defineEmits<{
        (e: 'reorder-column', column: KanbanColumnType): void
    }>();
    
    const disabled = ref(props.disabled);
    const sortedBy = ref<'Ascending' | 'Descending' | null>();

    const titleEl = ref<HTMLElement | null>(null);
    const draftTitle = ref(props.column.title);

    onMounted(() => {
        if (titleEl.value) {
            titleEl.value.innerText = draftTitle.value;
            titleEl.value.focus();
        }
    });

    watch(() => props.disabled, (newVal) => {
        disabled.value = newVal;
    });

    watch(() => props.column.title, (newVal) => {
        draftTitle.value = newVal;
    });

    const dragStore = useDragStore();
    const cardsStore = useCardsStore();
    const columnsStore = useColumnsStore();
    const cards = cardsStore.getCardsForColumn(props.column.id);

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
            cardsStore.updateCard(dragStore.dragData.id, { columnId: props.column.id });
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
            id: crypto.randomUUID(),
            title: '',
            description: '',
            columnId: props.column.id,
            isEditing: true
        });
    };

    const handleSortCardsByTitle = () => {
        sortedBy.value = sortedBy.value === 'Ascending' ? 'Descending' : 'Ascending';
        cardsStore.sortCardsByTitle(props.column.id, sortedBy.value === 'Ascending');
    };

    const handleColumnDelete = () => {
        cardsStore.deleteCardsByColumnId(props.column.id);
        columnsStore.deleteColumn(props.column.id)
    }

    const onTitleChange = () => {
        if (titleEl.value) {
            draftTitle.value = titleEl.value.innerText;
        }
    };

    const saveTitle = () => {
        if (draftTitle.value !== props.column.title) {
            columnsStore.renameColumn(props.column.id, draftTitle.value.trim());
        }
        titleEl.value?.blur();
    };

    

</script>

<template>
  <section 
    class="kanban-column"
    :class="{ disabled }"
    :aria-label="props.column.title"
    @dragend="ondragend"
    @dragover.prevent.stop="ondragover"
    @dragstart.stop="ondragstart"
    :draggable="!disabled"
  >
    <header class="kanban-column-title kanban-column-header">
        <div class="title-container">
            <h2 
                ref="titleEl"
                class="kanban-column-heading"
                :contenteditable="!disabled"
                spellcheck="false"
                @input="onTitleChange"
                @keydown.enter.prevent="saveTitle"
                data-placeholder="Add Heading"
            />
            <span v-if="cards.length" aria-label="Number of cards">{{ cards.length }}</span>
        </div>
        <nav class="kanban-column-nav">
            <BaseButton
                @click="disabled = !disabled" 
                :icon="disabled ? 'play' : 'pause'"
                :aria-pressed="disabled"
            >
                {{ disabled ? 'Unlock Editing' : 'Disable Editing' }}
            </BaseButton>
            <BaseButton
                @click="handleColumnDelete" 
                icon="minus"
                :aria-pressed="disabled"
                :disabled="disabled"
            >
                Delete Column
            </BaseButton>
        </nav>
    </header>
    <ul class="kanban-cards-container">
        <li class="kanban-card-item" 
            v-for="card in cards" 
            :key="card.id">
                <KanbanCard 
                    :card="card"
                    @reorder-card="cardsStore.swapCards"
                    :disabled="disabled"
                    :inEditState="card.isEditing"
                />
        </li>
        <li class="kanban-card-item"
            style="margin-bottom: 8px;">
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
        <li v-if="column.editedAt" class="kanban-card-item edited-at">
            {{ columnsStore.getRelativeTime(column.editedAt) }}
        </li>
    </ul>
    <footer>
        <BaseButton
            @click="handleSortCardsByTitle"
            :icon="sortedBy === 'Ascending' ? 'sort_asc' : sortedBy === 'Descending' ? 'sort_des' : 'sort'"
            :aria-pressed="disabled || cards.length < 2"
            :disabled="disabled || cards.length < 2"
        >
            Sort <span style="color: var(--vt-c-black-03)" v-if="sortedBy">{{ sortedBy }}</span>
        </BaseButton>
        <BaseButton
            @click="cardsStore.deleteCardsByColumnId(props.column.id)" 
            icon="close"
            :aria-pressed="disabled || cards.length === 0"
            :disabled="disabled || cards.length === 0"
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
    outline: none;
}

.kanban-column-heading:empty:before {
  content: attr(data-placeholder);
  pointer-events: none;
  text-transform: capitalize;
}

.kanban-cards-container {
    margin: 0;
    padding: 0 16px;
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
    padding: 16px;
}

.kanban-column footer {
    padding: 20px 16px;
    display: flex;
    justify-content: center;
    gap: 4px;
}

.title-container {
    display: flex;
    gap: 5px;
    justify-content: start;
    align-items: center;
    width: 180px;
    overflow: auto;
}
.title-container h2 {
    max-width: 180px;
    min-width: 30px;
    overflow: auto;
}

.title-container span {
    font-size: 13px
}

.kanban-card-item.edited-at{
    color: var(--vt-c-black-015);
    margin: 0 auto;
    margin-top: 8px;
    margin-bottom: 16px;
    font-size: 14px;
}

.kanban-column-nav {
    display: flex;
}
</style>