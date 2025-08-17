<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";

type GroupRow = {
  legislature_id: number;
  group_id: string;
  group_name: string;
  group_color: string;
  scrutins: number;
  nv: number;
  present: number;
  rate: number; // calculé API
};

type DeputyRow = {
  legislature_id: number;
  deputy_id: number;
  full_name: string;
  slug: string | null;
  group_id: string;
  group_name: string;
  group_color: string;
  scrutins: number;
  nv: number;
  present: number;
  rate: number; // calculé API
};

type PayloadGroups = { mode: "groups"; items: GroupRow[]; total: number };
type PayloadDeputies = {
  mode: "deputies";
  items: DeputyRow[];
  page: number;
  pageSize: number;
  total: number;
  pageCount: number;
  hasNext: boolean;
  hasPrev: boolean;
};

const route = useRoute();
const router = useRouter();

const mode = ref<"groups" | "deputies">((route.query.mode as any) || "groups");
const leg = ref<number | null>(route.query.leg ? Number(route.query.leg) : 17);
const sort = ref<string>((route.query.sort as string) || "rate");
const order = ref<"asc" | "desc">(
  ((route.query.order as string) || "desc") as any
);

const q = ref<string>((route.query.q as string) || "");
const group = ref<string | null>((route.query.group as string) || null);

// pagination (députés)
const page = ref(route.query.page ? Math.max(1, Number(route.query.page)) : 1);
const pageSize = ref(
  route.query.pageSize
    ? Math.min(100, Math.max(1, Number(route.query.pageSize)))
    : 30
);

watch([mode, leg, sort, order, q, group, page, pageSize], () => {
  router.replace({
    path: "/absences",
    query: {
      mode: mode.value !== "groups" ? mode.value : undefined,
      leg: leg.value ?? undefined,
      sort: sort.value !== "rate" ? sort.value : undefined,
      order: order.value !== "desc" ? order.value : undefined,
      q: q.value || undefined,
      group: group.value || undefined,
      page:
        mode.value === "deputies" && page.value > 1
          ? String(page.value)
          : undefined,
      pageSize:
        mode.value === "deputies" && pageSize.value !== 30
          ? String(pageSize.value)
          : undefined,
    },
  });
});

// fetch
const fetchKey = computed(
  () =>
    `abs:${mode.value}:${leg.value ?? "all"}:${sort.value}:${order.value}:${
      q.value
    }:${group.value ?? "all"}:${page.value}:${pageSize.value}`
);

const { data, pending, error } = await useFetch<
  PayloadGroups | PayloadDeputies
>("/api/absences", {
  query: computed(() => ({
    mode: mode.value,
    leg: leg.value ?? undefined,
    sort: sort.value,
    order: order.value,
    q: mode.value === "deputies" ? q.value || undefined : undefined,
    group: mode.value === "deputies" ? group.value || undefined : undefined,
    page: mode.value === "deputies" ? page.value : undefined,
    pageSize: mode.value === "deputies" ? pageSize.value : undefined,
  })),
  key: fetchKey,
  watch: [mode, leg, sort, order, q, group, page, pageSize],
});

// helper
function pct(n: number, d: number) {
  return d ? Math.round((n / d) * 100) : 0;
}
</script>

