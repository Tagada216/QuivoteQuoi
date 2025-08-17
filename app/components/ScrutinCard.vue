<script setup lang="ts">
type Counts = { POUR: number; CONTRE: number; ABSTENTION: number; NV: number };
const props = defineProps<{
  item: {
    id: number;
    title: string;
    counts: Counts;
  };
}>();
</script>

<template>
  <!-- card compacte, faible padding -->
  <article
    class="card card-compact bg-base-100 border border-base-300 shadow-sm h-full"
  >
    <div class="card-body py-3">
      <h3 class="font-semibold leading-snug line-clamp-2">
        {{ item.title }}
      </h3>

      <div class="mt-2 flex items-center gap-3 text-sm">
        <span class="inline-flex items-center gap-1">
          <i
            class="w-2.5 h-2.5 rounded-full inline-block"
            style="background: #16a34a"
          ></i>
          <span class="font-medium">{{ item.counts.POUR }}</span
          ><span class="opacity-70">Pour</span>
        </span>
        <span class="inline-flex items-center gap-1">
          <i
            class="w-2.5 h-2.5 rounded-full inline-block"
            style="background: #dc2626"
          ></i>
          <span class="font-medium">{{ item.counts.CONTRE }}</span
          ><span class="opacity-70">Contre</span>
        </span>
      </div>

      <div class="card-actions justify-end mt-3">
        <NuxtLink class="btn btn-sm btn-primary" :to="`/scrutin/${item.id}`">
          Voir le scrutin
        </NuxtLink>
      </div>
    </div>
  </article>
</template>
