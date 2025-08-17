<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";

type Theme = { slug: string; name: string };
type Row = {
  groupId: string;
  acronym: string;
  name: string;
  color: string;
  score: number | null; // 0..1
  expressedVotes: number; // nb de POUR+CONTRE
};

const route = useRoute();
const router = useRouter();

/* ---------- État depuis l’URL ---------- */
const initialLeg = route.query.leg ? Number(route.query.leg) : 17;
const leg = ref<number | null>(Number.isFinite(initialLeg) ? initialLeg : 17);

const invert = ref<boolean>(route.query.order === "asc"); // "asc" = moins favorables d'abord
const themeFromUrl = (route.query.theme as string) || "ecologie";

/* ---------- Thèmes ---------- */
const { data: themes } = await useFetch<Theme[]>("/api/themes", {
  key: "themes-list",
});

const theme = ref<string>(themeFromUrl);
watchEffect(() => {
  if (!themes.value?.length) return;
  if (!themes.value.some((t) => t.slug === theme.value)) {
    theme.value = themes.value[0]?.slug ?? "";
  }
});
const selectedThemeName = computed(
  () => themes.value?.find((t) => t.slug === theme.value)?.name ?? "Thème"
);

/* ---------- Données de classement ---------- */
/** Clé de cache nuxt */
const fetchKey = computed(() => `rank:${theme.value}:${leg.value ?? "all"}`);

/** On accepte:
 *  - tableau direct: Row[]
 *  - objet: { category, rankings: Row[] | Record<string, Row> }
 */
const {
  data: rankingRaw,
  pending,
  error,
} = await useFetch<any>(() => `/api/rankings/${theme.value}`, {
  query: computed(() => ({ leg: leg.value ?? undefined })), // param "leg"
  key: fetchKey,
  watch: [theme, leg],
});

/** Normalisation → toujours un tableau de Row */
const rankingRows = computed<Row[]>(() => {
  const raw = rankingRaw.value;
  if (!raw) return [];
  if (Array.isArray(raw)) return raw as Row[];
  const r = raw.rankings;
  if (Array.isArray(r)) return r as Row[];
  if (r && typeof r === "object") return Object.values(r) as Row[];
  return [];
});

/* ---------- Tri final ---------- */
const rows = computed(() => {
  const base = rankingRows.value.slice();
  base.sort((a, b) => {
    const aa = a.score ?? -1;
    const bb = b.score ?? -1;
    return invert.value ? aa - bb : bb - aa;
  });
  return base;
});

/* ---------- URL shareable ---------- */
watch([theme, leg, invert], () => {
  router.replace({
    path: "/classements",
    query: {
      theme: theme.value || undefined,
      leg: leg.value ?? undefined,
      order: invert.value ? "asc" : undefined,
    },
  });
});

/* ---------- Head ---------- */
useHead(() => ({
  title: `Classements — ${selectedThemeName.value} · QuiVoteQuoi`,
}));
</script>

<template>
  <main class="container mx-auto px-4 py-8">
    <header class="mb-6 grid gap-4 lg:grid-cols-[1fr,auto] lg:items-end">
      <div
        class="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center"
      >
        <select class="select select-bordered w-full lg:w-auto" v-model="leg">
          <option :value="null">XVI + XVII</option>
          <option :value="16">XVI</option>
          <option :value="17">XVII</option>
        </select>

        <select class="select select-bordered w-full lg:w-auto" v-model="theme">
          <option v-for="t in themes || []" :key="t.slug" :value="t.slug">
            {{ t.name }}
          </option>
        </select>

        <button
          class="btn w-full lg:w-auto"
          :class="invert ? 'btn-warning' : 'btn-ghost'"
          @click="invert = !invert"
        >
          {{
            invert ? "Voir les plus favorables" : "Voir les moins favorables"
          }}
        </button>
      </div>
    </header>

    <section>
      <div v-if="pending" class="grid gap-3 md:grid-cols-2">
        <div v-for="i in 6" :key="i" class="skeleton h-24 rounded-xl"></div>
      </div>

      <div v-else-if="error" class="alert alert-error">
        <span>Erreur lors du chargement du classement.</span>
      </div>

      <div v-else class="grid gap-3 md:grid-cols-2">
        <article
          v-for="r in rows"
          :key="r.groupId"
          class="card bg-base-100 border border-base-300"
        >
          <div class="card-body py-4">
            <div class="flex items-center justify-between gap-3">
              <div class="flex items-center gap-2">
                <span
                  class="badge"
                  :style="{
                    background: r.color,
                    color: '#fff',
                    borderColor: 'transparent',
                  }"
                  >{{ r.acronym }}</span
                >
                <span class="font-medium">{{ r.name }}</span>
              </div>
              <div class="text-sm opacity-70">
                {{ r.expressedVotes }} exprimés
              </div>
            </div>

            <div class="mt-2 h-2 rounded bg-base-200 overflow-hidden">
              <div
                class="h-full bg-success"
                :style="{
                  width: (Math.max(0, r.score ?? 0) * 100).toFixed(0) + '%',
                }"
              />
            </div>

            <div class="mt-1 text-sm">
              <span class="font-semibold">
                {{ ((r.score ?? 0) * 100).toFixed(0) }}%
              </span>
              <span class="opacity-70">
                pro-{{ selectedThemeName.toLowerCase() }}
              </span>
            </div>
          </div>
        </article>

        <p v-if="rows.length === 0" class="opacity-70">
          Aucun résultat pour ce filtre.
        </p>
      </div>
    </section>

    <p class="text-xs opacity-60 mt-6">
      Méthode : score = (Pour sur scrutins positifs + Contre sur scrutins
      négatifs) / (Pour + Contre). Abstentions et non-votants exclus du
      dénominateur.
    </p>
  </main>
</template>
