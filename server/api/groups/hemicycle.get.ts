export default defineEventHandler(async (event) => {
  const q = getQuery(event);
  const leg = q.legislature ? Number(q.legislature) : 17;
  const TOTAL = 577;
  const today = new Date().toISOString().slice(0, 10);

  const supabase = serverSupabase();

  // 1) Tous les groupes de la législature
  const { data: groups, error: gErr } = await supabase
    .from("groups")
    .select("id, acronym, name, color, expected_seats")
    .eq("legislature_id", leg);
  if (gErr) throw createError({ statusCode: 500, statusMessage: gErr.message });

  // 2) Adhésions (comptage "actif aujourd'hui")
  const { data: mem, error: mErr } = await supabase
    .from("deputy_group_memberships")
    .select("group_id, from_date, to_date");
  if (mErr) throw createError({ statusCode: 500, statusMessage: mErr.message });

  const realCounts = new Map<string, number>();
  for (const row of mem ?? []) {
    const inRange =
      row.from_date <= today && (row.to_date === null || row.to_date >= today);
    if (!inRange) continue;
    const gid = String((row as any).group_id);
    realCounts.set(gid, (realCounts.get(gid) ?? 0) + 1);
  }

  // 3) Répartition : on garde les comptes réels, et on remplit le reste proportionnellement aux expected_seats des groupes manquants.
  const present = new Set(realCounts.keys());
  const totalReal = Array.from(realCounts.values()).reduce((a, b) => a + b, 0);
  const remaining = Math.max(0, TOTAL - totalReal);

  const missing = (groups ?? []).filter((g) => !present.has(String(g.id)));
  const sumExpectedMissing = missing.reduce(
    (s, g) => s + (g.expected_seats ?? 0),
    0
  );

  // Attribution proportionnelle + correction d'arrondi pour respecter la somme EXACTE
  const provisional = new Map<string, number>();
  for (const g of groups ?? []) {
    const id = String(g.id);
    if (realCounts.has(id)) {
      provisional.set(id, realCounts.get(id)!); // sièges réels
    } else {
      const share =
        sumExpectedMissing > 0
          ? (g.expected_seats ?? 0) / sumExpectedMissing
          : 0;
      provisional.set(id, Math.floor(share * remaining)); // sièges placeholder (arrondi bas)
    }
  }
  // Ajustement pour matcher exactement TOTAL
  let sumNow = Array.from(provisional.values()).reduce((a, b) => a + b, 0);
  if (sumNow < TOTAL && sumExpectedMissing > 0) {
    // distribuer les sièges restants aux groupes manquants par ordre de plus grand "reliquat" théorique
    const remainders = missing
      .map((g) => {
        const share = (g.expected_seats ?? 0) / sumExpectedMissing;
        const ideal = share * remaining;
        const got = provisional.get(String(g.id)) ?? 0;
        return { id: String(g.id), diff: ideal - got };
      })
      .sort((a, b) => b.diff - a.diff);
    let i = 0;
    while (sumNow < TOTAL && remainders.length > 0) {
      const target = remainders[i % remainders.length];
      if (target) {
        provisional.set(target.id, (provisional.get(target.id) ?? 0) + 1);
        sumNow++;
      }
      i++;
    }
  }

  const usedPlaceholder = remaining > 0;

  const result = (groups ?? [])
    .map((g) => ({
      id: g.acronym, // 👈 IMPORTANT: acronyme en tant qu'id attendu par le composant
      acronym: g.acronym,
      name: g.name,
      color: g.color,
      seats: provisional.get(String(g.id)) ?? 0,
      dbId: g.id, // optionnel: si tu veux quand même l’ID numérique
    }))
    .filter((x) => x.seats > 0)
    .sort((a, b) => b.seats - a.seats);

  return { usedPlaceholder, groups: result };
});
