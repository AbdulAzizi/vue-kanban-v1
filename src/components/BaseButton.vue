<script lang="ts" setup>
import { computed } from 'vue';

const props = defineProps({
	icon: {
		type: String as () => 'close' | 'minus' | 'pause' | 'play' | 'plus' | 'power' | 'shuffle' | 'sort',
		required: false,
	},
	variant: {
		type: String as () => 'round' | 'tile',
		default: 'round',
	},
	fullWidth: Boolean,
	color: {
		type: String,
		default: 'white',
	},
	disabled: Boolean,
});

const emit = defineEmits<{
	(e: 'click'): void;
}>();

const classes = computed(() => [
	'base-button',
	props.variant,
	props.fullWidth ? 'full-width' : '',
	props.disabled ? 'disabled' : '',
]);

const styles = computed(() => ({
	'--button-bg': props.color,
}));

const handleClick = () => {
	if (!props.disabled) emit('click');
};
</script>


<template>
	<button
		:class="classes"
		:style="styles"
		:disabled="props.disabled"
		@click="handleClick"
	>
		<img v-if="icon" :src="`/assets/${icon}.svg`" alt="" class="icon" />
		<span><slot /></span>
	</button>
</template>

<style scoped>
.base-button {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	font-size: 13px;
	padding: 8px 12px;
	border: none;
	border-radius: 6px;
	cursor: pointer;
	gap: 4px;
	transition: all 0.2s;
	background-color: var(--button-bg, white);
}

.base-button.round {
	border-radius: 16px;
	height: 24px;
	padding: 0 8px 0 4px;
	border: 2px solid var(--vt-c-black-005);
}

.base-button.tile {
	width: 100%;
	padding: 8px 12px;
	border-radius: 6px;
}

.base-button.full-width {
	width: 100%;
}

.base-button.disabled {
	opacity: 0.5;
	cursor: not-allowed;
}

.base-button:not(.disabled):hover {
	filter: brightness(0.9);
}

.icon {
	width: 16px;
	height: 16px;
}
</style>
