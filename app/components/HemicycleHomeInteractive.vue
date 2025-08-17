<script setup lang="ts">
import { useRouter } from "vue-router";

const props = withDefaults(
  defineProps<{
    groups: Array<{ id: string; name: string; color: string; seats: number }>;
    deputies: Array<{
      fullName: string;
      slug: string | null;
      groupId: string;
      groupColor: string;
    }>;
    groupOrder?: string[];
    lift?: number;
  }>(),
  {
    groupOrder: () => [
      "GDR",
      "LFI",
      "EELV",
      "SOC",
      "LIOT",
      "HOR",
      "RE",
      "LR",
      "RN",
      "NI",
    ],
    lift: 28,
  }
);

const router = useRouter();

/* ====== Ajout : toggle horizontal + plein écran natif (mobile/tablette) ====== */
const landscape = ref(false);
const wrap = ref<HTMLElement | null>(null);

function enterFullscreen(el: HTMLElement) {
  const anyEl = el as any;
  if (el.requestFullscreen) return el.requestFullscreen();
  if (anyEl.webkitRequestFullscreen) return anyEl.webkitRequestFullscreen();
  return Promise.reject();
}
function exitFullscreen() {
  const anyDoc = document as any;
  if (document.fullscreenElement) return document.exitFullscreen();
  if (anyDoc.webkitFullscreenElement) return anyDoc.webkitExitFullscreen();
  return Promise.resolve();
}

async function toggleLandscape() {
  if (!landscape.value) {
    landscape.value = true;
    try {
      if (wrap.value) await enterFullscreen(wrap.value);
    } catch (e) {
      // si le navigateur refuse, on garde simplement la rotation
    }
  } else {
    landscape.value = false;
    try {
      await exitFullscreen();
    } catch {}
  }
}

function onFsChange() {
  // si l'utilisateur quitte le plein écran (Esc, geste système), on désactive le mode
  if (!document.fullscreenElement) landscape.value = false;
}
onMounted(() => {
  document.addEventListener("fullscreenchange", onFsChange);
  // Safari iOS (legacy)
  document.addEventListener("webkitfullscreenchange" as any, onFsChange as any);
});
onBeforeUnmount(() => {
  document.removeEventListener("fullscreenchange", onFsChange);
  document.removeEventListener(
    "webkitfullscreenchange" as any,
    onFsChange as any
  );
});

/* ================== Géométrie / logique d’origine ================== */
const rows = [50, 70, 90, 110, 130, 127];
const viewW = 1000,
  viewH = 560;
const cx = viewW / 2,
  cy = computed(() => viewH - 14 - props.lift);
const innerR = 180,
  rowGap = 40,
  seatRadius = 6;

const gmap = computed(() => new Map(props.groups.map((g) => [g.id, g])));
const ordered = computed(
  () =>
    props.groupOrder
      .map((id) => gmap.value.get(id))
      .filter(Boolean) as typeof props.groups
);

const segments = computed(() => {
  const tot = ordered.value.reduce((s, g) => s + (g.seats || 0), 0) || 1;
  let cum = 0;
  return ordered.value.map((g) => {
    const part = (g.seats || 0) / tot;
    const tStart = cum,
      tEnd = Math.min(1, cum + part);
    cum = tEnd;
    return { id: g.id, color: g.color, tStart, tEnd };
  });
});
function segForT(t: number) {
  const segs = segments.value;
  if (segs.length === 0)
    return { id: "", color: "#9CA3AF", tStart: 0, tEnd: 1 };
  for (let i = 0; i < segs.length; i++) {
    const s = segs[i];
    if (s && t >= s.tStart && (t < s.tEnd || i === segs.length - 1)) return s;
  }
  return (
    segs[segs.length - 1] || { id: "", color: "#9CA3AF", tStart: 0, tEnd: 1 }
  );
}

// files alpha par groupe
const queues = computed(() => {
  const by = new Map<string, { fullName: string; slug: string | null }[]>();
  for (const d of props.deputies) {
    const arr = by.get(d.groupId) ?? [];
    arr.push({ fullName: d.fullName, slug: d.slug });
    by.set(d.groupId, arr);
  }
  for (const [, arr] of by)
    arr.sort((a, b) =>
      a.fullName.localeCompare(b.fullName, "fr", { sensitivity: "base" })
    );
  return by;
});

