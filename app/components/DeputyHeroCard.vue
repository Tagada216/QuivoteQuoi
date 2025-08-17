<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    name: string;
    group?: { acronym: string; name: string; color: string } | null;
    departement?: string | null;
    circ?: number | null;
    photoUrl?: string | null;
    anId?: number | null;
    showPhoto?: boolean;
  }>(),
  {
    showPhoto: true,
  }
);

const emit = defineEmits<{ "update:showPhoto": [boolean] }>();

const initials = computed(() => {
  return (
    (props.name || "")
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join("") || "—"
  );
});
</script>

<template>
  <div
    class="relative bg-stone-50 border-4 border-black rounded-3xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
  >
    <div
      class="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent pointer-events-none"
    ></div>
    <div
      class="relative card-body p-4 sm:p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-6 md:gap-8"
    >
      <div class="shrink-0">
        <div
          v-if="showPhoto && photoUrl"
          class="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden border-3 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-white"
        >
          <NuxtImg
            :src="photoUrl"
            :alt="`Photo de ${name}`"
            class="w-full h-full object-cover"
          />
        </div>
        <div
          v-else
          class="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-2xl border-3 border-black bg-gradient-to-br from-white to-gray-100 grid place-items-center text-3xl font-black text-black"
        >
          {{ initials }}
        </div>
      </div>

      <div class="flex-1 min-w-0 mt-6 md:mt-0">
        <div class="flex items-center gap-3 sm:gap-4 flex-wrap min-w-0">
          <h1 class="text-3xl md:text-4xl font-black tracking-tight text-black">
            {{ name }}
          </h1>
          <span
            v-if="group"
            class="px-4 py-2 rounded-xl font-black text-white border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            :style="{ background: group.color }"
          >
            {{ group.acronym }} — {{ group.name }}
          </span>
        </div>

        <div class="mt-2 text-gray-700 text-sm md:text-base">
          <span v-if="departement">{{ departement }}</span>
          <span v-if="circ">&nbsp;· circ. {{ circ }}</span>
          <span v-if="anId">&nbsp;· AN: {{ anId }}</span>
        </div>

        <div class="mt-6 flex flex-wrap items-center gap-3 sm:gap-4">
          <label class="inline-flex items-center gap-2 select-none">
            <span class="font-bold text-black">Photo</span>
            <input
              type="checkbox"
              class="w-6 h-6 rounded border-2 border-black accent-black"
              :checked="showPhoto"
              @change="emit('update:showPhoto', !showPhoto)"
            />
          </label>
        </div>
      </div>
    </div>
  </div>
</template>
