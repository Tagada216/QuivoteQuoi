<script setup lang="ts">
import type { GroupSeatInput } from "../../types/ui";
type HemiHomeResp = {
  groups: Array<{ id: string; name: string; color: string; seats: number }>;
  deputies: Array<{
    fullName: string;
    slug: string | null;
    groupId: string;
    groupColor: string;
  }>;
  legend: Array<{ id: string; name: string; color: string; count: number }>;
  usedPlaceholder: boolean;
};

const { data: hemiHome } = await useFetch<HemiHomeResp>(
  "/api/hemicycle/deputies",
  {
    query: { legislature: 17 },
    key: "hemi-home-17",
  }
);

const IDEO_RANK: Record<string, number> = {
  GDR: 10,
  LFI: 20,
  "LFI-NFP": 20,
  EELV: 30,
  ECOS: 30,
  SOC: 40,
  PS: 40,
  LIOT: 50,
  DEM: 58,
  MODEM: 58,
  HOR: 60,
  RE: 70,
  EPR: 70,
  ENS: 70,
  DR: 75,
  LR: 80,
  UDR: 85,
  RN: 90,
  NI: 95,
};

const legendOrder = computed(() => {
  const ids = (hemiHome.value?.legend ?? []).map((g) => g.id);
  return ids.sort(
    (a, b) => (IDEO_RANK[a] ?? 60) - (IDEO_RANK[b] ?? 60) || a.localeCompare(b)
  );
});

type HemiResponse = {
  usedPlaceholder: boolean;
  groups: GroupSeatInput[];
};

const query = ref({
  q: "",
  legislature: null as 16 | 17 | null,
  theme: "tous" as const,
  type: "tous" as const,
});

const { data, pending, error } = await useFetch<HemiResponse>(
  "/api/groups/hemicycle",
  {
    query: { legislature: 17 },
    key: "hemicycle-17",
  }
);

const hemiGroups = computed<GroupSeatInput[]>(() => data.value?.groups ?? []);
const usedPlaceholder = computed(() => data.value?.usedPlaceholder === true);

const router = useRouter();
function onSearch() {
  router.push({
    path: "/search",
    query: {
      q: query.value.q || "",
      leg: query.value.legislature ?? undefined,
      type: query.value.type,
    },
  });
}

type LatestItem = {
  id: number;
  date: string;
  type: string | null;
  url_source: string | null;
  title: string;
  subtitle?: string | null;
  counts: { POUR: number; CONTRE: number; ABSTENTION: number; NV: number };
};
type LatestResponse = { items: LatestItem[] };

const {
  data: latest,
  pending: latestLoading,
  error: latestErr,
} = await useFetch<LatestResponse>("/api/scrutins/latest", {
  query: { limit: 3, legislature: 17 },
  key: "latest-17",
});
</script>

<template>
  <div class="min-h-screen bg-stone-50">
    <HeroBrand tagline="Les votes, en clair" />

    <SearchControls v-model="query" @search="onSearch" />

    <div v-if="usedPlaceholder" class="container mx-auto px-4 mt-6">
      <div
        class="bg-blue-100 border-4 border-blue-500 rounded-2xl p-6 shadow-[8px_8px_0px_0px_rgba(59,130,246,1)]"
      >
        <span class="font-black text-blue-800">
          Données partielles : certains sièges sont estimés (placeholders) en
          attendant l'import complet.
        </span>
      </div>
    </div>

    <section class="container mx-auto px-4 mt-8">
      <h2 class="text-2xl font-black text-black mb-6">Derniers votes</h2>

      <div
        v-if="latestLoading"
        class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        <div
          v-for="i in 3"
          :key="i"
          class="bg-gray-200 h-48 rounded-2xl border-3 border-gray-400 animate-pulse"
        ></div>
      </div>

      <div
        v-else-if="latestErr"
        class="bg-red-100 border-4 border-red-500 rounded-2xl p-6 shadow-[8px_8px_0px_0px_rgba(239,68,68,1)]"
      >
        <span class="font-black text-red-800"
          >Impossible de charger les derniers votes.</span
        >
      </div>

      <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <ScrutinCard
          v-for="it in latest?.items || []"
          :key="it.id"
          :item="it"
        />
        <div
          v-if="(latest?.items?.length ?? 0) === 0"
          class="relative bg-stone-50 border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
        >
          <div
            class="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none"
          ></div>
          <div class="relative p-6">
            <p class="font-bold text-gray-700">Aucun scrutin pour le moment.</p>
          </div>
        </div>
      </div>
    </section>

    <section
      v-if="hemiHome?.legend?.length"
      class="container mx-auto px-4 mt-8"
    >
      <div class="flex flex-wrap gap-3 items-center">
        <span
          v-for="g in hemiHome.legend"
          :key="g.id"
          class="px-3 py-2 rounded-xl font-black text-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
          :style="{
            background: g.color,
          }"
        >
          {{ g.id }} — {{ g.count }}
        </span>
      </div>
    </section>

    <div class="container mx-auto px-4 mt-8">
      <HemicycleHomeInteractive
        v-if="hemiHome"
        :groups="hemiHome.groups"
        :deputies="hemiHome.deputies"
        :group-order="legendOrder"
        :lift="28"
      />
    </div>

    <DataSourceNotice class="mt-8" />
  </div>
</template>
