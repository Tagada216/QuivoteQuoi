<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";

type ApiResp = {
  q: string;
  group: string | null;
  leg: number;
  groups: { id: string; label: string; color: string; countActive: number }[];
  results: Array<{
    groupId: number;
    acronym: string;
    name: string;
    color: string;
    count: number;
    deputies: Array<{
      id: number;
      full_name: string;
      slug: string | null;
      circ: number | null;
      departement: string | null;
      photo_url: string | null;
    }>;
  }>;
};

const route = useRoute();
const router = useRouter();
const q = ref<string>((route.query.q as string) || "");
const leg = ref<number | null>(route.query.leg ? Number(route.query.leg) : 17);
const group = ref<string | null>((route.query.group as string) || null);
const showPhotos = ref(true);

const key = computed(
  () => `deputes:${q.value}:${leg.value ?? "all"}:${group.value ?? "all"}`
);
const { data, pending, error } = await useFetch<ApiResp>("/api/deputes", {
  query: computed(() => ({
    q: q.value || undefined,
    leg: leg.value ?? undefined,
    group: group.value || undefined,
  })),
  key,
  watch: [q, leg, group],
});

watch([q, leg, group], () => {
  router.replace({
    path: "/deputes",
    query: {
      q: q.value || undefined,
      leg: leg.value ?? undefined,
      group: group.value || undefined,
    },
  });
});
</script>

<template>
  <main class="container mx-auto px-4 py-8">
    <header class="mb-6">
      <h1 class="text-2xl md:text-3xl font-extrabold tracking-tight">
        Députés
      </h1>
      <p class="text-base-content/70">
        Recherche par nom, filtre par groupe — affichage groupé, ordre
        alphabétique.
      </p>
    </header>

    <!-- Contrôles -->
    <div class="grid gap-3 sm:grid-cols-[1fr,260px,160px,auto] mb-6 items-end">
      <div class="form-control">
        <label class="label"
          ><span class="label-text font-medium">Nom / prénom</span></label
        >
        <input
          v-model="q"
          class="input input-bordered w-full"
          placeholder="ex. Dupont, Marie…"
        />
      </div>
      <div class="form-control">
        <label class="label"
          ><span class="label-text font-medium">Groupe</span></label
        >
        <select v-model="group" class="select select-bordered w-full">
          <option :value="null">Tous les groupes</option>
          <option v-for="g in data?.groups || []" :key="g.id" :value="g.id">
            {{ g.label }} ({{ g.countActive }})
          </option>
        </select>
      </div>
      <div class="form-control">
        <label class="label"
          ><span class="label-text font-medium">Législature</span></label
        >
        <select v-model="leg" class="select select-bordered w-full">
          <option :value="16">XVI</option>
          <option :value="17">XVII</option>
        </select>
      </div>
      <label class="label cursor-pointer">
        <span class="label-text mr-2">Photos</span>
        <input type="checkbox" class="toggle" v-model="showPhotos" />
      </label>
    </div>

    <div v-if="pending" class="grid gap-3 md:grid-cols-2">
      <div v-for="i in 6" :key="i" class="skeleton h-24 rounded-xl"></div>
    </div>
    <div v-else-if="error" class="alert alert-error">
      <span>Erreur : {{ (error as any)?.message || "inconnue" }}</span>
    </div>

    <section v-else>
      <div v-if="(data?.results?.length ?? 0) === 0" class="alert">
        <span>Aucun député pour ce filtre.</span>
      </div>

      <div v-else class="space-y-3">
        <details
          v-for="g in data!.results"
          :key="g.groupId"
          open
          class="collapse collapse-arrow border border-base-300 bg-base-100"
        >
          <summary class="collapse-title flex items-center gap-3">
            <span
              class="badge"
              :style="{
                background: g.color,
                color: '#fff',
                borderColor: 'transparent',
              }"
              >{{ g.acronym }}</span
            >
            <span class="font-medium">{{ g.name }}</span>
            <span class="opacity-70 text-sm"
              >· {{ g.count }} député<span v-if="g.count > 1">s</span></span
            >
          </summary>
          <div class="collapse-content">
            <ul class="grid gap-1 sm:grid-cols-2 lg:grid-cols-3">
              <li v-for="d in g.deputies" :key="d.id">
                <DeputyItem
                  :full-name="d.full_name"
                  :slug="d.slug"
                  :circ="d.circ"
                  :departement="d.departement"
                  :photo="d.photo_url"
                  :show-photo="showPhotos"
                />
              </li>
            </ul>
          </div>
        </details>
      </div>
    </section>
  </main>
</template>
