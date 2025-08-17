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

const scrollToTop = () => {
  window?.scrollTo({ top: 0, behavior: "smooth" });
};
</script>

<template>
  <footer
    class="not-prose bg-stone-50 border-t-4 border-black mt-16"
    role="contentinfo"
  >
    <div
      class="container mx-auto px-4 py-12 grid gap-8 md:grid-cols-3 items-start"
    >
      <div class="space-y-4">
        <div class="flex items-center gap-4">
          <div
            class="w-12 h-12 bg-black rounded-xl border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] grid place-items-center"
          >
            <img
              src="/branding/icon.svg"
              alt=""
              width="24"
              height="24"
              class="footer-logo object-contain shrink-0 invert"
              aria-hidden="true"
            />
          </div>
          <span class="text-2xl font-black tracking-tight text-black"
            >QuiVoteQuoi</span
          >
        </div>
        <p class="text-lg text-gray-800 max-w-sm font-medium leading-relaxed">
          Les votes, en clair. Visualisations pédagogiques et sourcées des
          scrutins publics nominatifs.
        </p>
      </div>

      <nav
        aria-label="Liens de pied de page"
        class="grid sm:grid-cols-2 gap-3 md:justify-items-start"
      >
        <NuxtLink
          to="/"
          class="text-black font-bold hover:text-blue-600 transition-colors border-b-2 border-transparent hover:border-blue-600 pb-1"
        >
          Accueil
        </NuxtLink>
        <NuxtLink
          to="/methodologie"
          class="text-black font-bold hover:text-blue-600 transition-colors border-b-2 border-transparent hover:border-blue-600 pb-1"
        >
          Méthodologie
        </NuxtLink>
        <NuxtLink
          to="/sources"
          class="text-black font-bold hover:text-blue-600 transition-colors border-b-2 border-transparent hover:border-blue-600 pb-1"
        >
          Sources
        </NuxtLink>
      </nav>

      <div class="space-y-3 md:justify-self-end">
        <h3
          class="text-sm font-black uppercase tracking-wide text-black border-b-2 border-black pb-2"
        >
          Données
        </h3>
        <div
          class="bg-white/50 p-4 rounded-xl border-2 border-black/20 space-y-2"
        >
          <p class="text-sm text-black">
            Dernier import :
            <span class="font-black">{{ lastImportText }}</span>
          </p>
          <p class="text-sm text-black">
            Fréquence :
            <span class="font-black">00:00 & 12:00 (Europe/Paris)</span>
          </p>
          <p class="text-sm text-black">
            Source principale :
            <a
              class="font-black text-blue-600 hover:text-blue-800 underline"
              href="https://data.assemblee-nationale.fr/"
              target="_blank"
              rel="noopener"
            >
              data.assemblee-nationale.fr
            </a>
          </p>
        </div>
      </div>
    </div>

    <div class="border-t-3 border-black bg-black">
      <div
        class="container mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        <p class="text-sm text-white font-bold">
          © {{ new Date().getFullYear() }} QuiVoteQuoi — Visualisation à
          vocation pédagogique.
        </p>
        <div class="flex items-center gap-6">
          <a
            href="https://github.com/Tagada216"
            target="_blank"
            rel="noopener"
            aria-label="GitHub"
            class="w-8 h-8 bg-white rounded-lg hover:bg-gray-200 transition-colors grid place-items-center"
          >
            <svg
              viewBox="0 0 24 24"
              class="w-5 h-5 fill-black"
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
            class="w-8 h-8 bg-white rounded-lg hover:bg-gray-200 transition-colors grid place-items-center"
          >
            <svg
              viewBox="0 0 24 24"
              class="w-5 h-5 fill-black"
              aria-hidden="true"
            >
              <path
                d="M18.244 2H21l-6.51 7.44L22 22h-6.09l-4.76-6.2L5.64 22H3l7.02-8.03L2 2h6.19l4.31 5.64L18.244 2Zm-2.13 18h1.18L7.94 4H6.7l9.414 16Z"
              />
            </svg>
          </a>
          <button
            class="text-sm font-bold text-white hover:text-gray-300 underline transition-colors"
            @click="scrollToTop"
          >
            Haut de page
          </button>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer-logo {
  width: 1.5rem;
  height: 1.5rem;
  display: block;
}
</style>
