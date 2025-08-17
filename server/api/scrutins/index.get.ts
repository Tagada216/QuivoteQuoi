import { serverSupabase } from "../../utils/supabase";

export default defineEventHandler(async (event) => {
  const q = getQuery(event);

  const page = Math.max(1, parseInt((q.page as string) || "1"));
  const pageSize = Math.min(
    100,
    Math.max(1, parseInt((q.pageSize as string) || "20"))
  );
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const supabase = serverSupabase();

  // On s'appuie sur la vue avec stats. Adapte le nom si tu utilises v_scrutins_with_stats_v2.
  let req = supabase
    .from("v_scrutins_with_stats")
    .select(
      "id, an_id, legislature_id, date, type, objet, pour, contre, abst, nv",
      { count: "exact" }
    );

  // Filtres optionnels
  if (q.leg) req = req.eq("legislature_id", Number(q.leg));
  if (q.type && q.type !== "tous") req = req.eq("type", q.type);
  if (q.q) req = req.ilike("objet", `%${q.q}%`);

  const { data, count, error } = await req
    .order("date", { ascending: false })
    .range(from, to); // inclusif

  if (error)
    throw createError({ statusCode: 500, statusMessage: error.message });

  const total = count ?? 0;
  return {
    items: data ?? [],
    page,
    pageSize,
    total,
    pageCount: Math.max(1, Math.ceil(total / pageSize)),
    hasNext: page * pageSize < total,
    hasPrev: page > 1,
  };
});
