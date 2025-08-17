// server/api/hemicycle/deputies.get.ts
import { serverSupabase } from "../../utils/supabase";

export default defineEventHandler(async (event) => {
  const q = getQuery(event);
  const leg = q.legislature ? Number(q.legislature) : 17;
  const supabase = serverSupabase();
  const today = new Date().toISOString().slice(0, 10);

  // Groupes de la législature
  const { data: groups, error: gErr } = await supabase
    .from("groups")
    .select("id, acronym, name, color")
    .eq("legislature_id", leg)
    .order("acronym", { ascending: true });
  if (gErr) throw createError({ statusCode: 500, statusMessage: gErr.message });

  const groupIds = new Set((groups ?? []).map((g) => g.id as number));
  const gById = new Map((groups ?? []).map((g) => [g.id as number, g]));

  // Adhésions (filtrées sur les groupes de cette législature)
  const { data: mem, error: mErr } = await supabase
    .from("deputy_group_memberships")
    .select("deputy_id, group_id, from_date, to_date");
  if (mErr) throw createError({ statusCode: 500, statusMessage: mErr.message });

  const active = (mem ?? []).filter(
    (r) =>
      groupIds.has(r.group_id as number) &&
      r.from_date <= today &&
      (r.to_date === null || r.to_date >= today)
  );

  // Comptes actifs par groupe
  const activeByGroup = new Map<number, number>();
  const depIds = new Set<number>();
  for (const r of active) {
    depIds.add(r.deputy_id as number);
    activeByGroup.set(
      r.group_id as number,
      (activeByGroup.get(r.group_id as number) ?? 0) + 1
    );
  }

  // Députés (nom + slug)
  const { data: deps, error: dErr } = await supabase
    .from("deputies")
    .select("id, full_name, slug")
    .in("id", Array.from(depIds));
  if (dErr) throw createError({ statusCode: 500, statusMessage: dErr.message });
  const depMap = new Map(deps?.map((d) => [d.id as number, d]) ?? []);

  // Liste des députés pour dessin (groupId = acronyme)
  const deputies: Array<{
    fullName: string;
    slug: string | null;
    groupId: string;
    groupColor: string;
  }> = [];
  for (const r of active) {
    const d = depMap.get(r.deputy_id as number);
    const g = gById.get(r.group_id as number);
    if (!d || !g) continue;
    deputies.push({
      fullName: d.full_name as string,
      slug: (d.slug as string) ?? null,
      groupId: g.acronym as string,
      groupColor: g.color as string,
    });
  }
  deputies.sort((a, b) =>
    a.fullName.localeCompare(b.fullName, "fr", { sensitivity: "base" })
  );

  // Sièges = nb d'actifs par groupe (toujours) → puis normalisation à 577
  let outGroups = (groups ?? [])
    .map((g) => ({
      id: g.acronym as string,
      name: g.name as string,
      color: g.color as string,
      seats: activeByGroup.get(g.id as number) ?? 0,
    }))
    .filter((x) => x.seats > 0);

  const TOTAL = 577;
  const sum = outGroups.reduce((s, g) => s + g.seats, 0);
  if (sum > 0 && sum !== TOTAL) {
    const scale = TOTAL / sum;
    let acc = 0;
    for (let i = 0; i < outGroups.length; i++) {
      const s = Math.max(1, Math.floor(outGroups[i].seats * scale)); // garde au moins 1
      outGroups[i].seats = s;
      acc += s;
    }
    // ajuste l'arrondi pour tomber pile à 577
    let rest = TOTAL - acc,
      i = 0;
    while (rest !== 0 && outGroups.length) {
      outGroups[i % outGroups.length].seats += rest > 0 ? 1 : -1;
      rest += rest > 0 ? -1 : 1;
      i++;
    }
  }

  // Légende (avec comptes réels)
  const legend = outGroups
    .map((g) => {
      const gid = (groups ?? []).find((x) => x.acronym === g.id)?.id as number;
      return {
        id: g.id,
        name: g.name,
        color: g.color,
        count: activeByGroup.get(gid) ?? 0,
      };
    })
    .sort((a, b) => a.id.localeCompare(b.id));

  return { groups: outGroups, deputies, legend, usedPlaceholder: sum < TOTAL };
});