type Seat = {
  x: number;
  y: number;
  fill: string;
  name: string;
  slug: string | null;
};
const seats = computed<Seat[]>(() => {
  const pos: { x: number; y: number; t: number }[] = [];
  rows.forEach((count, i) => {
    const r = innerR + i * rowGap;
    for (let k = 0; k < count; k++) {
      const t = count === 1 ? 0 : k / (count - 1);
      const a = Math.PI * (1 - t);
      pos.push({ x: cx + r * Math.cos(a), y: cy.value - r * Math.sin(a), t });
    }
  });
  const curs = new Map<string, number>();
  const out: Seat[] = [];
  for (const p of pos) {
    const seg = segForT(p.t);
    const list = queues.value.get(seg.id) ?? [];
    const idx = curs.get(seg.id) ?? 0;
    const d = list[idx];
    if (d) {
      curs.set(seg.id, idx + 1);
      out.push({
        x: p.x,
        y: p.y,
        fill: seg.color,
        name: d.fullName,
        slug: d.slug,
      });
    } else {
      out.push({ x: p.x, y: p.y, fill: "#9CA3AF", name: "—", slug: null });
    }
  }
  return out;
});

// tooltip minimal (d’origine)
const tip = reactive({
  show: false,
  x: 0,
  y: 0,
  name: "",
  slug: null as string | null,
});
function posFromEvt(e: MouseEvent) {
  const r = wrap.value!.getBoundingClientRect();
  return { x: e.clientX - r.left, y: e.clientY - r.top };
}
function onEnter(e: MouseEvent, s: Seat) {
  const p = posFromEvt(e);
  Object.assign(tip, {
    show: true,
    x: p.x + 12,
    y: p.y + 12,
    name: s.name,
    slug: s.slug,
  });
}
function onMove(e: MouseEvent) {
  if (!tip.show) return;
  const p = posFromEvt(e);
  tip.x = p.x + 12;
  tip.y = p.y + 12;
}
function onLeave() {
  tip.show = false;
}
function go(slug: string | null) {
  if (slug) router.push(`/depute/${slug}`);
}
function onKey(e: KeyboardEvent, s: Seat) {
  if ((e.key === "Enter" || e.key === " ") && s.slug) {
    e.preventDefault();
    go(s.slug);
  }
}
</script>

<template>
  <!-- L’élément qui passe en plein écran = wrap (tooltip OK) -->
  <div class="relative" ref="wrap">
    <!-- Bouton : visible uniquement < lg -->
    <div class="mb-3 lg:hidden">
      <button
        class="btn btn-sm border-2 border-black bg-white font-black shadow-[4px_4px_0_0_rgba(0,0,0,1)]"
        type="button"
        :aria-pressed="landscape"
        @click="toggleLandscape"
      >
        {{ landscape ? "Quitter plein écran" : "Mode horizontal plein écran" }}
      </button>
    </div>

    <!-- Conteneur : en mode horizontal, on centre et on pivote le SVG -->
    <div
      :class="
        landscape
          ? 'flex items-center justify-center w-[100svw] h-[100svh]'
          : ''
      "
    >
      <div :class="landscape ? 'transform-gpu rotate-90 origin-center' : ''">
        <svg
          :viewBox="`0 0 ${viewW} ${viewH}`"
          :class="landscape ? 'h-[100svh] w-auto' : 'w-full'"
        >
          <g>
            <circle
              v-for="(s, i) in seats"
              :key="i"
              :cx="s.x"
              :cy="s.y"
              :r="seatRadius"
              :fill="s.fill"
              stroke="rgba(0,0,0,.08)"
              :class="s.slug ? 'cursor-pointer hover:stroke-black/30' : ''"
              role="button"
              tabindex="0"
              :aria-label="s.name"
              @mouseenter="(e)=>onEnter(e as MouseEvent, s)"
              @mousemove="(e)=>onMove(e as MouseEvent)"
              @mouseleave="onLeave"
              @click="go(s.slug)"
              @keydown="(e)=>onKey(e as KeyboardEvent, s)"
            />
          </g>
        </svg>
      </div>
    </div>

    <div
      v-show="tip.show"
      class="pointer-events-none absolute z-20 rounded-xl border border-base-300 bg-base-100/95 shadow px-2 py-1 text-sm"
      :style="{ left: tip.x + 'px', top: tip.y + 'px' }"
    >
      {{ tip.name }}
    </div>
  </div>
</template>
