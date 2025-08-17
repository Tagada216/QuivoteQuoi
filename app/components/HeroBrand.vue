<script setup lang="ts">
defineProps<{ tagline?: string }>();
const logos = {
  stacked: "/branding/lockup_stacked.svg",
  horizontal: "/branding/lockup_horizontal.svg",
};
</script>

<template>
  <section class="relative isolate overflow-hidden bg-stone-50">
    <div class="pointer-events-none absolute inset-0 -z-30">
      <div class="bgblob bg1"></div>
      <div class="bgblob bg2"></div>
      <div class="bgblob bg3"></div>
    </div>

    <div class="absolute inset-0 -z-20 bg-stone-50/80 backdrop-blur-sm"></div>

    <div
      class="absolute inset-x-0 bottom-0 z-10 flex justify-center pointer-events-none"
    >
      <div class="relative w-[min(1200px,92vw)] aspect-[1200/520]">
        <img
          src="/branding/icon.svg"
          alt=""
          aria-hidden="true"
          class="absolute inset-0 w-full h-full object-contain opacity-30 md:opacity-40"
          style="filter: drop-shadow(0 8px 32px rgba(0, 0, 0, 0.3))"
        />
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

    <div class="container mx-auto px-4 relative z-20">
      <div
        class="min-h-[60svh] md:min-h-[68svh] flex flex-col items-center justify-center text-center gap-8 py-16"
      >
        <div
          class="bg-white border-4 border-black rounded-3xl shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] p-12 relative overflow-hidden"
        >
          <div
            class="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none"
          ></div>

          <div
            class="relative mx-auto mb-8 w-32 h-32 md:w-36 md:h-36 rounded-3xl grid place-items-center bg-gradient-to-br from-black via-gray-800 to-black text-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black"
            aria-label="Icône QuiVoteQuoi"
          >
            <span
              class="text-4xl md:text-5xl font-black tracking-tight select-none"
              >QVQ</span
            >
          </div>

          <div class="space-y-4 relative">
            <h1
              class="text-5xl md:text-7xl font-black tracking-tight text-black"
            >
              QuiVoteQuoi
            </h1>
            <p class="text-2xl md:text-3xl font-bold text-gray-800">
              {{ tagline || "Les votes, en clair" }}
            </p>
          </div>

          <p
            class="max-w-2xl mx-auto mt-6 text-lg md:text-xl text-gray-700 font-medium leading-relaxed relative"
          >
            Visualisez les votes de l'Assemblée nationale par groupes politiques
            puis par député, avec des sources officielles et une méthodologie
            transparente.
          </p>

          <div class="flex gap-6 justify-center pt-8 relative">
            <NuxtLink
              to="#recherche"
              class="btn bg-blue-500 hover:bg-blue-600 text-white border-4 border-black font-black text-lg px-8 py-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all duration-150 active:translate-x-1 active:translate-y-1 active:shadow-none"
            >
              Explorer
            </NuxtLink>
            <NuxtLink
              to="/sources"
              class="btn bg-white hover:bg-gray-50 text-black border-4 border-black font-black text-lg px-8 py-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all duration-150 active:translate-x-1 active:translate-y-1 active:shadow-none"
            >
              Sources des données
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
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
    hsl(220 90% 56%) 0%,
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
    hsl(280 80% 60%) 0%,
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
    hsl(170 80% 45%) 0%,
    transparent 64%
  );
  animation: float3 30s ease-in-out infinite alternate;
}

.party-mask {
  -webkit-mask-image: url("/branding/icon.svg");
  mask-image: url("/branding/icon.svg");
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

@media (prefers-reduced-motion: reduce) {
  .bgblob,
  .pblob {
    animation: none !important;
  }
}
</style>
