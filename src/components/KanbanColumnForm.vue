<script lang="ts" setup>
    import { ref, onMounted } from 'vue';

    const emit = defineEmits<{
        (e: 'save', title: string): void;
        (e: 'cancel'): void;
    }>();

    const title = ref('');

    const save = () => {
        if (title.value.trim()) {
            emit('save', title.value.trim());
            title.value = '';
        } else {
            inputRef.value?.classList.add('error');
            setTimeout(function() {
                inputRef.value?.classList.remove('error');
            }, 300);
        }
    };

    const cancel = () => {
        emit('cancel');
        title.value = '';
    };

    const inputRef = ref<HTMLInputElement | null>(null);

    onMounted(() => {
        inputRef.value?.focus();
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
    <section class="kanban-column kanban-column-form">
        <input
            ref="inputRef"
            v-model="title"
            type="text"
            placeholder="Enter column title"
            class="column-input"
            @keydown="handleKeydown"
        />
        <div class="form-actions">
            <button @click="save" class="button primary">Save</button>
            <button @click="cancel" class="button secondary">Cancel</button>
        </div>
    </section>
</template>

<style scoped>
.kanban-column-form {
    display: flex;
    flex-direction: column;
    order: 9999999;
    cursor: default;
}

.column-input {
    width: 100%;
    height: 32px;
    padding: 6px 12px;
    font-size: 14px;
    border: 2px solid var(--vt-c-grey);
    border-radius: 8px;
    margin-bottom: 16px;
    background-color: var(--vt-c-white);
    box-sizing: border-box;
}

.form-actions {
    display: flex;
    gap: 16px;
}

.button {
    padding: 8px 12px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 13px;
    width: 100%;
    transition: all 0.2s ease;
}

.primary {
    background-color: var(--vt-c-blue-1);
    color: white;
}

.primary:hover {
    opacity: 0.8;
}

.secondary {
    background-color: var(--vt-c-black-005);
}

.secondary:hover {
    background-color: var(--vt-c-black-015);
}

.error {
    position: relative;
    animation: shake .1s linear;
    animation-iteration-count: 3;
}

@keyframes shake {
    0% { left: -3px; }
    100% { right: -3px; }
}
</style>
