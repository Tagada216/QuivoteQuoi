<script setup lang="ts">
import { useRouter } from "vue-router";

type Dec = "POUR" | "CONTRE" | "ABSTENTION" | "NV";
const col = {
  POUR: "#16a34a",
  CONTRE: "#dc2626",
  ABSTENTION: "#f59e0b",
  NV: "#9CA3AF",
} as const;

const props = withDefaults(
  defineProps<{
    groups: Array<{ id: string; name: string; color: string; seats: number }>;
    deputies: Array<{
      fullName: string;
      slug: string | null;
      groupId: string;
      groupColor: string;
      decision: Dec;
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

/* ===== Ajout: rotation + plein écran natif (mobile/tablette) ===== */
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
    } catch {
      /* si refus, on garde juste la rotation */
    }
  } else {
    landscape.value = false;
    try {
      await exitFullscreen();
    } catch {}
  }
}
function onFsChange() {
  if (!document.fullscreenElement) landscape.value = false;
}
onMounted(() => {
  document.addEventListener("fullscreenchange", onFsChange);
  document.addEventListener("webkitfullscreenchange" as any, onFsChange as any);
});
onBeforeUnmount(() => {
  document.removeEventListener("fullscreenchange", onFsChange);
  document.removeEventListener(
    "webkitfullscreenchange" as any,
    onFsChange as any
  );
});

/* ================== LOGIQUE D’ORIGINE ================== */
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
  if (segs.length === 0) {
    return { id: "", color: "#9CA3AF", tStart: 0, tEnd: 1 };
  }
  for (let i = 0; i < segs.length; i++) {
    const s = segs[i];
    if (s && t >= s.tStart && (t < s.tEnd || i === segs.length - 1)) return s;
  }
  return (
    segs[segs.length - 1] || { id: "", color: "#9CA3AF", tStart: 0, tEnd: 1 }
  );
}

const queues = computed(() => {
  const by = new Map<
    string,
    { fullName: string; slug: string | null; decision: Dec }[]
  >();
  for (const d of props.deputies) {
    const arr = by.get(d.groupId) ?? [];
    arr.push({ fullName: d.fullName, slug: d.slug, decision: d.decision });
    by.set(d.groupId, arr);
  }
  for (const [, arr] of by) {
    arr.sort((a, b) => {
      const order: Dec[] = ["POUR", "CONTRE", "ABSTENTION", "NV"];
      const diff = order.indexOf(a.decision) - order.indexOf(b.decision);
      return diff !== 0
        ? diff
        : a.fullName.localeCompare(b.fullName, "fr", { sensitivity: "base" });
    });
  }
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
        fill: col[d.decision],
        name: d.fullName,
        slug: d.slug,
      });
    } else {
      out.push({ x: p.x, y: p.y, fill: "#9CA3AF", name: "—", slug: null });
    }
  }
  return out;
});

function posFromEvt(e: MouseEvent) {
  const r = wrap.value!.getBoundingClientRect();
  return { x: e.clientX - r.left, y: e.clientY - r.top };
}
const tip = reactive({
  show: false,
  x: 0,
  y: 0,
  name: "",
  slug: null as string | null,
});
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
  <div
    class="relative p-6 bg-stone-50 border-4 border-black rounded-3xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] mx-4"
    ref="wrap"
  >
    <!-- Bouton: visible < lg, déclenche rotation + fullscreen natif -->
    <div class="mb-3 lg:hidden relative z-20">
      <button
        class="btn btn-sm border-2 border-black bg-white font-black shadow-[4px_4px_0_0_rgba(0,0,0,1)]"
        type="button"
        :aria-pressed="landscape"
        @click="toggleLandscape"
      >
        {{ landscape ? "Quitter plein écran" : "Mode horizontal plein écran" }}
      </button>
    </div>

    <div
      class="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none rounded-2xl"
    ></div>

    <!-- En mode horizontal: centre + pivote le SVG; sinon rendu inchangé -->
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
          :class="
            landscape
              ? 'h-[100svh] w-auto relative z-10'
              : 'w-full relative z-10'
          "
        >
          <g>
            <circle
              v-for="(s, i) in seats"
              :key="i"
              :cx="s.x"
              :cy="s.y"
              :r="seatRadius"
              :fill="s.fill"
              stroke="#000000"
              stroke-width="2"
              :class="
                s.slug
                  ? 'cursor-pointer hover:stroke-4 hover:r-8 transition-all'
                  : ''
              "
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
      class="pointer-events-none absolute z-20 rounded-xl border-3 border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] px-4 py-2 text-sm font-bold"
      :style="{ left: tip.x + 'px', top: tip.y + 'px' }"
    >
      {{ tip.name }}
    </div>
  </div>
</template>
