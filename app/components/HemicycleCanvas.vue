<script setup lang="ts">
type GroupSeatInput = {
  id: string;
  name: string;
  color: string;
  seats: number;
};
const props = withDefaults(defineProps<{ groups?: GroupSeatInput[] }>(), {
  groups: () => [
    // placeholders (à remplacer par tes données réelles)
    { id: "RE", name: "Renaissance", color: "#F2C200", seats: 170 },
    { id: "RN", name: "Rassemblement", color: "#102A56", seats: 143 },
    { id: "LFI", name: "LFI", color: "#6C2BD9", seats: 75 },
    { id: "LR", name: "LR", color: "#1E3A8A", seats: 60 },
    { id: "SOC", name: "Socialistes", color: "#C22E3A", seats: 31 },
    { id: "EELV", name: "Écologistes", color: "#0E9F6E", seats: 23 },
    { id: "HOR", name: "Horizons", color: "#334155", seats: 27 },
    { id: "LIOT", name: "LIOT", color: "#B7791F", seats: 12 },
    { id: "GDR", name: "GDR", color: "#8B0000", seats: 11 },
    { id: "Aut", name: "Non inscrits", color: "#6B7280", seats: 25 },
  ],
});

/**
 * Génère 6 rangées semi-circulaires totalisant 577 sièges (approx visuelle).
 * Répartition par groupes en linéaire (garde l'ordre de props.groups).
 */
const rows = [50, 70, 90, 110, 130, 127]; // somme = 577
const viewW = 1000,
  viewH = 520;
const cx = viewW / 2,
  cy = viewH * 1.02; // centre sous le bord pour l’arc
const innerR = 180,
  rowGap = 40,
  seatRadius = 6;

type Seat = { x: number; y: number; color: string; groupId: string };
const seats = computed<Seat[]>(() => {
  // 1) génère toutes les positions
  const allPos: { x: number; y: number }[] = [];
  rows.forEach((count, i) => {
    const r = innerR + i * rowGap;
    const start = Math.PI; // 180°
    const end = 0;
    const step = (end - start) / (count - 1);
    for (let k = 0; k < count; k++) {
      const a = start + step * k;
      allPos.push({ x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) });
    }
  });
  // 2) assigne les couleurs par groupes
  const out: Seat[] = [];
  let idx = 0;
  props.groups.forEach((g) => {
    for (let i = 0; i < g.seats; i++) {
      if (!allPos[idx]) break;
      out.push({
        x: allPos[idx].x,
        y: allPos[idx].y,
        color: g.color,
        groupId: g.id,
      });
      idx++;
    }
  });
  // si moins/plus de 577, on tronque/complète en gris
  while (idx < allPos.length) {
    out.push({
      x: allPos[idx].x,
      y: allPos[idx].y,
      color: "#9CA3AF",
      groupId: "NA",
    });
    idx++;
  }
  return out;
});
</script>

<template>
  <section class="container mx-auto px-4 mt-8">
    <div class="card bg-base-100 border border-base-300 shadow-md">
      <div class="card-body">
        <div class="flex items-center justify-between gap-4">
          <h2 class="card-title">Répartition de l’hémicycle par groupe</h2>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="g in groups"
              :key="g.id"
              class="badge"
              :style="{
                backgroundColor: g.color,
                color: '#fff',
                borderColor: 'transparent',
              }"
            >
              {{ g.name }}
            </span>
          </div>
        </div>

        <div class="overflow-x-auto">
          <svg :viewBox="`0 0 ${viewW} ${viewH}`" class="w-full">
            <g>
              <circle
                v-for="(s, i) in seats"
                :key="i"
                :cx="s.x"
                :cy="s.y"
                :r="seatRadius"
                :fill="s.color"
                stroke="rgba(0,0,0,.08)"
              />
            </g>
          </svg>
        </div>

        <p class="text-sm opacity-70">
          Visualisation indicative. La disposition exacte des sièges peut
          différer ; les couleurs suivent les groupes politiques.
        </p>
      </div>
    </div>
  </section>
</template>
