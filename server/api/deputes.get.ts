import { serverSupabase } from "../utils/supabase";

type Deputy = {
  id: number;
  full_name: string;
  slug: string | null;
  circ: number | null;
  departement: string | null;
  photo_url: string | null;
};

export default defineEventHandler(async (event) => {
  const q = getQuery(event);
  const legislature = q.leg ? Number(q.leg) : 17;
  const groupAcr = (q.group as string | undefined)?.trim() || null;
  const term = (q.q as string | undefined)?.trim() || "";
  const hasTerm = term.length >= 2;
  const today = new Date().toISOString().slice(0, 10);

  const supabase = serverSupabase();

  // Groupes de la législature
  const { data: groups, error: gErr } = await supabase
    .from("groups")
    .select("id, acronym, name, color")
    .eq("legislature_id", legislature)
    .order("acronym", { ascending: true });
  if (gErr) throw createError({ statusCode: 500, statusMessage: gErr.message });

  const byAcr = new Map(groups?.map((g) => [g.acronym as string, g]) ?? []);
  const groupIds =
    groupAcr && byAcr.get(groupAcr)
      ? [byAcr.get(groupAcr)!.id as number]
      : (groups ?? []).map((g) => g.id as number);
  if (groupIds.length === 0)
    return {
      q: term,
      group: groupAcr,
      leg: legislature,
      groups: [],
      results: [],
    };

  // Adhésions actives aujourd'hui
  const { data: mem, error: mErr } = await supabase
    .from("deputy_group_memberships")
    .select("deputy_id, group_id, from_date, to_date")
    .in("group_id", groupIds);
  if (mErr) throw createError({ statusCode: 500, statusMessage: mErr.message });

  const active = (mem ?? []).filter(
    (r) => r.from_date <= today && (r.to_date === null || r.to_date >= today)
  );
  const deputyIdsActive = Array.from(
    new Set(active.map((r) => r.deputy_id))
  ).filter(Boolean) as number[];

  // Compteurs par groupe (tous actifs, non filtrés par q)
  const countActiveByGroup = new Map<number, number>();
  for (const r of active)
    countActiveByGroup.set(
      r.group_id as number,
      (countActiveByGroup.get(r.group_id as number) ?? 0) + 1
    );

  if (deputyIdsActive.length === 0) {
    return {
      q: term,
      group: groupAcr,
      leg: legislature,
      groups: (groups ?? []).map((g) => ({
        id: g.acronym,
        label: `${g.acronym} — ${g.name}`,
        color: g.color,
        countActive: countActiveByGroup.get(g.id as number) ?? 0,
      })),
      results: [],
    };
  }

  // Députés (filtre q si ≥ 2 chars)
  let depQuery = supabase
    .from("deputies")
    .select("id, full_name, slug, circ, departement, photo_url")
    .in("id", deputyIdsActive);
  if (hasTerm) depQuery = depQuery.ilike("full_name", `%${term}%`);
  const { data: deps, error: dErr } = await depQuery;
  if (dErr) throw createError({ statusCode: 500, statusMessage: dErr.message });

  const depMap = new Map<number, Deputy>(
    (deps ?? []).map((d) => [d.id, d as Deputy])
  );
  const groupsById = new Map<number, Deputy[]>();
  for (const r of active) {
    const d = depMap.get(r.deputy_id as number);
    if (!d) continue;
    const arr = groupsById.get(r.group_id as number) ?? [];
    arr.push(d);
    groupsById.set(r.group_id as number, arr);
  }

  const results = (groups ?? [])
    .filter((g) => groupsById.has(g.id as number))
    .map((g) => {
      const list = (groupsById.get(g.id as number) ?? []).slice();
      list.sort((a, b) =>
        a.full_name.localeCompare(b.full_name, "fr", { sensitivity: "base" })
      );
      return {
        groupId: g.id as number,
        acronym: g.acronym as string,
        name: g.name as string,
        color: g.color as string,
        deputies: list,
        count: list.length,
      };
    })
    .filter((r) => !groupAcr || r.acronym === groupAcr);

  return {
    q: term,
    group: groupAcr,
    leg: legislature,
    // sélecteur avec compteur global actif
    groups: (groups ?? []).map((g) => ({
      id: g.acronym as string,
      label: `${g.acronym} — ${g.name}`,
      color: g.color as string,
      countActive: countActiveByGroup.get(g.id as number) ?? 0,
    })),
    // sections (déjà filtrées par q)
    results,
  };
});
