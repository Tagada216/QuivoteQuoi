<script setup lang="ts">
useHead({ title: "Sources & licences — QuiVoteQuoi" });
const sources = [
  {
    title: "Données publiques — Assemblée nationale",
    url: "https://data.assemblee-nationale.fr/",
    desc: "Scrutins publics nominatifs, informations sur les députés et groupes, métadonnées législatives.",
  },
  {
    title: "Site de l'Assemblée nationale",
    url: "https://www.assemblee-nationale.fr/",
    desc: "Pages officielles des scrutins et dossiers législatifs, documents de séance.",
  },
  {
    title: "Légifrance",
    url: "https://www.legifrance.gouv.fr/",
    desc: "Dossiers et textes de loi consolidés (référence juridique).",
  },
];
</script>

<template>
  <main class="container mx-auto px-4 py-8">
    <header
      class="mb-8 relative bg-stone-50 border-4 border-black rounded-3xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
    >
      <div
        class="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none"
      ></div>
      <div class="relative p-8">
        <h1
          class="text-4xl md:text-5xl font-black tracking-tight text-black mb-4"
        >
          Sources & licences
        </h1>
        <p class="text-lg text-gray-700 font-medium">
          Tout ce que nous affichons renvoie vers une source officielle.
        </p>
      </div>
    </header>

    <section class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
      <article
        v-for="s in sources"
        :key="s.url"
        class="relative bg-stone-50 border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden transition-all duration-150 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1"
      >
        <div
          class="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none"
        ></div>
        <div class="relative p-6">
          <h2 class="text-xl font-black text-black mb-3">{{ s.title }}</h2>
          <p class="text-gray-700 font-medium text-sm mb-4">{{ s.desc }}</p>
          <a
            :href="s.url"
            target="_blank"
            rel="noopener"
            class="btn bg-blue-500 hover:bg-blue-600 text-white border-3 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-150 active:translate-x-1 active:translate-y-1 active:shadow-none"
          >
            Ouvrir
          </a>
        </div>
      </article>
    </section>

    <section class="mb-8">
      <div
        class="relative bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
      >
        <div class="p-8">
          <h2 class="text-2xl font-black text-black mb-6">
            Attribution & licences
          </h2>
          <ul class="space-y-4 text-gray-800">
            <li class="flex items-start gap-2">
              <span class="font-black text-black">•</span>
              <span>
                Les données publiques citées ci-dessus sont réutilisées sous les
                termes de la
                <strong class="text-black">Licence Ouverte</strong> ou licences
                publiques équivalentes des administrations concernées.
              </span>
            </li>
            <li class="flex items-start gap-2">
              <span class="font-black text-black">•</span>
              <span>
                Nous indiquons un
                <strong class="text-black">lien source</strong> au plus près de
                chaque visualisation (badge "Source").
              </span>
            </li>
            <li class="flex items-start gap-2">
              <span class="font-black text-black">•</span>
              <span>
                Les contenus éditoriaux (alias, résumés, méthodologie) sont ©
                QuiVoteQuoi, sauf mention contraire.
              </span>
            </li>
          </ul>
          <p
            class="text-sm text-gray-600 bg-gray-100 p-4 rounded-xl border-2 border-gray-300 mt-6"
          >
            Visualisation à vocation pédagogique ; pour toute interprétation
            juridique, référez-vous aux textes officiels.
          </p>
        </div>
      </div>
    </section>

    <section>
      <div
        class="relative bg-stone-50 border-4 border-dashed border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
      >
        <div
          class="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none"
        ></div>
        <div class="relative p-8">
          <h2 class="text-2xl font-black text-black mb-4">
            Traçabilité technique
          </h2>
          <p class="text-gray-700 font-medium mb-4">
            Chaque import est journalisé (source, horodatage, hash, volumes).
            Une page interne "Santé des données" permet de consulter le dernier
            import et l'état des agrégats.
          </p>
          <p
            class="text-sm text-gray-600 bg-white/50 p-4 rounded-xl border-2 border-black/20"
          >
            TODO : brancher l'affichage public de la date du dernier import une
            fois l'ETL en place.
          </p>
        </div>
      </div>
    </section>
  </main>
</template>
