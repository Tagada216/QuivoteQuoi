<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";

type ScrutinRow = {
  id: number;
  an_id: number;
  date: string;
  type: "ordinaire" | "solennel" | "censure" | null;
  objet: string;
  url_source: string;
  dossier: {
    id: number;
    alias: string | null;
    titre_officiel: string | null;
  } | null;
};

type SearchResponse = {
  q: string | null;
  leg: number | null;
  type: "tous" | "ordinaire" | "solennel" | "censure";
  dossiers: number[];
  scrutins: ScrutinRow[];
  page: number;
  pageSize: number;
  total: number;
  pageCount: number;
  hasNext: boolean;
  hasPrev: boolean;
};

const route = useRoute();
const router = useRouter();

/** URL → état */
const q = ref<string>((route.query.q as string) || "");
const leg = ref<number | undefined>(
  route.query.leg ? Number(route.query.leg) : undefined
);
const type = ref<SearchResponse["type"]>(
  (route.query.type as string as any) || "tous"
);

// pagination URL → état
const page = ref<number>(
  route.query.page ? Math.max(1, Number(route.query.page)) : 1
);
const pageSize = ref<number>(
  route.query.pageSize
    ? Math.max(1, Math.min(50, Number(route.query.pageSize)))
    : 20
);

/** Fetch paginé */
const fetchKey = computed(
  () =>
    `search:${q.value}:${leg.value ?? "all"}:${type.value}:${page.value}:${
      pageSize.value
    }`
);

const { data, pending, error } = await useFetch<SearchResponse>("/api/search", {
  query: computed(() => ({
    q: q.value || undefined,
    leg: leg.value ?? undefined,
    type: type.value,
    page: page.value,
    pageSize: pageSize.value,
  })),
  key: fetchKey,
  watch: [q, leg, type, page, pageSize],
});

/** Mise à jour URL (shareable) */
function updateUrl() {
  router.replace({
    path: "/search",
    query: {
      q: q.value || undefined,
      leg: leg.value !== undefined ? String(leg.value) : undefined,
      type: type.value !== "tous" ? type.value : undefined,
      page: page.value > 1 ? String(page.value) : undefined,
      pageSize: pageSize.value !== 20 ? String(pageSize.value) : undefined,
    },
  });
}
watch([q, leg, type, page, pageSize], updateUrl);

/** Helpers UI */
function onFilterChange(next: {
  q?: string;
  leg?: number | undefined;
  type?: SearchResponse["type"];
}) {
  if (typeof next.q !== "undefined") q.value = next.q;
  if (typeof next.leg !== "undefined") leg.value = next.leg;
  if (typeof next.type !== "undefined") type.value = next.type;
  page.value = 1; // reset page sur changement de filtre
}
function goPrev() {
  if (data.value?.hasPrev)
    page.value = Math.max(1, (data.value?.page || 1) - 1);
}
function goNext() {
  if (data.value?.hasNext) page.value = (data.value?.page || 1) + 1;
}
</script>

