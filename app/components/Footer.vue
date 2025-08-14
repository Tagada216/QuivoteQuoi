<script setup lang="ts">
const props = withDefaults(
  defineProps<{ lastImport?: string | Date | null }>(),
  { lastImport: null }
);

const lastImportText = computed(() => {
  if (!props.lastImport) return "—";
  const d = new Date(props.lastImport);
  return isNaN(d.getTime())
    ? "—"
    : d.toLocaleString("fr-FR", { dateStyle: "long", timeStyle: "short" });
});
</script>

<template>
  <!-- not-prose: évite tout héritage de styles .prose qui gonflent les <img>/<a> -->
  <footer
    class="not-prose bg-base-200 border-t border-base-300 mt-16"
    role="contentinfo"
  >
    <div
      class="container mx-auto px-4 py-10 grid gap-8 md:grid-cols-3 items-start"
    >
      <!-- Marque -->
      <div class="space-y-3">
        <div class="flex items-center gap-3">
          <!-- Icône STRICTEMENT bornée -->
          <img
            src="/branding/icon.svg"
            alt=""
            width="36"
            height="36"
            class="footer-logo rounded-lg object-contain shrink-0"
            aria-hidden="true"
          />
          <span class="text-lg font-semibold tracking-tight">QuiVoteQuoi</span>
        </div>
        <p class="text-sm text-base-content/70 max-w-sm">
          Les votes, en clair. Visualisations pédagogiques et sourcées des
          scrutins publics nominatifs.
        </p>
      </div>

      <!-- Navigation -->
      <nav
        aria-label="Liens de pied de page"
        class="grid sm:grid-cols-2 gap-2 md:justify-items-start"
      >
        <NuxtLink to="/" class="link link-hover">Accueil</NuxtLink>
        <NuxtLink to="/methodologie" class="link link-hover"
          >Méthodologie</NuxtLink
        >
        <NuxtLink to="/sources" class="link link-hover">Sources</NuxtLink>
        <!-- Ajoute plus tard : Mentions, À propos, etc. -->
      </nav>

      <!-- Données -->
      <div class="space-y-2 md:justify-self-end">
        <h3 class="text-xs font-semibold uppercase tracking-wide opacity-70">
          Données
        </h3>
        <p class="text-sm">
          Dernier import : <span class="font-medium">{{ lastImportText }}</span>
        </p>
        <p class="text-sm">
          Fréquence :
          <span class="font-medium">00:00 & 12:00 (Europe/Paris)</span>
        </p>
        <p class="text-sm">
          Source principale :
          <a
            class="link"
            href="https://data.assemblee-nationale.fr/"
            target="_blank"
            rel="noopener"
          >
            data.assemblee-nationale.fr
          </a>
        </p>
      </div>
    </div>

    <div class="border-t border-base-300">
      <div
        class="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-3"
      >
        <p class="text-xs text-base-content/60">
          © {{ new Date().getFullYear() }} QuiVoteQuoi — Visualisation à
          vocation pédagogique.
        </p>
        <div class="flex items-center gap-4">
          <a
            href="https://github.com/Tagada216"
            target="_blank"
            rel="noopener"
            aria-label="GitHub"
            class="opacity-70 hover:opacity-100 transition-opacity"
          >
            <svg
              viewBox="0 0 24 24"
              class="w-5 h-5 fill-current"
              aria-hidden="true"
            >
              <path
                d="M12 .5a12 12 0 0 0-3.79 23.4c.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.41-4.04-1.41-.55-1.4-1.34-1.78-1.34-1.78-1.09-.75.08-.73.08-.73 1.2.09 1.83 1.23 1.83 1.23 1.07 1.83 2.8 1.3 3.48.99.11-.78.42-1.3.77-1.6-2.67-.3-5.48-1.34-5.48-5.98 0-1.32.47-2.4 1.23-3.25-.12-.3-.53-1.52.12-3.17 0 0 1.01-.32 3.3 1.24a11.46 11.46 0 0 1 6 0c2.29-1.56 3.3-1.24 3.3-1.24.65 1.65.24 2.87.12 3.17.77.85 1.23 1.93 1.23 3.25 0 4.66-2.81 5.67-5.49 5.97.43.38.82 1.12.82 2.26v3.35c0 .32.22.7.83.58A12 12 0 0 0 12 .5z"
              />
            </svg>
          </a>
          <a
            href="https://x.com/linconun10"
            target="_blank"
            rel="noopener"
            aria-label="X / Twitter"
            class="opacity-70 hover:opacity-100 transition-opacity"
          >
            <svg
              viewBox="0 0 24 24"
              class="w-5 h-5 fill-current"
              aria-hidden="true"
            >
              <path
                d="M18.244 2H21l-6.51 7.44L22 22h-6.09l-4.76-6.2L5.64 22H3l7.02-8.03L2 2h6.19l4.31 5.64L18.244 2Zm-2.13 18h1.18L7.94 4H6.7l9.414 16Z"
              />
            </svg>
          </a>
          <a
            href="#"
            class="text-xs link"
            @click.prevent="window?.scrollTo({ top: 0, behavior: 'smooth' })"
            >Haut de page</a
          >
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
/* Clamp absolu de l’icône pour éviter qu’un SVG “têtu” s’étire */
.footer-logo {
  width: 2.25rem;
  height: 2.25rem;
  display: block;
}
</style>
