<script lang="ts" setup>
	import { ref, computed, onMounted, onBeforeUnmount, nextTick, watch } from 'vue';
	import type { KanbanCardType } from '../types/kanbanTypes';
	import { useDragStore } from '@/stores/drag';
	import BaseButton from './BaseButton.vue';

	const props = defineProps<{
		card: KanbanCardType,
		disabled: boolean,
	}>();

	const emit = defineEmits<{
		(e: 'reorder-card', card: KanbanCardType): void
	}>();

	const isEditing = ref(false);

	const draftTitle = ref(props.card.title);
	const draftDescription = ref(props.card.description);

	const title = ref(props.card.title);
	const description = ref(props.card.description);

	const titleEl = ref<HTMLElement | null>(null);
	const descriptionEl = ref<HTMLElement | null>(null);
	const rootEl = ref<HTMLElement | null>(null);

	const isDirty = computed(() =>
		draftTitle.value !== title.value || draftDescription.value !== description.value
	);

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

	const updateContent = () => {
		if (titleEl.value) titleEl.value.innerHTML = title.value;
		if (descriptionEl.value) descriptionEl.value.innerHTML = description.value;
	};

	onMounted(() => {
		updateContent();
	});

	const save = async () => {
		if (!isDirty.value) return;
		title.value = draftTitle.value;
		description.value = draftDescription.value;
		isEditing.value = false;

		await nextTick();
		updateContent();
	};

	const cancel = async () => {
		draftTitle.value = title.value;
		draftDescription.value = description.value;
		isEditing.value = false;

		await nextTick();
		updateContent();
	};

	const onTextChange = () => {
		if (titleEl.value && descriptionEl.value) {
			draftTitle.value = titleEl.value.innerHTML;
			draftDescription.value = descriptionEl.value.innerHTML;
		}
	};

	const onClickOutside = (event: MouseEvent) => {
		if (!rootEl.value) return;
		if (!rootEl.value.contains(event.target as Node)) {
			isEditing.value = false;
		}
	};

	watch(isEditing, (val) => {
		if (val) {
			document.addEventListener('click', onClickOutside);
		} else {
			document.removeEventListener('click', onClickOutside);
		}
	});

	onBeforeUnmount(() => {
		document.removeEventListener('click', onClickOutside);
	});

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
</script>

<template>
	<article
		ref="rootEl"
		class="kanban-card"
		:class="{ editing: isEditing }"
		:aria-label="props.card.title"
		@dragend="ondragend"
		@dragover.prevent="ondragover"
		@dragstart.stop="ondragstart"
		:draggable="!disabled"
		@dblclick="isEditing = (!isEditing && !disabled)"
		@keydown="handleKeydown"
	>
		<h5
			ref="titleEl"
			class="kanban-card-title"
			:contenteditable="isEditing"
			spellcheck="false"
			@keyup="onTextChange"
		></h5>
		<p
			ref="descriptionEl"
			class="kanban-card-description"
			:contenteditable="isEditing"
			spellcheck="false"
			@keyup="onTextChange"
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
				:disabled="!isDirty"
			>
				Cancel
			</BaseButton>
		</footer>
	</article>
</template>
	
<style scoped>
.kanban-card {
	margin-top: 8px;
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
}
</style>
