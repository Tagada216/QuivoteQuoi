<script setup lang="ts"></script>

<template>
  <section class="container mx-auto px-4">
    <div class="card bg-base-200/70 border border-base-300 shadow-sm">
      <div class="card-body">
        <h2 class="card-title">Sources des données</h2>
        <p class="text-base-content/80">
          Les informations affichées proviennent des jeux de données publics de
          l’Assemblée nationale (scrutins nominatifs) et des dossiers
          législatifs officiels.
        </p>
        <div class="flex flex-wrap gap-2">
          <a
            class="btn btn-sm btn-outline"
            href="https://data.assemblee-nationale.fr/"
            target="_blank"
            rel="noopener"
          >
            data.assemblee-nationale.fr
          </a>
          <a
            class="btn btn-sm btn-outline"
            href="https://www.assemblee-nationale.fr/"
            target="_blank"
            rel="noopener"
          >
            assemblee-nationale.fr
          </a>
          <a class="btn btn-sm btn-ghost" href="/methodologie">
            Méthodologie
          </a>
          <a class="btn btn-sm btn-ghost" href="/sources">
            Toutes les sources
          </a>
        </div>
        <p class="text-xs opacity-60">
          Visualisation à vocation pédagogique. Référez-vous aux sources
          officielles pour toute interprétation juridique.
        </p>
      </div>
    </div>
  </section>
</template>