<template>
  <main class="container mx-auto px-4 py-8">
    <header class="mb-6 grid gap-3 lg:grid-cols-[1fr,auto] lg:items-end">
      <div>
        <h1 class="text-2xl md:text-3xl font-extrabold tracking-tight">
          Absences
        </h1>
        <p class="text-base-content/70">
          Classement des non-votants (NV).
          <span class="opacity-80">NV ≠ abstention.</span>
          Le rattachement au groupe suit la date du scrutin.
        </p>
        <p class="text-xs opacity-60">
          La présidente de l’Assemblée est exclue de ces classements.
        </p>
      </div>
      <div class="flex gap-2">
        <div class="join">
          <button
            class="btn join-item"
            :class="mode === 'groups' ? 'btn-primary' : 'btn-ghost'"
            @click="mode = 'groups'"
          >
            Groupes
          </button>
          <button
            class="btn join-item"
            :class="mode === 'deputies' ? 'btn-primary' : 'btn-ghost'"
            @click="mode = 'deputies'"
          >
            Députés
          </button>
        </div>
        <select class="select select-bordered" v-model="leg">
          <option :value="null">XVI + XVII</option>
          <option :value="16">XVI</option>
          <option :value="17">XVII</option>
        </select>
      </div>
    </header>

    <section class="card bg-base-100 border border-base-300 shadow-md">
      <div class="card-body">
        <!-- Contrôles -->
        <div class="flex flex-wrap gap-3 items-end">
          <div class="form-control">
            <label class="label"
              ><span class="label-text font-medium">Tri</span></label
            >
            <select class="select select-bordered" v-model="sort">
              <option value="rate">% d'absences</option>
              <option value="nv">NV (brut)</option>
              <option value="present">Présences</option>
              <option value="scrutins">Scrutins</option>
            </select>
          </div>
          <div class="form-control">
            <label class="label"
              ><span class="label-text font-medium">Ordre</span></label
            >
            <select class="select select-bordered" v-model="order">
              <option value="desc">Décroissant</option>
              <option value="asc">Croissant</option>
            </select>
          </div>

          <template v-if="mode === 'deputies'">
            <div class="form-control grow min-w-[220px]">
              <label class="label"
                ><span class="label-text font-medium">Nom</span></label
              >
              <input
                class="input input-bordered w-full"
                v-model="q"
                placeholder="ex. Durand, Marie…"
              />
            </div>
            <div class="form-control">
              <label class="label"
                ><span class="label-text font-medium">Groupe</span></label
              >
              <select class="select select-bordered" v-model="group">
                <option :value="null">Tous</option>
                <option value="GDR">GDR</option>
                <option value="LFI">LFI</option>
                <option value="EELV">EELV</option>
                <option value="SOC">SOC</option>
                <option value="LIOT">LIOT</option>
                <option value="HOR">HOR</option>
                <option value="RE">RE</option>
                <option value="LR">LR</option>
                <option value="RN">RN</option>
                <option value="NI">NI</option>
              </select>
            </div>
            <div class="form-control">
              <label class="label"
                ><span class="label-text font-medium">Par page</span></label
              >
              <select class="select select-bordered" v-model.number="pageSize">
                <option :value="20">20</option>
                <option :value="30">30</option>
                <option :value="50">50</option>
                <option :value="100">100</option>
              </select>
            </div>
          </template>
        </div>

        <!-- Contenu -->
        <div v-if="pending" class="mt-4 grid gap-3 md:grid-cols-2">
          <div v-for="i in 6" :key="i" class="skeleton h-24 rounded-xl"></div>
        </div>
        <div v-else-if="error" class="alert alert-error mt-4">
          <span>Erreur : {{ (error as any)?.message || "inconnue" }}</span>
        </div>

        <!-- GROUPES -->
        <div
          v-else-if="data && 'items' in data && data.mode === 'groups'"
          class="mt-4 grid gap-3 md:grid-cols-2"
        >
          <article
            v-for="g in (data.items as GroupRow[])"
            :key="g.group_id"
            class="card border border-base-300"
          >
            <div class="card-body py-4">
              <div class="flex items-center justify-between gap-3">
                <div class="flex items-center gap-2">
                  <span
                    class="badge"
                    :style="{
                      background: g.group_color,
                      color: '#fff',
                      borderColor: 'transparent',
                    }"
                  >
                    {{ g.group_id }}
                  </span>
                  <span class="font-medium">{{ g.group_name }}</span>
                </div>
                <div class="text-sm opacity-70">{{ g.scrutins }} scrutins</div>
              </div>
              <div class="mt-2 h-2 rounded bg-base-200 overflow-hidden">
                <div
                  class="h-full"
                  :style="{
                    width: pct(g.nv, g.scrutins) + '%',
                    background: '#ef4444',
                  }"
                ></div>
              </div>
              <div class="mt-1 text-sm">
                <span class="font-semibold">{{ pct(g.nv, g.scrutins) }}%</span>
                <span class="opacity-70"> d'absences ({{ g.nv }} NV)</span>
              </div>
            </div>
          </article>
        </div>

        <!-- DÉPUTÉS -->
        <div
          v-else-if="data && 'items' in data && data.mode === 'deputies'"
          class="mt-4"
        >
          <div class="text-sm opacity-70 mb-2">
            {{
              (data as PayloadDeputies).total
                ? `Affiche ${
                    ((data as PayloadDeputies).page - 1) *
                      (data as PayloadDeputies).pageSize +
                    1
                  }
                  – ${Math.min(
                    (data as PayloadDeputies).page *
                      (data as PayloadDeputies).pageSize,
                    (data as PayloadDeputies).total
                  )}
                  sur ${(data as PayloadDeputies).total}`
                : "0 résultat"
            }}
          </div>

          <ul class="divide-y divide-base-300">
            <li
              v-for="d in (data.items as DeputyRow[])"
              :key="d.deputy_id"
              class="py-3 flex items-center justify-between gap-3"
            >
              <div class="min-w-0">
                <div class="flex items-center gap-2">
                  <NuxtLink
                    :to="d.slug ? `/depute/${d.slug}` : '#'"
                    class="font-medium hover:underline truncate"
                  >
                    {{ d.full_name }}
                  </NuxtLink>
                  <span
                    class="badge"
                    :style="{
                      background: d.group_color,
                      color: '#fff',
                      borderColor: 'transparent',
                    }"
                  >
                    {{ d.group_id }}
                  </span>
                </div>
                <div class="text-sm opacity-70">
                  {{ d.nv }} NV · {{ d.present }} présents ·
                  {{ d.scrutins }} scrutins
                </div>
              </div>
              <div class="w-40">
                <div class="h-2 rounded bg-base-200 overflow-hidden">
                  <div
                    class="h-full"
                    :style="{
                      width: pct(d.nv, d.scrutins) + '%',
                      background: '#ef4444',
                    }"
                  ></div>
                </div>
                <div class="text-right text-sm mt-0.5">
                  <span class="font-semibold"
                    >{{ pct(d.nv, d.scrutins) }}%</span
                  >
                </div>
              </div>
            </li>
          </ul>

          <div class="mt-4 flex items-center justify-end gap-2">
            <div class="join">
              <button
                class="btn join-item"
                :disabled="!(data as PayloadDeputies).hasPrev"
                @click="page = (data as PayloadDeputies).page - 1"
              >
                « Précédent
              </button>
              <button class="btn join-item btn-ghost no-animation">
                Page {{ (data as PayloadDeputies).page }} /
                {{ (data as PayloadDeputies).pageCount }}
              </button>
              <button
                class="btn join-item"
                :disabled="!(data as PayloadDeputies).hasNext"
                @click="page = (data as PayloadDeputies).page + 1"
              >
                Suivant »
              </button>
            </div>
          </div>
        </div>

        <p class="mt-4 text-xs opacity-60">
          Note : “NV” (non-votants) inclut les non-votants volontaires.
          L’abstention n’est pas une absence.
        </p>
      </div>
    </section>
  </main>
</template>
