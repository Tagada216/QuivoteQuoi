<script setup lang="ts">
defineProps<{ tagline?: string }>();
const logos = {
  stacked: "/branding/lockup_stacked.svg", // adapte si besoin
  horizontal: "/branding/lockup_horizontal.svg", // si tu veux l'utiliser plus tard
};
</script>

<template>
  <section class="relative isolate overflow-hidden">
    <!-- Couche blobs larges d'ambiance (fond) -->
    <div class="pointer-events-none absolute inset-0 -z-30">
      <div class="bgblob bg1"></div>
      <div class="bgblob bg2"></div>
      <div class="bgblob bg3"></div>
    </div>

    <!-- Voile global + léger blur pour adoucir (sans tout écraser) -->
    <div class="absolute inset-0 -z-20 bg-base-100/50 backdrop-blur-xl"></div>

    <!-- HÉMICYCLE décor + BLOBS DE PARTIS CLIPPÉS DEDANS -->
    <div
      class="absolute inset-x-0 bottom-0 z-10 flex justify-center pointer-events-none"
    >
      <div class="relative w-[min(1200px,92vw)] aspect-[1200/520]">
        <!-- hémicycle en filigrane -->
        <img
          src="/branding/icon.svg"
          alt=""
          aria-hidden="true"
          class="absolute inset-0 w-full h-full object-contain opacity-25 md:opacity-30"
          style="filter: drop-shadow(0 6px 24px rgba(0, 0, 0, 0.12))"
        />
        <!-- couche des blobs "par parti", masquée par la forme de l’hémicycle -->
        <div class="absolute inset-0 party-mask">
          <div class="pblob p-re"></div>
          <div class="pblob p-rn"></div>
          <div class="pblob p-lfi"></div>
          <div class="pblob p-lr"></div>
          <div class="pblob p-ps"></div>
          <div class="pblob p-eelv"></div>
          <div class="pblob p-liot"></div>
          <div class="pblob p-hor"></div>
          <div class="pblob p-gdr"></div>
        </div>
      </div>
    </div>

    <!-- CONTENU -->
    <div class="container mx-auto px-4 relative z-20">
      <div
        class="min-h-[60svh] md:min-h-[68svh] flex flex-col items-center justify-center text-center gap-6 py-16"
      >
        <!-- plaque de lisibilité (frosted glass) -->
        <div
          class="glass px-6 py-6 rounded-3xl border border-white/15 shadow-xl"
        >
          <!-- Tuile QVQ -->
          <div
            class="relative mx-auto mb-4 w-28 h-28 md:w-32 md:h-32 rounded-3xl grid place-items-center bg-gradient-to-br from-primary/90 via-secondary/80 to-accent/90 text-base-100 shadow-2xl"
            aria-label="Icône QuiVoteQuoi"
          >
            <span
              class="text-3xl md:text-4xl font-black tracking-tight select-none"
              >QVQ</span
            >
            <span
              class="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-black/10"
            ></span>
          </div>

          <div class="space-y-2">
            <h1 class="text-4xl md:text-6xl font-extrabold tracking-tight">
              QuiVoteQuoi
            </h1>
            <p class="text-xl md:text-2xl opacity-90">
              {{ tagline || "Les votes, en clair" }}
            </p>
          </div>

          <p
            class="max-w-2xl mx-auto mt-3 text-base md:text-lg text-base-content/80"
          >
            Visualisez les votes de l’Assemblée nationale par groupes politiques
            puis par député, avec des sources officielles et une méthodologie
            transparente.
          </p>

          <div class="flex gap-3 justify-center pt-4">
            <NuxtLink to="#recherche" class="btn btn-primary"
              >Explorer</NuxtLink
            >
            <NuxtLink to="/sources" class="btn btn-ghost"
              >Sources des données</NuxtLink
            >
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ===============================
   1) BLOBS D'AMBIANCE (fond)
   =============================== */
.bgblob {
  position: absolute;
  border-radius: 9999px;
  filter: blur(70px);
  opacity: 0.8;
  mix-blend-mode: multiply;
  will-change: transform;
}
.bg1 {
  width: 46rem;
  height: 46rem;
  left: -10%;
  top: -15%;
  background: radial-gradient(
    closest-side,
    hsl(var(--p, 220 90% 56%)) 0%,
    transparent 60%
  );
  animation: float1 22s ease-in-out infinite alternate;
}
.bg2 {
  width: 40rem;
  height: 40rem;
  right: -12%;
  top: -8%;
  background: radial-gradient(
    closest-side,
    hsl(var(--s, 280 80% 60%)) 0%,
    transparent 62%
  );
  animation: float2 26s ease-in-out infinite alternate;
}
.bg3 {
  width: 54rem;
  height: 54rem;
  left: 8%;
  bottom: -24%;
  background: radial-gradient(
    closest-side,
    hsl(var(--a, 170 80% 45%)) 0%,
    transparent 64%
  );
  animation: float3 30s ease-in-out infinite alternate;
}

/* ===============================
   2) BLOBS DE PARTIS dans l’hémicycle
   - Clippés par le SVG : mask-image
   - Couleurs avec fallbacks (ajuste au besoin)
   =============================== */
