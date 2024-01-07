<template>
  <UContainer class="py-4">
    <UCard :ui="{ body: { padding: '' } }">
      <template #header>
        <h1 class="text-xl font-bold">
          LikeCoin Chain Notion Tasks Viewer<br />
          <span class="text-[0.75em] text-slate-400">by Liker Land Team</span>
        </h1>
      </template>

      <UTable :columns="columns" :rows="[]" />
    </UCard>
  </UContainer>
</template>

<script setup>
const tasksColumns = [
  {
    key: "date",
    label: "Date",
  },
  {
    key: "name",
    label: "Task Name",
  },
  {
    key: "priority",
    label: "Task Priority",
  },
  {
    key: "assignees",
    label: "Assignees",
  },
  {
    key: "mandays",
    label: "Man-days",
  },
];
</script>
