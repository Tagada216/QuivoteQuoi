<script setup lang="ts"></script>

<template>
  <section class="container mx-auto px-4">
    <div
      class="relative bg-stone-50 border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
    >
      <div
        class="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none"
      ></div>
      <div class="relative card-body p-8">
        <h2 class="text-2xl font-black text-black mb-6 tracking-tight">
          Sources des données
        </h2>
        <p class="text-gray-800 text-lg leading-relaxed mb-8">
          Les informations affichées proviennent des jeux de données publics de
          l'Assemblée nationale (scrutins nominatifs) et des dossiers
          législatifs officiels.
        </p>
        <div class="flex flex-wrap gap-4">
          <a
            class="btn bg-white hover:bg-gray-50 text-black border-3 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-150 active:translate-x-1 active:translate-y-1 active:shadow-none"
            href="https://data.assemblee-nationale.fr/"
            target="_blank"
            rel="noopener"
          >
            data.assemblee-nationale.fr
          </a>
          <a
            class="btn bg-white hover:bg-gray-50 text-black border-3 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-150 active:translate-x-1 active:translate-y-1 active:shadow-none"
            href="https://www.assemblee-nationale.fr/"
            target="_blank"
            rel="noopener"
          >
            assemblee-nationale.fr
          </a>
          <a
            class="btn bg-gray-900 hover:bg-black text-white border-3 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-150 active:translate-x-1 active:translate-y-1 active:shadow-none"
            href="/methodologie"
          >
            Méthodologie
          </a>
          <a
            class="btn bg-gray-900 hover:bg-black text-white border-3 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-150 active:translate-x-1 active:translate-y-1 active:shadow-none"
            href="/sources"
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
