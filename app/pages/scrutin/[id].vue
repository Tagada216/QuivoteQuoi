<script setup lang="ts">
import { useRoute } from "vue-router";

type Dec = "POUR" | "CONTRE" | "ABSTENTION" | "NV";
type GroupSlice = {
  id: string;
  acronym: string;
  name: string;
  color: string;
  seats: number;
  counts: Record<Dec, number>;
};
type ScrutinPayload = {
  scrutin: {
    id: number;
    an_id: number;
    date: string;
    type: string | null;
    objet: string;
    legislature_id: number;
    url_source: string;
    dossier: {
      id: number;
      alias: string | null;
      titre_officiel: string | null;
      url_an: string | null;
    } | null;
  };
  totals: {
    POUR: number;
    CONTRE: number;
    ABSTENTION: number;
    NV: number;
    EXPRESSES: number;
    TOTAL: number;
  };
  groups: GroupSlice[];
  deputies: Array<{
    fullName: string;
    slug: string | null;
    groupId: string;
    groupColor: string;
    decision: Dec;
  }>;
};

const route = useRoute();
const { data, pending, error } = await useFetch<ScrutinPayload>(
  `/api/scrutins/${route.params.id}`,
  { key: `scrutins-${route.params.id}` }
);

const title = computed(
  () =>
    data.value?.scrutin.dossier?.alias ||
    data.value?.scrutin.dossier?.titre_officiel ||
    "Scrutin"
);
useHead(() => ({ title: `${title.value} — Scrutin` }));

const groupOrder = [
  "GDR",
  "LFI",
  "EELV",
  "SOC",
  "LIOT",
  "HOR",
  "RE",
  "LR",
  "RN",
  "NI",
];

// Classement par % POUR (sur exprimés)
const groupRanking = computed(() => {
  if (!data.value) return [];
  return [...data.value.groups]
    .map((g) => {
      const expressed = g.counts.POUR + g.counts.CONTRE;
      const pctPour = expressed ? g.counts.POUR / expressed : null;
      return { ...g, expressed, pctPour };
    })
    .sort((a, b) => (b.pctPour ?? -1) - (a.pctPour ?? -1));
});
</script>

<template>
  <main class="container mx-auto px-4 py-8">
    <div v-if="pending" class="text-base-content/70">Chargement…</div>
    <div v-else-if="error" class="alert alert-error">
      <span>Erreur : {{ (error as any)?.message || "inconnue" }}</span>
    </div>
    <template v-else>
      <!-- Header -->
      <header class="mb-6">
        <div class="flex flex-wrap items-center gap-3">
          <h1 class="text-2xl md:text-3xl font-bold">
            {{
              data!.scrutin.dossier?.alias ||
              data!.scrutin.dossier?.titre_officiel ||
              "Scrutin"
            }}
          </h1>
          <span class="badge capitalize">{{
            data!.scrutin.type || "public"
          }}</span>
          <span class="text-sm opacity-70">{{
            new Date(data!.scrutin.date).toLocaleString("fr-FR")
          }}</span>
          <a
            class="btn btn-sm btn-outline"
            :href="data!.scrutin.url_source"
            target="_blank"
            rel="noopener"
            >Source</a
          >
        </div>
        <p class="text-base-content/70 mt-1">
          {{ data!.scrutin.objet }}
        </p>
        <p
          v-if="data!.scrutin.dossier?.titre_officiel && data!.scrutin.dossier?.alias"
          class="text-sm opacity-70"
        >
          Titre officiel : {{ data!.scrutin.dossier!.titre_officiel }}
        </p>
      </header>

      <section class="card bg-base-100 border border-base-300 shadow-md">
        <div class="card-body">
          <h2 class="card-title mb-2">Résultat du vote</h2>

          <!-- STATS en premier (mobile-friendly) -->
          <div
            class="stats stats-vertical sm:stats-horizontal bg-base-200/60 shadow rounded-2xl mb-4"
          >
            <div class="stat">
              <div class="stat-title">Pour</div>
              <div class="stat-value text-success">{{ data!.totals.POUR }}</div>
              <div class="stat-desc">
                {{
                  (
                    (data!.totals.POUR / (data!.totals.EXPRESSES || 1)) *
                    100
                  ).toFixed(0)
                }}% des exprimés
              </div>
            </div>
            <div class="stat">
              <div class="stat-title">Contre</div>
              <div class="stat-value text-error">{{ data!.totals.CONTRE }}</div>
              <div class="stat-desc">
                {{
                  (
                    (data!.totals.CONTRE / (data!.totals.EXPRESSES || 1)) *
                    100
                  ).toFixed(0)
                }}% des exprimés
              </div>
            </div>
            <div class="stat">
              <div class="stat-title">Abstentions</div>
              <div class="stat-value">{{ data!.totals.ABSTENTION }}</div>
              <div class="stat-desc">
                {{
                  (
                    (data!.totals.ABSTENTION / (data!.totals.TOTAL || 1)) *
                    100
                  ).toFixed(0)
                }}% du total
              </div>
            </div>
            <div class="stat">
              <div class="stat-title">Non votants</div>
              <div class="stat-value">{{ data!.totals.NV }}</div>
              <div class="stat-desc">Total {{ data!.totals.TOTAL }}</div>
            </div>
          </div>

          <!-- HÉMICYCLE (remonté légèrement) -->
          <HemicycleScrutinInteractive
            :groups="data!.groups.map(g => ({ id: g.acronym, name: g.name, color: g.color, seats: g.seats }))"
            :deputies="data!.deputies"
            :group-order="groupOrder"
            :lift="28"
          />
        </div>
      </section>

      <!-- Classement par groupe -->
      <section class="mt-8">
        <h2 class="text-xl font-semibold mb-3">
          Classement des groupes (part de “Pour” sur exprimés)
        </h2>
        <div class="grid gap-3 md:grid-cols-2">
          <div
            v-for="g in groupRanking"
            :key="g.id"
            class="card bg-base-100 border border-base-300"
          >
            <div class="card-body py-4">
              <div class="flex items-center justify-between gap-3">
                <div class="flex items-center gap-2">
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
                </div>
                <div class="text-sm opacity-70">
                  {{ g.counts.POUR }} / {{ g.expressed }} exprimés
                </div>
              </div>
              <div class="mt-2 h-2 rounded bg-base-200 overflow-hidden">
                <div
                  class="h-full"
                  :style="{
                    width: ((g.pctPour ?? 0) * 100).toFixed(1) + '%',
                    background: '#16a34a',
                  }"
                ></div>
              </div>
            </div>
          </div>
        </div>
        <p class="text-xs opacity-60 mt-2">
          Lecture : % de “Pour” parmi les votes exprimés (Pour + Contre). Les
          couleurs/positions dans l’hémicycle sont indicatives (par groupes) et
          ne reflètent pas l’assise réelle.
        </p>
      </section>
    </template>
  </main>
</template>
