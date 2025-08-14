<script setup lang="ts">
type Query = {
  q: string;
  legislature?: "XVI" | "XVII";
  theme?: "ecologie" | "social" | "justice" | "tous";
  type?: "ordinaire" | "solennel" | "censure" | "tous";
};
const props = defineProps<{ modelValue: Query }>();
const emit = defineEmits<{ "update:modelValue": [Query]; search: [] }>();
const local = reactive<Query>({ ...props.modelValue });
watch(
  () => props.modelValue,
  (v) => Object.assign(local, v)
);
watch(local, (v) => emit("update:modelValue", v), { deep: true });
</script>

<template>
  <section class="container mx-auto px-4 mt-8">
    <div class="card bg-base-100 border border-base-300 shadow-md">
      <div class="card-body gap-4">
        <div class="join w-full">
          <input
            v-model="local.q"
            class="input input-bordered join-item w-full"
            placeholder="Rechercher un texte (ex. « fin de vie », « pouvoir d’achat »)"
          />
          <button class="btn btn-primary join-item" @click="emit('search')">
            Rechercher
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
          <label class="form-control">
            <span class="label-text">Législature</span>
            <select v-model="local.legislature" class="select select-bordered">
              <option :value="undefined">XVI + XVII</option>
              <option value="XVI">XVI</option>
              <option value="XVII">XVII</option>
            </select>
          </label>

          <label class="form-control">
            <span class="label-text">Thème</span>
            <select v-model="local.theme" class="select select-bordered">
              <option value="tous">Tous</option>
              <option value="ecologie">Écologie</option>
              <option value="social">Social</option>
              <option value="justice">Justice</option>
            </select>
          </label>

          <label class="form-control">
            <span class="label-text">Type de scrutin</span>
            <select v-model="local.type" class="select select-bordered">
              <option value="tous">Tous</option>
              <option value="ordinaire">Public ordinaire</option>
              <option value="solennel">Public solennel</option>
              <option value="censure">Motion de censure</option>
            </select>
          </label>
        </div>
      </div>
    </div>
  </section>
</template>
