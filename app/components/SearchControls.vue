<script setup lang="ts">
type Query = {
  q: string;
  legislature: 16 | 17 | null;
  theme: "tous" | "ecologie" | "social" | "justice";
  type: "tous" | "ordinaire" | "solennel" | "censure";
};
const props = defineProps<{ modelValue: Query }>();
const emit = defineEmits<{ "update:modelValue": [Query]; search: [] }>();

const local = reactive<Query>({ ...props.modelValue });

watch(
  () => props.modelValue,
  (v) => Object.assign(local, v)
);
watch(local, (v) => emit("update:modelValue", v), { deep: true });

const uid = Math.random().toString(36).slice(2);
const ids = {
  q: `q-${uid}`,
  legislature: `leg-${uid}`,
  theme: `theme-${uid}`,
  type: `type-${uid}`,
};

function submit() {
  emit("search");
}
</script>

<template>
  <section class="container mx-auto px-3 sm:px-4">
    <div
      class="relative bg-stone-50 border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
    >
      <div
        class="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none"
      ></div>
      <div class="relative card-body p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8">
        <form @submit.prevent="submit" class="space-y-8">
          <div class="form-control">
            <label class="block mb-2 sm:mb-3" :for="ids.q">
              <span class="text-lg sm:text-xl font-black text-black"
                >Rechercher un texte</span
              >
            </label>
            <div class="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <input
                :id="ids.q"
                v-model="local.q"
                class="input flex-1 w-full bg-white border-3 border-black rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] focus:-translate-x-1 focus:translate-y-1 transition-all duration-150"
                type="text"
                placeholder="Mots-clés, intitulé, objet…"
                inputmode="search"
                autocomplete="off"
              />
              <button type="submit" class="btn btn-primary w-full sm:w-auto">
                Rechercher
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="form-control">
              <label class="block mb-3" :for="ids.legislature">
                <span class="text-lg font-black text-black">Législature</span>
              </label>
              <select
                :id="ids.legislature"
                v-model="local.legislature"
                class="select bg-white border-3 border-black rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] w-full"
                @change="submit"
              >
                <option :value="null">Toutes</option>
                <option :value="16">XVI</option>
                <option :value="17">XVII</option>
              </select>
            </div>

            <div class="form-control">
              <label class="block mb-3" :for="ids.theme">
                <span class="text-lg font-black text-black">Thème</span>
              </label>
              <select
                :id="ids.theme"
                v-model="local.theme"
                class="select bg-white border-3 border-black rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] w-full"
                @change="submit"
              >
                <option value="tous">Tous</option>
                <option value="ecologie">Écologie</option>
                <option value="social">Social</option>
                <option value="justice">Justice</option>
              </select>
            </div>

            <div class="form-control sm:col-span-2 lg:col-span-2">
              <label class="block mb-3" :for="ids.type">
                <span class="text-lg font-black text-black"
                  >Type de scrutin</span
                >
              </label>
              <select
                :id="ids.type"
                v-model="local.type"
                class="select bg-white border-3 border-black rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] w-full"
                @change="submit"
              >
                <option value="tous">Tous</option>
                <option value="ordinaire">Public ordinaire</option>
                <option value="solennel">Public solennel</option>
                <option value="censure">Motion de censure</option>
              </select>
            </div>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>
