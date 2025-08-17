<script setup lang="ts">
const props = defineProps<{
  fullName: string;
  slug?: string | null;
  circ?: number | null;
  departement?: string | null;
  photo?: string | null;
  showPhoto?: boolean;
}>();

const initials = computed(() => {
  const p = props.fullName.split(/\s+/).filter(Boolean);
  return (p[0]?.[0] || "").toUpperCase() + (p[1]?.[0] || "").toUpperCase();
});
</script>

<template>
  <NuxtLink
    v-if="slug"
    :to="`/depute/${slug}`"
    class="group flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-stone-50 border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none"
  >
    <div v-if="showPhoto" class="shrink-0">
      <NuxtImg
        v-if="photo"
        :src="photo"
        alt=""
        class="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover border-2 border-black"
      />
      <div
        v-else
        class="w-10 h-10 sm:w-12 sm:h-12 rounded-lg border-2 border-black bg-gradient-to-br from-white to-gray-100 grid place-items-center text-sm font-black text-black"
      >
        {{ initials }}
      </div>
    </div>

    <div class="min-w-0">
      <div
        class="font-black leading-tight truncate group-hover:text-blue-600 text-black transition-colors"
      >
        {{ fullName }}
      </div>
      <div class="text-sm text-gray-500 font-medium">
        <span v-if="departement">{{ departement }}</span>
        <span v-if="circ">&nbsp;· circ. {{ circ }}</span>
      </div>
    </div>
  </NuxtLink>

  <div
    v-else
    class="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-stone-50 border-2 border-black"
  >
    <div v-if="showPhoto" class="shrink-0">
      <NuxtImg
        v-if="photo"
        :src="photo"
        alt=""
        class="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover border-2 border-black"
      />
      <div
        v-else
        class="w-10 h-10 sm:w-12 sm:h-12 rounded-lg border-2 border-black bg-gradient-to-br from-white to-gray-100 grid place-items-center text-sm font-black text-black"
      >
        {{ initials }}
      </div>
    </div>

    <div class="min-w-0">
      <div class="font-black leading-tight truncate text-gray-600">
        {{ fullName }}
      </div>
      <div class="text-sm text-gray-500 font-medium">
        <span v-if="departement">{{ departement }}</span>
        <span v-if="circ">&nbsp;· circ. {{ circ }}</span>
      </div>
    </div>
  </div>
</template>
