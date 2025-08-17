<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const mobileOpen = ref(false);

type NavItem = { label: string; to: string };
const nav: NavItem[] = [
  { label: "Accueil", to: "/" },
  { label: "Classements thématiques", to: "/classements" },
  { label: "Condamnations", to: "/condamnations" },
  { label: "Députés", to: "/deputes" },
  { label: "Absences", to: "/absences" },
  { label: "Sources", to: "/sources" },
];

watch(
  () => route.fullPath,
  () => {
    mobileOpen.value = false;
  }
);

function isActive(path: string) {
  if (path === "/") return route.path === "/";
  return route.path === path || route.path.startsWith(path + "/");
}
</script>

<template>
  <a
    href="#main"
    class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] bg-black text-white px-4 py-2 rounded-xl font-bold border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
  >
    Aller au contenu
  </a>

  <header
    class="sticky top-0 z-50 bg-stone-50/95 backdrop-blur-xl border-b-4 border-black"
  >
    <div class="navbar container mx-auto px-4">
      <div class="navbar-start gap-3">
        <button
          class="w-12 h-12 bg-white border-3 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-150 active:translate-x-1 active:translate-y-1 active:shadow-none grid place-items-center sm:hidden"
          aria-label="Ouvrir le menu"
          @click="mobileOpen = !mobileOpen"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 stroke-black stroke-2"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <NuxtLink to="/" class="flex items-center gap-3">
          <div
            class="w-10 h-10 bg-black rounded-xl border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] grid place-items-center"
          >
            <img
              src="/branding/icon.svg"
              alt=""
              width="20"
              height="20"
              class="object-contain shrink-0 invert"
            />
          </div>
          <span class="font-black text-xl tracking-tight text-black"
            >QuiVoteQuoi</span
          >
        </NuxtLink>
      </div>

      <nav class="navbar-center hidden sm:flex">
        <ul class="flex gap-2">
          <li v-for="item in nav" :key="item.to">
            <NuxtLink
              :to="item.to"
              class="px-4 py-2 rounded-xl font-bold text-black border-2 transition-all duration-150"
              :class="
                isActive(item.to)
                  ? 'bg-black text-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                  : 'bg-white hover:bg-gray-50 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none'
              "
            >
              {{ item.label }}
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <div class="navbar-end">
        <NuxtLink
          to="/classements"
          class="btn bg-blue-500 hover:bg-blue-600 text-white border-3 border-black font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-150 active:translate-x-1 active:translate-y-1 active:shadow-none hidden sm:inline-flex"
        >
          Classements
        </NuxtLink>
      </div>
    </div>

    <transition name="fade">
      <div
        v-show="mobileOpen"
        class="sm:hidden border-t-3 border-black bg-white"
      >
        <ul class="p-4 space-y-2">
          <li v-for="item in nav" :key="item.to">
            <NuxtLink
              :to="item.to"
              class="block px-4 py-3 rounded-xl font-bold text-black border-2 transition-all duration-150"
              :class="
                isActive(item.to)
                  ? 'bg-black text-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                  : 'bg-stone-50 hover:bg-gray-50 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
              "
            >
              {{ item.label }}
            </NuxtLink>
          </li>
        </ul>
      </div>
    </transition>
  </header>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.16s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
