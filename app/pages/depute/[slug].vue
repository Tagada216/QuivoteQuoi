<script setup lang="ts">
import { useRoute } from "vue-router";

type Payload = {
  deputy: {
    id: number;
    an_id: number | null;
    full_name: string;
    slug: string;
    circ: number | null;
    departement: string | null;
    photo_url: string | null;
    legislature_id: number;
  };
  group: { acronym: string; name: string; color: string } | null;
  votes: Array<{
    decision: "POUR" | "CONTRE" | "ABSTENTION" | "NV";
    scrutin: {
      id: number;
      date: string;
      type: string | null;
      objet: string;
      dossier: { alias: string | null; titre_officiel: string | null } | null;
    };
  }>;
};

const route = useRoute();
const { data, pending, error } = await useFetch<Payload>(
  `/api/depute/${route.params.slug}`,
  { key: `dep-${route.params.slug}` }
);

// Toggle photo : mémorisé localement (clé partagée avec /deputes si tu veux)
const showPhoto = useState<boolean>("qvq_show_photo", () => true);
onMounted(() => {
  try {
    const raw = localStorage.getItem("qvq_show_photo");
    if (raw !== null) showPhoto.value = raw === "1";
  } catch {}
});
watch(showPhoto, (v) => {
  try {
    localStorage.setItem("qvq_show_photo", v ? "1" : "0");
  } catch {}
});

// Couleurs pour la liste des votes
const col = {
  POUR: "#16a34a",
  CONTRE: "#dc2626",
  ABSTENTION: "#f59e0b",
  NV: "#9CA3AF",
} as const;
</script>

<template>
  <main class="container mx-auto px-4 py-8">
    <div v-if="pending">Chargement…</div>
    <div v-else-if="error" class="alert alert-error">
      <span>Erreur : {{ (error as any)?.message }}</span>
    </div>

    <template v-else>
      <!-- Tuile hero -->
      <DeputyHeroCard
        :name="data!.deputy.full_name"
        :group="data!.group"
        :departement="data!.deputy.departement"
        :circ="data!.deputy.circ"
        :photo-url="data!.deputy.photo_url"
        :an-id="data!.deputy.an_id || null"
        v-model:showPhoto="showPhoto"
      />

      <!-- Derniers votes -->
      <section class="mt-6">
        <h2 class="text-xl font-semibold mb-3">Derniers votes</h2>

        <div v-if="(data!.votes?.length ?? 0) === 0" class="alert">
          <span>Aucun vote enregistré pour l’instant.</span>
        </div>

        <ul
          v-else
          class="divide-y divide-base-300 rounded-xl border border-base-300 bg-base-100"
        >
          <li
            v-for="v in data!.votes"
            :key="v.scrutin.id"
            class="p-3 flex items-start gap-3"
          >
            <span
              class="w-2.5 h-2.5 rounded-full mt-2"
              :style="{ background: col[v.decision] }"
            ></span>
            <div class="min-w-0">
              <NuxtLink
                class="font-medium hover:underline"
                :to="`/scrutin/${v.scrutin.id}`"
              >
                {{
                  v.scrutin.dossier?.alias ||
                  v.scrutin.dossier?.titre_officiel ||
                  v.scrutin.objet
                }}
              </NuxtLink>
              <div class="text-sm opacity-70">
                {{ new Date(v.scrutin.date).toLocaleString("fr-FR") }}
                · {{ v.scrutin.type || "public" }} · décision:
                {{ v.decision.toLowerCase() }}
              </div>
            </div>
          </li>
        </ul>
      </section>
    </template>
  </main>
</template>
