<script setup lang="ts">
const version = "V1.0";
const updated = "2025-08-14";
useHead({ title: "Méthodologie — QuiVoteQuoi" });
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
          Méthodologie
        </h1>
        <p class="text-lg text-gray-700 font-medium">
          Version {{ version }} · Dernière mise à jour :
          {{ new Date(updated).toLocaleDateString() }}
        </p>
      </div>
    </header>

    <nav class="mb-8">
      <div
        class="relative bg-stone-50 border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
      >
        <div
          class="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none"
        ></div>
        <div class="relative p-6">
          <span
            class="text-lg font-black text-black uppercase tracking-wide block mb-4"
            >Sommaire</span
          >
          <div class="flex flex-wrap gap-3">
            <a
              href="#perimetre"
              class="px-3 py-2 bg-white border-2 border-black rounded-xl font-bold text-black hover:bg-gray-50 transition-colors shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1"
            >
              Périmètre
            </a>
            <a
              href="#types"
              class="px-3 py-2 bg-white border-2 border-black rounded-xl font-bold text-black hover:bg-gray-50 transition-colors shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1"
            >
              Types de scrutins
            </a>
            <a
              href="#scores"
              class="px-3 py-2 bg-white border-2 border-black rounded-xl font-bold text-black hover:bg-gray-50 transition-colors shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1"
            >
              Scores thématiques
            </a>
            <a
              href="#cohesion"
              class="px-3 py-2 bg-white border-2 border-black rounded-xl font-bold text-black hover:bg-gray-50 transition-colors shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1"
            >
              Cohésion de groupe
            </a>
            <a
              href="#titres"
              class="px-3 py-2 bg-white border-2 border-black rounded-xl font-bold text-black hover:bg-gray-50 transition-colors shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1"
            >
              Titres « parlants »
            </a>
            <a
              href="#maj"
              class="px-3 py-2 bg-white border-2 border-black rounded-xl font-bold text-black hover:bg-gray-50 transition-colors shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1"
            >
              Mises à jour
            </a>
            <a
              href="#limites"
              class="px-3 py-2 bg-white border-2 border-black rounded-xl font-bold text-black hover:bg-gray-50 transition-colors shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1"
            >
              Transparence & limites
            </a>
          </div>
        </div>
      </div>
    </nav>

    <div class="space-y-8">
      <section
        id="perimetre"
        class="relative bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
      >
        <div class="p-8 prose max-w-none">
          <h2 class="text-2xl font-black text-black mb-4">Périmètre</h2>
          <ul class="space-y-2 text-gray-800">
            <li class="flex items-start gap-2">
              <span class="font-black text-black">•</span>
              <span
                ><strong class="text-black">Législatures couvertes :</strong>
                XVIe et actuelle (post-dissolution).</span
              >
            </li>
            <li class="flex items-start gap-2">
              <span class="font-black text-black">•</span>
              <span
                ><strong class="text-black">Unité d'analyse :</strong> vote
                <em>nominatif</em> par député (scrutins publics).</span
              >
            </li>
            <li class="flex items-start gap-2">
              <span class="font-black text-black">•</span>
              <span
                ><strong class="text-black">Niveau par défaut :</strong> groupes
                politiques puis détail par député.</span
              >
            </li>
          </ul>
        </div>
      </section>

      <section
        id="types"
        class="relative bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
      >
        <div class="p-8 prose max-w-none">
          <h2 class="text-2xl font-black text-black mb-4">
            Types de scrutins pris en compte
          </h2>
          <ul class="space-y-2 text-gray-800 mb-4">
            <li class="flex items-start gap-2">
              <span class="font-black text-black">•</span>
              <span
                ><strong class="text-black">Inclus :</strong> scrutin public
                ordinaire, scrutin public solennel, motions de censure.</span
              >
            </li>
            <li class="flex items-start gap-2">
              <span class="font-black text-black">•</span>
              <span
                ><strong class="text-black">Exclus (non nominatifs) :</strong>
                main levée / assis-levé, scrutins secrets (ex. élections
                internes).</span
              >
            </li>
          </ul>
          <p
            class="text-sm text-gray-600 bg-gray-100 p-4 rounded-xl border-2 border-gray-300"
          >
            Les scrutins non nominatifs peuvent être mentionnés à titre
            informatif mais ne nourrissent pas les statistiques par député.
          </p>
        </div>
      </section>

      <section
        id="scores"
        class="relative bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
      >
        <div class="p-8 prose max-w-none">
          <h2 class="text-2xl font-black text-black mb-4">
            Scores thématiques (V1)
          </h2>
          <p class="text-gray-800 mb-6">
            Chaque dossier législatif est rattaché à une ou plusieurs
            <strong class="text-black">catégories</strong> (p. ex. Écologie,
            Social, Justice) via un ensemble de mots-clés et une validation
            manuelle sur les textes phares.
          </p>
          <h3 class="text-xl font-black text-black mb-3">Polarité</h3>
          <p class="text-gray-800 mb-6">
            Pour chaque scrutin et thème, on qualifie l'orientation :
            <em>positive</em> (renforce le thème) ou
            <em>négative</em> (l'affaiblit). Cette qualification est documentée
            par des exemples et peut évoluer.
          </p>
          <h3 class="text-xl font-black text-black mb-3">
            Formule (abstentions exclues)
          </h3>
          <pre
            class="bg-gray-100 border-2 border-gray-400 rounded-xl p-4 font-mono text-sm overflow-x-auto"
          ><code class="text-gray-800">
score_thème_groupe =
( Pour sur scrutins positifs  +  Contre sur scrutins négatifs )
/ ( Pour + Contre )  // sur le groupe, pour le thème considéré
          </code></pre>
          <p
            class="text-sm text-gray-600 bg-gray-100 p-4 rounded-xl border-2 border-gray-300 mt-4"
          >
            <strong>Abstention</strong> et <strong>non-votant</strong> n'entrent
            pas au numérateur ; ils sont affichés séparément pour la
            transparence et peuvent être intégrés dans de futures versions.
          </p>
        </div>
      </section>

      <section
        id="cohesion"
        class="relative bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
      >
        <div class="p-8 prose max-w-none">
          <h2 class="text-2xl font-black text-black mb-4">
            Cohésion de groupe
          </h2>
          <p class="text-gray-800">
            La cohésion indique l'alignement interne d'un groupe sur un scrutin
            ou un thème (dispersion des positions). Elle est affichée via un
            indicateur simple (écart / % d'alignement) et ne modifie pas le
            score.
          </p>
        </div>
      </section>

      <section
        id="titres"
        class="relative bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
      >
        <div class="p-8 prose max-w-none">
          <h2 class="text-2xl font-black text-black mb-4">
            Titres « parlants »
          </h2>
          <p class="text-gray-800">
            Chaque scrutin est relié à un
            <strong class="text-black">dossier législatif</strong>. Nous
            affichons en titre un
            <strong class="text-black">alias éditorial</strong> concis (≤ 60
            caractères) et en sous-titre le
            <strong class="text-black">titre officiel</strong> avec lien source.
          </p>
        </div>
      </section>

      <section
        id="maj"
        class="relative bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
      >
        <div class="p-8 prose max-w-none">
          <h2 class="text-2xl font-black text-black mb-4">Mises à jour</h2>
          <ul class="space-y-2 text-gray-800">
            <li class="flex items-start gap-2">
              <span class="font-black text-black">•</span>
              <span
                >Imports planifiés
                <strong class="text-black">deux fois par jour</strong> : 00:00
                et 12:00 (Europe/Paris).</span
              >
            </li>
            <li class="flex items-start gap-2">
              <span class="font-black text-black">•</span>
              <span
                >Possibilité de
                <strong class="text-black">rafraîchissement manuel</strong>
                (interface interne / endpoint sécurisé).</span
              >
            </li>
            <li class="flex items-start gap-2">
              <span class="font-black text-black">•</span>
              <span
                >Recalcul des agrégats après chaque import ; journalisation des
                opérations.</span
              >
            </li>
          </ul>
        </div>
      </section>

      <section
        id="limites"
        class="relative bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
      >
        <div class="p-8 prose max-w-none">
          <h2 class="text-2xl font-black text-black mb-4">
            Transparence & limites
          </h2>
          <ul class="space-y-2 text-gray-800">
            <li class="flex items-start gap-2">
              <span class="font-black text-black">•</span>
              <span
                >Les visualisations sont
                <strong class="text-black">pédagogiques</strong> ; référez-vous
                aux
                <NuxtLink
                  to="/sources"
                  class="font-bold text-blue-600 hover:text-blue-800 underline"
                  >sources officielles</NuxtLink
                >
                pour toute interprétation juridique.</span
              >
            </li>
            <li class="flex items-start gap-2">
              <span class="font-black text-black">•</span>
              <span
                >La disposition de l'hémicycle est
                <strong class="text-black">indicative</strong> ; les couleurs
                représentent les groupes politiques.</span
              >
            </li>
            <li class="flex items-start gap-2">
              <span class="font-black text-black">•</span>
              <span
                >Tous les calculs affichent les
                <strong class="text-black">listes de scrutins</strong>
                sous-jacents et leurs liens sources.</span
              >
            </li>
          </ul>
        </div>
      </section>
    </div>
  </main>
</template>
