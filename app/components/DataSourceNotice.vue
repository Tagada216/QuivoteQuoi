<script setup lang="ts"></script>

<template>
  <section class="container mx-auto px-3 sm:px-4">
    <div
      class="relative bg-stone-50 border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
    >
      <div
        class="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none"
      ></div>
      <div class="relative card-body p-4 sm:p-6 md:p-8">
        <h2
          class="text-xl sm:text-2xl font-black text-black mb-6 tracking-tight"
        >
          Sources des données
        </h2>
        <p class="text-gray-800 text-base sm:text-lg leading-relaxed mb-8">
          Les informations affichées proviennent des jeux de données publics de
          l’Assemblée nationale et de divers organismes officiels. Elles sont
          transformées et agrégées à des fins de visualisation.
        </p>

        <div class="space-y-6">
          <div
            class="p-4 rounded-xl border-2 border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
          >
            <h3 class="font-black text-black mb-2">Assemblée nationale</h3>
            <p class="text-sm text-gray-700">
              Données relatives aux scrutins publics, aux députés, groupes
              politiques et dossiers législatifs.
            </p>
          </div>

          <div
            class="p-4 rounded-xl border-2 border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
          >
            <h3 class="font-black text-black mb-2">Journal officiel</h3>
            <p class="text-sm text-gray-700">
              Informations complémentaires sur les textes et les étapes
              législatives.
            </p>
          </div>

          <div
            class="p-4 rounded-xl border-2 border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
          >
            <h3 class="font-black text-black mb-2">Open data</h3>
            <p class="text-sm text-gray-700">
              Au besoin, des sources ouvertes tierces peuvent être agrégées pour
              enrichir la visualisation (thématiques, contexte, etc.).
            </p>
          </div>
        </div>

        <div class="mt-8">
          <a
            class="btn btn-primary border-3 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
            href="https://www.assemblee-nationale.fr/dyn/opendata"
            target="_blank"
            rel="noopener noreferrer"
          >
            Toutes les sources
          </a>
        </div>
        <p
          class="text-sm text-gray-600 mt-8 bg-white/50 p-4 rounded-xl border-2 border-black/20"
        >
          Visualisation à vocation pédagogique. Référez-vous aux sources
          officielles pour toute interprétation juridique.
        </p>
      </div>
    </div>
  </section>
</template>
