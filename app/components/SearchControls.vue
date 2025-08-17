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
  <section id="recherche" class="container mx-auto px-4 mt-8">
    <div
      class="relative bg-stone-50 border-4 border-black rounded-3xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
    >
      <div
        class="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none"
      ></div>
      <div class="relative card-body p-8 space-y-8">
        <form @submit.prevent="submit" class="space-y-8">
          <div class="form-control">
            <label class="block mb-3" :for="ids.q">
              <span class="text-xl font-black text-black"
                >Rechercher un texte</span
              >
            </label>
            <div class="flex gap-4">
              <input
                :id="ids.q"
                v-model="local.q"
                class="input flex-1 bg-white border-3 border-black rounded-xl px-4 py-3 text-lg font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:translate-x-1 focus:translate-y-1 transition-all duration-150"
                placeholder="Rechercher un texte (ex. « fin de vie », « pouvoir d'achat »)"
              />
              <button
                class="btn bg-blue-500 hover:bg-blue-600 text-white border-3 border-black font-black px-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-150 active:translate-x-1 active:translate-y-1 active:shadow-none"
                type="submit"
              >
                Rechercher
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="form-control">
              <label class="block mb-3" :for="ids.legislature">
                <span class="text-lg font-black text-black">Législature</span>
              </label>
              <select
                :id="ids.legislature"
                v-model="local.legislature"
                class="select bg-white border-3 border-black rounded-xl px-4 py-3 text-lg font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:translate-x-1 focus:translate-y-1 transition-all duration-150 w-full"
                @change="submit"
              >
                <option value="">XVI + XVII</option>
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
                class="select bg-white border-3 border-black rounded-xl px-4 py-3 text-lg font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:translate-x-1 focus:translate-y-1 transition-all duration-150 w-full"
                @change="submit"
              >
                <option value="tous">Tous</option>
                <option value="ecologie">Écologie</option>
                <option value="social">Social</option>
                <option value="justice">Justice</option>
              </select>
            </div>

            <div class="form-control">
              <label class="block mb-3" :for="ids.type">
                <span class="text-lg font-black text-black"
                  >Type de scrutin</span
                >
              </label>
              <select
                :id="ids.type"
                v-model="local.type"
                class="select bg-white border-3 border-black rounded-xl px-4 py-3 text-lg font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:translate-x-1 focus:translate-y-1 transition-all duration-150 w-full"
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
