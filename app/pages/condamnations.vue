<script setup lang="ts">
type Row = {
  id: number;
  deputy_id: number;
  full_name: string;
  slug: string | null;
  title: string;
  decision_date: string | null;
  status: string;
  source_url: string;
  group_id: string | null;
  group_name: string | null;
  group_color: string | null;
};

const q = ref<string>("");
const group = ref<string | null>(null);

// Charger la liste des groupes pour le filtre
const { data: groups } = await useFetch<
  { acronym: string; name: string; color: string }[]
>("/api/groups", {
  key: "groups-for-condamns",
});

// Données
const key = computed(() => `condamns:${q.value}:${group.value ?? "all"}`);
const { data, pending, error } = await useFetch<Row[]>("/api/condamnations", {
  query: computed(() => ({
    q: q.value || undefined,
    group: group.value || undefined,
  })),
  key,
  watch: [q, group],
});

useHead({ title: "Condamnations — QuiVoteQuoi" });
</script>

<template>
  <main class="container mx-auto px-4 py-8">
    <header class="mb-6">
      <h1 class="text-2xl md:text-3xl font-extrabold tracking-tight">
        Condamnations
      </h1>
      <p class="text-base-content/70">
        Synthèse publique et sourcée des décisions de justice citées dans les
        médias. <NuxtLink to="/sources" class="link">Sources</NuxtLink>.
      </p>
    </header>

    <!-- Contrôles -->
    <div class="grid gap-3 sm:grid-cols-[1fr,260px] items-end mb-6">
      <div class="form-control">
        <label class="label"
          ><span class="label-text font-medium">Recherche</span></label
        >
        <input
          v-model="q"
          class="input input-bordered w-full"
          placeholder="Nom, mot-clé, juridiction…"
        />
      </div>
      <div class="form-control">
        <label class="label"
          ><span class="label-text font-medium">Groupe</span></label
        >
        <select v-model="group" class="select select-bordered w-full">
          <option :value="null">Tous</option>
          <option v-for="g in groups || []" :key="g.acronym" :value="g.acronym">
            {{ g.acronym }} — {{ g.name }}
          </option>
        </select>
      </div>
    </div>

    <!-- Liste -->
    <div v-if="pending" class="grid gap-3">
      <div v-for="i in 6" :key="i" class="skeleton h-24 rounded-xl"></div>
    </div>
    <div v-else-if="error" class="alert alert-error">
      <span>Erreur de chargement.</span>
    </div>

    <ul v-else class="space-y-3">
      <li
        v-for="r in data || []"
        :key="r.id"
        class="card bg-base-100 border border-base-300"
      >
        <div class="card-body py-4">
          <div class="flex items-center justify-between gap-3">
            <div class="flex items-center gap-2">
              <NuxtLink
                :to="r.slug ? `/depute/${r.slug}` : '#'"
                class="font-semibold hover:underline"
              >
                {{ r.full_name }}
              </NuxtLink>
              <span
                v-if="r.group_id"
                class="badge"
                :style="{
                  background: r.group_color || '#666',
                  color: '#fff',
                  borderColor: 'transparent',
                }"
              >
                {{ r.group_id }}
              </span>
            </div>
            <div class="text-sm opacity-70">
              {{
                r.decision_date
                  ? new Date(r.decision_date).toLocaleDateString("fr-FR")
                  : "—"
              }}
            </div>
          </div>

          <p class="text-sm mt-1">
            {{ r.title }}
          </p>

          <div class="text-xs opacity-70 flex items-center gap-3 pt-1">
            <span class="badge badge-ghost">{{ r.status }}</span>
            <a
              :href="r.source_url"
              target="_blank"
              rel="noopener"
              class="link link-primary"
              >Source</a
            >
          </div>
        </div>
      </li>

      <li v-if="(data?.length ?? 0) === 0" class="alert">
        <span>Aucun résultat.</span>
      </li>
    </ul>
  </main>
</template>
