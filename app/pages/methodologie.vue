<script setup lang="ts">
const version = "V1.0";
const updated = "2025-08-14"; // TODO: brancher sur la date du dernier import
useHead({ title: "Méthodologie — QuiVoteQuoi" });
</script>

<template>
  <main class="container mx-auto px-4 py-8">
    <header class="mb-6">
      <h1 class="text-3xl md:text-4xl font-extrabold tracking-tight">
        Méthodologie
      </h1>
      <p class="text-base-content/70">
        Version {{ version }} · Dernière mise à jour :
        {{ new Date(updated).toLocaleDateString() }}
      </p>
    </header>

    <!-- Sommaire local -->
    <nav class="mb-6">
      <div class="card bg-base-200/70 border border-base-300">
        <div class="card-body py-3">
          <span class="text-sm uppercase opacity-70">Sommaire</span>
          <div class="flex flex-wrap gap-3">
            <a href="#perimetre" class="link">Périmètre</a>
            <a href="#types" class="link">Types de scrutins</a>
            <a href="#scores" class="link">Scores thématiques</a>
            <a href="#cohesion" class="link">Cohésion de groupe</a>
            <a href="#titres" class="link">Titres « parlants »</a>
            <a href="#maj" class="link">Mises à jour</a>
            <a href="#limites" class="link">Transparence & limites</a>
          </div>
        </div>
      </div>
    </nav>

    <section id="perimetre" class="prose max-w-none">
      <h2>Périmètre</h2>
      <ul>
        <li>
          <strong>Législatures couvertes :</strong> XVIe et actuelle
          (post-dissolution).
        </li>
        <li>
          <strong>Unité d’analyse :</strong> vote <em>nominatif</em> par député
          (scrutins publics).
        </li>
        <li>
          <strong>Niveau par défaut :</strong> groupes politiques puis détail
          par député.
        </li>
      </ul>
    </section>

    <section id="types" class="prose max-w-none mt-8">
      <h2>Types de scrutins pris en compte</h2>
      <ul>
        <li>
          <strong>Inclus :</strong> scrutin public ordinaire, scrutin public
          solennel, motions de censure.
        </li>
        <li>
          <strong>Exclus (non nominatifs) :</strong> main levée / assis-levé,
          scrutins secrets (ex. élections internes).
        </li>
      </ul>
      <p class="text-sm opacity-70">
        Les scrutins non nominatifs peuvent être mentionnés à titre informatif
        mais ne nourrissent pas les statistiques par député.
      </p>
    </section>

    <section id="scores" class="prose max-w-none mt-8">
      <h2>Scores thématiques (V1)</h2>
      <p>
        Chaque dossier législatif est rattaché à une ou plusieurs
        <strong>catégories</strong> (p. ex. Écologie, Social, Justice) via un
        ensemble de mots-clés et une validation manuelle sur les textes phares.
      </p>
      <h3>Polarité</h3>
      <p>
        Pour chaque scrutin et thème, on qualifie l’orientation :
        <em>positive</em> (renforce le thème) ou
        <em>négative</em> (l’affaiblit). Cette qualification est documentée par
        des exemples et peut évoluer.
      </p>
      <h3>Formule (abstentions exclues)</h3>
      <pre class="whitespace-pre-wrap"><code>
score_thème_groupe =
( Pour sur scrutins positifs  +  Contre sur scrutins négatifs )
/ ( Pour + Contre )  // sur le groupe, pour le thème considéré
      </code></pre>
      <p class="text-sm opacity-70">
        <strong>Abstention</strong> et <strong>non-votant</strong> n’entrent pas
        au numérateur ; ils sont affichés séparément pour la transparence et
        peuvent être intégrés dans de futures versions.
      </p>
    </section>

    <section id="cohesion" class="prose max-w-none mt-8">
      <h2>Cohésion de groupe</h2>
      <p>
        La cohésion indique l’alignement interne d’un groupe sur un scrutin ou
        un thème (dispersion des positions). Elle est affichée via un indicateur
        simple (écart / % d’alignement) et ne modifie pas le score.
      </p>
    </section>

    <section id="titres" class="prose max-w-none mt-8">
      <h2>Titres « parlants »</h2>
      <p>
        Chaque scrutin est relié à un <strong>dossier législatif</strong>. Nous
        affichons en titre un <strong>alias éditorial</strong> concis (≤ 60
        caractères) et en sous-titre le <strong>titre officiel</strong> avec
        lien source.
      </p>
    </section>

    <section id="maj" class="prose max-w-none mt-8">
      <h2>Mises à jour</h2>
      <ul>
        <li>
          Imports planifiés <strong>deux fois par jour</strong> : 00:00 et 12:00
          (Europe/Paris).
        </li>
        <li>
          Possibilité de <strong>rafraîchissement manuel</strong> (interface
          interne / endpoint sécurisé).
        </li>
        <li>
          Recalcul des agrégats après chaque import ; journalisation des
          opérations.
        </li>
      </ul>
    </section>

    <section id="limites" class="prose max-w-none mt-8">
      <h2>Transparence & limites</h2>
      <ul>
        <li>
          Les visualisations sont <strong>pédagogiques</strong> ; référez-vous
          aux
          <NuxtLink to="/sources" class="link">sources officielles</NuxtLink>
          pour toute interprétation juridique.
        </li>
        <li>
          La disposition de l’hémicycle est <strong>indicative</strong> ; les
          couleurs représentent les groupes politiques.
        </li>
        <li>
          Tous les calculs affichent les
          <strong>listes de scrutins</strong> sous-jacents et leurs liens
          sources.
        </li>
      </ul>
    </section>
  </main>
</template>