<template>
  <main class="container mx-auto px-4 py-8">
    <header class="mb-6">
      <h1 class="text-2xl md:text-3xl font-bold">Recherche</h1>
      <p class="text-base-content/70">
        Résultats pour <span class="font-medium">“{{ q || "∅" }}”</span>
        <span v-if="type !== 'tous'"> · type: {{ type }}</span>
        <span v-if="leg"> · législature: {{ leg }}</span>
      </p>
    </header>

    <!-- Filtres -->
    <div class="grid gap-3 md:grid-cols-3 mb-4">
      <div class="form-control">
        <label class="label"
          ><span class="label-text font-medium">Terme</span></label
        >
        <input
          class="input input-bordered"
          :value="q"
          @keyup.enter="
            onFilterChange({ q: ($event.target as HTMLInputElement).value })
          "
          @change="
            onFilterChange({ q: ($event.target as HTMLInputElement).value })
          "
          placeholder="ex. fin de vie"
        />
      </div>

      <div class="form-control">
        <label class="label"
          ><span class="label-text font-medium">Législature</span></label
        >
        <select
          class="select select-bordered"
          :value="leg?.toString() ?? ''"
          @change="
            onFilterChange({
              leg: ($event.target as HTMLSelectElement).value
                ? Number(($event.target as HTMLSelectElement).value)
                : undefined,
            })
          "
        >
          <option value="">XVI + XVII</option>
          <option value="16">XVI</option>
          <option value="17">XVII</option>
        </select>
      </div>

      <div class="form-control">
        <label class="label"
          ><span class="label-text font-medium">Type de scrutin</span></label
        >
        <select
          class="select select-bordered"
          :value="type"
          @change="
            onFilterChange({
              type: ($event.target as HTMLSelectElement).value as any,
            })
          "
        >
          <option value="tous">Tous</option>
          <option value="ordinaire">Public ordinaire</option>
          <option value="solennel">Public solennel</option>
          <option value="censure">Motion de censure</option>
        </select>
      </div>
    </div>

    <!-- Contrôles pagination/top -->
    <div class="flex flex-wrap items-end gap-3 mb-4">
      <div class="text-sm opacity-70" v-if="data?.total">
        Affiche
        {{ ((data?.page || 1) - 1) * (data?.pageSize || 20) + 1 }}–{{
          Math.min((data?.page || 1) * (data?.pageSize || 20), data?.total || 0)
        }}
        sur {{ data?.total || 0 }}
      </div>

      <div class="form-control">
        <label class="label"
          ><span class="label-text font-medium">Par page</span></label
        >
        <select class="select select-bordered" v-model.number="pageSize">
          <option :value="10">10</option>
          <option :value="20">20</option>
          <option :value="50">50</option>
        </select>
      </div>

      <div class="join ml-auto">
        <button
          class="btn join-item"
          :disabled="!data?.hasPrev"
          @click="goPrev"
        >
          « Précédent
        </button>
        <button class="btn join-item btn-ghost no-animation">
          Page {{ data?.page || 1 }} / {{ data?.pageCount || 1 }}
        </button>
        <button
          class="btn join-item"
          :disabled="!data?.hasNext"
          @click="goNext"
        >
          Suivant »
        </button>
      </div>
    </div>

    <!-- État -->
    <div v-if="pending" class="grid gap-3">
      <div v-for="i in 6" :key="i" class="skeleton h-24 rounded-xl"></div>
    </div>
    <div v-else-if="error" class="alert alert-error">
      <span>Erreur: {{ (error as any)?.message || "inconnue" }}</span>
    </div>

    <!-- Résultats -->
    <section v-else>
      <div v-if="!data?.scrutins?.length" class="alert">
        <span>Aucun scrutin trouvé. Essaie un autre terme.</span>
      </div>

      <ul v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <li
          v-for="s in data!.scrutins"
          :key="s.id"
          class="card bg-base-100 border border-base-300 shadow-sm"
        >
          <div class="card-body">
            <div class="flex flex-wrap items-center gap-2">
              <span class="badge badge-outline capitalize">{{
                s.type || "scrutin public"
              }}</span>
              <span class="text-sm opacity-70">{{
                new Date(s.date).toLocaleDateString("fr-FR")
              }}</span>
              <span
                v-if="data!.dossiers.includes(s.dossier?.id ?? -1)"
                class="badge badge-info"
              >
                Correspond au dossier
              </span>
            </div>

            <h3 class="card-title text-base mt-1">
              {{ s.dossier?.alias || s.dossier?.titre_officiel || s.objet }}
            </h3>
            <p class="text-sm opacity-80 line-clamp-2">{{ s.objet }}</p>

            <div class="card-actions justify-between mt-2">
              <NuxtLink class="btn btn-sm btn-primary" :to="`/scrutin/${s.id}`"
                >Voir le scrutin</NuxtLink
              >
              <a
                class="btn btn-sm btn-ghost"
                :href="s.url_source"
                target="_blank"
                rel="noopener"
                >Source</a
              >
            </div>
          </div>
        </li>
      </ul>

      <!-- Pagination bas de page -->
      <div v-if="data?.total" class="mt-6 flex items-center justify-between">
        <div class="text-sm opacity-70">
          Affiche
          {{ ((data.page || 1) - 1) * (data.pageSize || 20) + 1 }}–{{
            Math.min((data.page || 1) * (data.pageSize || 20), data.total || 0)
          }}
          sur {{ data.total || 0 }}
        </div>
        <div class="join">
          <button
            class="btn join-item"
            :disabled="!data.hasPrev"
            @click="goPrev"
          >
            « Précédent
          </button>
          <button class="btn join-item btn-ghost no-animation">
            Page {{ data.page }} / {{ data.pageCount }}
          </button>
          <button
            class="btn join-item"
            :disabled="!data.hasNext"
            @click="goNext"
          >
            Suivant »
          </button>
        </div>
      </div>
    </section>
  </main>
</template>
