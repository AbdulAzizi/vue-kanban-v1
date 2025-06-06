<script lang="ts" setup>
	import { ref, computed, onMounted, nextTick } from 'vue';
	import type { KanbanCardType } from '../types/kanbanTypes';
	import { useDragStore } from '@/stores/drag';
	import { useCardsStore } from '@/stores/cards';
	import BaseButton from './BaseButton.vue';

	const props = defineProps<{
		card: KanbanCardType,
		disabled: boolean,
		inEditState?: boolean,
	}>();

	const emit = defineEmits<{
		(e: 'reorder-card', card: KanbanCardType): void
	}>();

	const isEditing = ref(props.inEditState);

	const draftTitle = ref(props.card.title);
	const draftDescription = ref(props.card.description);

	const title = ref(props.card.title);
	const description = ref(props.card.description);

	const titleEl = ref<HTMLElement | null>(null);
	const descriptionEl = ref<HTMLElement | null>(null);

	onMounted(() => {
		updateContent();
		if (isEditing.value && titleEl.value) {
			titleEl.value.focus();
		}
	});

	const isDirty = computed(() =>
		draftTitle.value !== title.value || draftDescription.value !== description.value
	);

	const dragStore = useDragStore();
	const cardsStore = useCardsStore();

	const ondragstart = (event: DragEvent) => {
		if (props.disabled) return;

		if (event.dataTransfer) {
			event.dataTransfer.effectAllowed = 'move';
			event.dataTransfer.dropEffect = 'move';
		}

		dragStore.startDrag('card', props.card);
	};

	const ondragover = () => {
		if (props.disabled || isEditing.value) return;

		if (dragStore.dragType === 'card') {
			emit('reorder-card', props.card);
		}
	};

	const ondragend = () => {
		if (props.disabled || isEditing.value) return;

		dragStore.clearDrag();
	};

	const isDragging = computed(() =>
		dragStore.dragType === 'card' && dragStore.dragData?.id === props.card.id
	);

	const updateContent = () => {
		if (titleEl.value) titleEl.value.innerHTML = title.value;
		if (descriptionEl.value) descriptionEl.value.innerHTML = description.value;
		cardsStore.updateCard(props.card.id, { title: title.value, description: description.value, isEditing: false })
	};

	const save = async () => {
		if (!isDirty.value) return;
		title.value = draftTitle.value;
		description.value = draftDescription.value;
		isEditing.value = false;

		await nextTick();
		updateContent();
	};

	const cancel = async () => {
		if (
			title.value.trim() === '' &&
			description.value.trim() === ''
		) {
			cardsStore.deleteCardById(props.card.id);
			return;
		}

		draftTitle.value = title.value;
		draftDescription.value = description.value;
		isEditing.value = false;

		await nextTick();
		updateContent();
	};

	const onTextChange = () => {
		if (titleEl.value) {
			draftTitle.value = titleEl.value.innerHTML;
		}
		if (descriptionEl.value) {
			draftDescription.value = descriptionEl.value.innerHTML;
		}
	};

	const handleKeydown = (e: KeyboardEvent) => {
        switch (e.key) {
            case 'Enter':
                save();
                break;
            case 'Escape':
                cancel();
                break;
        }
    };

	const onRightClick = () => {
		if (props.disabled) return;
		
		cardsStore.deleteCardById(props.card.id)
	};

	const onDoubleClick = () => {
		if (!isEditing.value && !props.disabled) {
			isEditing.value = true;
		}
	};
</script>

<template>
	<article
		class="kanban-card"
		:class="{ editing: isEditing, dragging: isDragging }"
		:aria-label="props.card.title"
		@dragend="ondragend"
		@dragover.prevent.stop="ondragover"
		@dragstart.stop="ondragstart"
		:draggable="!disabled && !isEditing"
		@dblclick="onDoubleClick"
		@keydown="handleKeydown"
		@contextmenu.prevent="onRightClick"
	>
		<h5
			ref="titleEl"
			class="kanban-card-title"
			:contenteditable="isEditing && !disabled"
			spellcheck="false"
			@keyup="onTextChange"
		></h5>
		<p
			ref="descriptionEl"
			class="kanban-card-description"
			:contenteditable="isEditing && !disabled"
			spellcheck="false"
			@keyup="onTextChange"
			:data-placeholder="'Add Description'"
		></p>
		<footer v-if="isEditing" contenteditable="false">
			<BaseButton
				icon="power"
				style="margin-right: 8px"
				@click="save"
				:disabled="!isDirty"
			>
				Save changes
			</BaseButton>
			<BaseButton
				@click="cancel"
				icon="minus"
				:disabled="disabled"
			>
				Cancel
			</BaseButton>
		</footer>
	</article>
</template>
	
<style scoped>
.kanban-card {
	margin-bottom: 8px;
	padding: 16px;
	background-color: var(--color-background);
	border-radius: 8px;
}

.kanban-card .kanban-card-title,
.kanban-card .kanban-card-description {
	outline: none;
}

.kanban-card.editing {
	box-shadow: inset 0 0 0 2px var(--vt-c-blue-1);
	outline: none;
}

.kanban-card .kanban-card-title {
	font-weight: 600;
	margin: 0;
}

.kanban-card .kanban-card-description {
	font-size: 14px;
	color: var(--vt-c-black-03);
	margin: 8px 0;
}

.kanban-card.dragging {
	opacity: 0.5;
}

.kanban-card footer {
    justify-content: start;
    gap: 0px;
	padding: 0;
}

.kanban-card .kanban-card-description:empty:before {
  content: attr(data-placeholder);
  pointer-events: none;
}
</style>
