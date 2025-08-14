<script setup lang="ts">
useHead({ title: "Sources & licences — QuiVoteQuoi" });
const sources = [
  {
    title: "Données publiques — Assemblée nationale",
    url: "https://data.assemblee-nationale.fr/",
    desc: "Scrutins publics nominatifs, informations sur les députés et groupes, métadonnées législatives.",
  },
  {
    title: "Site de l’Assemblée nationale",
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
    <header class="mb-6">
      <h1 class="text-3xl md:text-4xl font-extrabold tracking-tight">
        Sources & licences
      </h1>
      <p class="text-base-content/70">
        Tout ce que nous affichons renvoie vers une source officielle.
      </p>
    </header>

    <section class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <article
        v-for="s in sources"
        :key="s.url"
        class="card bg-base-200/70 border border-base-300"
      >
        <div class="card-body">
          <h2 class="card-title text-lg">{{ s.title }}</h2>
          <p class="text-sm opacity-80">{{ s.desc }}</p>
          <a
            :href="s.url"
            target="_blank"
            rel="noopener"
            class="btn btn-sm btn-outline mt-2"
            >Ouvrir</a
          >
        </div>
      </article>
    </section>

    <section class="mt-8">
      <div class="card bg-base-100 border border-base-300">
        <div class="card-body">
          <h2 class="card-title">Attribution & licences</h2>
          <ul class="list-disc ml-5">
            <li>
              Les données publiques citées ci-dessus sont réutilisées sous les
              termes de la
              <strong>Licence Ouverte</strong> ou licences publiques
              équivalentes des administrations concernées.
            </li>
            <li>
              Nous indiquons un <strong>lien source</strong> au plus près de
              chaque visualisation (badge “Source”).
            </li>
            <li>
              Les contenus éditoriaux (alias, résumés, méthodologie) sont ©
              QuiVoteQuoi, sauf mention contraire.
            </li>
          </ul>
          <p class="text-sm opacity-70 mt-2">
            Visualisation à vocation pédagogique ; pour toute interprétation
            juridique, référez-vous aux textes officiels.
          </p>
        </div>
      </div>
    </section>

    <section class="mt-8">
      <div class="card bg-base-200/50 border border-dashed border-base-300">
        <div class="card-body">
          <h2 class="card-title">Traçabilité technique</h2>
          <p class="opacity-80">
            Chaque import est journalisé (source, horodatage, hash, volumes).
            Une page interne “Santé des données” permet de consulter le dernier
            import et l’état des agrégats.
          </p>
          <p class="text-sm opacity-70">
            TODO : brancher l’affichage public de la date du dernier import une
            fois l’ETL en place.
          </p>
        </div>
      </div>
    </section>
  </main>
</template>