.party-mask {
  /* masque: même SVG que l’image, même boîte */
  -webkit-mask-image: url("/branding/hemicycle.svg");
  mask-image: url("/branding/hemicycle.svg");
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-size: contain;
  mask-size: contain;
  -webkit-mask-position: bottom center;
  mask-position: bottom center;
  position: absolute;
  inset: 0;
}
.pblob {
  position: absolute;
  border-radius: 9999px;
  filter: blur(40px);
  opacity: 0.45;
  mix-blend-mode: screen;
  will-change: transform;
}
/* positions/animations douces ; réparties en bas */
.p-re {
  width: 28rem;
  height: 28rem;
  left: 10%;
  bottom: 6%;
  background: radial-gradient(
    circle at 50% 50%,
    var(--c-re, #f2c200) 0%,
    transparent 60%
  );
  animation: drift1 18s ease-in-out infinite alternate;
}
.p-rn {
  width: 26rem;
  height: 26rem;
  left: 26%;
  bottom: 10%;
  background: radial-gradient(
    circle at 50% 50%,
    var(--c-rn, #102a56) 0%,
    transparent 60%
  );
  animation: drift2 22s ease-in-out infinite alternate;
}
.p-lfi {
  width: 24rem;
  height: 24rem;
  left: 42%;
  bottom: 12%;
  background: radial-gradient(
    circle at 50% 50%,
    var(--c-lfi, #6c2bd9) 0%,
    transparent 60%
  );
  animation: drift3 20s ease-in-out infinite alternate;
}
.p-lr {
  width: 24rem;
  height: 24rem;
  left: 56%;
  bottom: 9%;
  background: radial-gradient(
    circle at 50% 50%,
    var(--c-lr, #1e3a8a) 0%,
    transparent 60%
  );
  animation: drift1 24s ease-in-out infinite alternate;
}
.p-ps {
  width: 22rem;
  height: 22rem;
  left: 70%;
  bottom: 8%;
  background: radial-gradient(
    circle at 50% 50%,
    var(--c-ps, #c22e3a) 0%,
    transparent 60%
  );
  animation: drift2 26s ease-in-out infinite alternate;
}
.p-eelv {
  width: 22rem;
  height: 22rem;
  left: 18%;
  bottom: 20%;
  background: radial-gradient(
    circle at 50% 50%,
    var(--c-eelv, #0e9f6e) 0%,
    transparent 60%
  );
  animation: drift3 28s ease-in-out infinite alternate;
}
.p-liot {
  width: 20rem;
  height: 20rem;
  left: 52%;
  bottom: 20%;
  background: radial-gradient(
    circle at 50% 50%,
    var(--c-liot, #b7791f) 0%,
    transparent 60%
  );
  animation: drift1 30s ease-in-out infinite alternate;
}
.p-hor {
  width: 20rem;
  height: 20rem;
  left: 34%;
  bottom: 22%;
  background: radial-gradient(
    circle at 50% 50%,
    var(--c-hor, #334155) 0%,
    transparent 60%
  );
  animation: drift2 32s ease-in-out infinite alternate;
}
.p-gdr {
  width: 20rem;
  height: 20rem;
  left: 64%;
  bottom: 22%;
  background: radial-gradient(
    circle at 50% 50%,
    var(--c-gdr, #8b0000) 0%,
    transparent 60%
  );
  animation: drift3 34s ease-in-out infinite alternate;
}

/* ===============================
   3) Plaque lisible (frosted glass)
   =============================== */
.glass {
  background: color-mix(
    in oklab,
    var(--glass, rgba(255, 255, 255, 0.65)) 80%,
    transparent
  );
  -webkit-backdrop-filter: blur(18px);
  backdrop-filter: blur(18px);
}

/* Animations */
@keyframes float1 {
  from {
    transform: translate3d(0, 0, 0) scale(1);
  }
  to {
    transform: translate3d(6%, 8%, 0) scale(1.06);
  }
}
@keyframes float2 {
  from {
    transform: translate3d(0, 0, 0) scale(1);
  }
  to {
    transform: translate3d(-5%, 10%, 0) scale(1.05);
  }
}
@keyframes float3 {
  from {
    transform: translate3d(0, 0, 0) scale(1);
  }
  to {
    transform: translate3d(4%, -6%, 0) scale(1.04);
  }
}

@keyframes drift1 {
  from {
    transform: translate3d(-2%, 0, 0);
  }
  to {
    transform: translate3d(3%, 1%, 0);
  }
}
@keyframes drift2 {
  from {
    transform: translate3d(2%, 1%, 0);
  }
  to {
    transform: translate3d(-3%, -1%, 0);
  }
}
@keyframes drift3 {
  from {
    transform: translate3d(0, 1%, 0);
  }
  to {
    transform: translate3d(1%, -1%, 0);
  }
}

/* Respect des préférences utilisateurs */
@media (prefers-reduced-motion: reduce) {
  .bgblob,
  .pblob {
    animation: none !important;
  }
}
</style>
