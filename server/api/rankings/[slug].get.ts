import { serverSupabase } from "../../utils/supabase";

type Row = {
  groupId: string;
  acronym: string;
  name: string;
  color: string;
  score: number | null; // aligned / expressed
  expressedVotes: number; // expressed
};

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug")!;
  const legParam = (getQuery(event).leg as string | undefined) || undefined;
  const leg = legParam ? Number(legParam) : null;

  const supabase = serverSupabase();

  // 1) Données d’agrégats
  let q = supabase
    .from("v_rank_category_group")
    .select(
      "legislature_id, category_slug, category_name, group_id, aligned, expressed"
    )
    .eq("category_slug", slug);

  if (leg) q = q.eq("legislature_id", leg);

  const { data, error } = await q;
  if (error)
    throw createError({ statusCode: 500, statusMessage: error.message });

  // 2) Compléter nom/couleur depuis groups (même législature si fournie)
  const acronyms = [...new Set((data ?? []).map((r) => r.group_id))];
  let groupsInfo: Record<string, { name: string; color: string }> = {};

  if (acronyms.length) {
    let gq = supabase
      .from("groups")
      .select("acronym, name, color, legislature_id")
      .in("acronym", acronyms);

    if (leg) gq = gq.eq("legislature_id", leg);

    const gi = await gq;
    if (gi.error)
      throw createError({ statusCode: 500, statusMessage: gi.error.message });

    groupsInfo = Object.fromEntries(
      (gi.data ?? []).map((g) => [
        g.acronym,
        { name: g.name as string, color: g.color as string },
      ])
    );
  }

  // 3) Mise en forme finale pour le front
  const rows: Row[] = (data ?? []).map((r) => {
    const info = groupsInfo[r.group_id] ?? { name: r.group_id, color: "#888" };
    const score = r.expressed ? r.aligned / r.expressed : null;
    return {
      groupId: r.group_id,
      acronym: r.group_id,
      name: info.name,
      color: info.color,
      score,
      expressedVotes: r.expressed,
    };
  });

  return rows;
});
