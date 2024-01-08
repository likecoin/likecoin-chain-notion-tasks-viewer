<template>
  <UContainer class="py-10 space-y-4">
    <UCard
      :ui="{
        header: {
          base: 'flex justify-between items-center',
        },
        body: {
          padding: '',
          base: 'divide-y divide-gray-200 dark:divide-gray-800',
        },
      }"
    >
      <template #header>
        <h1 class="text-xl font-bold">
          LikeCoin Chain Notion Tasks Viewer<br />
          <span class="text-[0.75em] text-slate-400">by Liker Land Team</span>
        </h1>

        <UButton
          color="primary"
          variant="solid"
          to="https://github.com/likecoin/likecoin/issues"
          target="_blank"
        >
          Feature Request
        </UButton>
      </template>

      <UTable :columns="manhoursColumnsByMonth" :rows="manhoursRowsByMonth" />
      <UTable :columns="tasksColumns" :rows="tasksRows">
        <template #date-data="{ row }">
          <span v-if="row.startDate">{{ row.startDate }}</span
          ><br />
          <span v-if="row.endDate">- {{ row.endDate }}</span>
        </template>
        <template #name-data="{ row }">
          <div class="text-[0.9em] text-slate-400">{{ row.project }}</div>
          <div>{{ row.name }}</div>
        </template>
        <template #priority-data="{ row }">
          <UBadge :color="row.priorityColor">{{ row.priority }}</UBadge>
        </template>
      </UTable>
    </UCard>
  </UContainer>
</template>

<script setup>
import { getMonth, getYear, endOfMonth, startOfMonth, format } from "date-fns";

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

const { data: tasks } = await useFetch("/api/data");

function getPriorityColor(priority) {
  switch (priority) {
    case "Top":
      return "red";
    case "High":
      return "rose";
    case "Medium":
      return "amber";
    case "Low":
      return "emerald";
    default:
      return "gray";
  }
}

const tasksRows = computed(() =>
  tasks.value.results.map((item) => ({
    project: item.project,
    name: item.title,
    priority: item.priority,
    priorityColor: getPriorityColor(item.priority),
    assignees: item.assignees.join(", "),
    startDate: item.startDate
      ? format(new Date(item.startDate), "yyyy/MM/dd HH:mm")
      : null,
    endDate: item.endDate
      ? format(new Date(item.endDate), "yyyy/MM/dd HH:mm")
      : null,
    mandays: item.mandays,
  }))
);

const manhoursColumnsByMonth = [
  {
    key: "formattedDate",
    label: "Date",
  },
  {
    key: "mandays",
    label: "Total Man-days",
  },
];

const manhoursRowsByMonth = computed(() => {
  return Object.values(
    tasksRows.value.reduce((acc, cur) => {
      const month = getMonth(cur.startDate) + 1;
      const year = getYear(cur.startDate);
      const key = `${year}-${month}`;

      if (!acc[key]) {
        acc[key] = {
          formattedDate: `${format(
            startOfMonth(cur.startDate),
            "yyyy/MM/dd"
          )}-${format(endOfMonth(cur.startDate), "dd")}`,
          mandays: 0,
        };
      }

      acc[key].mandays += cur.mandays;

      return acc;
    }, {})
  );
});
</script>
