<script setup lang="ts">
  import { reactive, useId } from 'vue';
  import type { KanbanColumnType } from './types/kanbanTypes';
  import KanbanBoard from './components/KanbanBoard.vue';

  const columns = reactive<KanbanColumnType[]>([
    { id: useId(), title: 'Todo', order: 1, cards: [] },
    { id: useId(), title: 'In progress', order: 2, cards: [] },
    { id: useId(), title: 'Done', order: 3, cards: [] },
    { id: useId(), title: 'Backlog', order: 4, cards: [] },
    { id: useId(), title: 'Archive', order: 5, cards: [] },
  ]);
</script>

<template>
  <header>
  </header>

  <main>
    <KanbanBoard :columns="columns" />
  </main>
</template>

<style scoped>
main{
  height: 100%;
}
</style>
