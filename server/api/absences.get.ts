import { serverSupabase } from "../utils/supabase";

export default defineEventHandler(async (event) => {
  const q = getQuery(event);

  const mode = (q.mode as string) === "deputies" ? "deputies" : "groups";
  const leg = q.leg ? Number(q.leg) : undefined;

  // tri
  const sort = (q.sort as string) || "rate"; // rate | nv | scrutins | present
  const dir =
    ((q.order as string) || "desc").toLowerCase() === "asc" ? "asc" : "desc";

  // pagination (uniquement pour deputies)
  const page = Math.max(1, parseInt((q.page as string) || "1"));
  const pageSize = Math.min(
    100,
    Math.max(1, parseInt((q.pageSize as string) || "30"))
  );
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const supabase = serverSupabase();

  if (mode === "groups") {
    // GROUPES : pas de pagination nécessaire (10-12 lignes)
    let req = supabase
      .from("v_absences_group")
      .select(
        "legislature_id, group_id, group_name, group_color, scrutins, nv, present"
      );

    if (leg) req = req.eq("legislature_id", leg);

    const { data, error } = await req;
    if (error)
      throw createError({ statusCode: 500, statusMessage: error.message });

    // calcul du rate côté API
    const rows = (data || []).map((r) => ({
      ...r,
      rate: r.scrutins ? r.nv / r.scrutins : 0,
    }));

    const sortKey = (r: any) =>
      sort === "nv"
        ? r.nv
        : sort === "scrutins"
        ? r.scrutins
        : sort === "present"
        ? r.present
        : r.rate;

    rows.sort((a, b) => {
      const A = sortKey(a),
        B = sortKey(b);
      return dir === "asc" ? A - B : B - A;
    });

    return { mode, items: rows, total: rows.length };
  }

  // DÉPUTÉS
  let req = supabase
    .from("v_absences_deputy")
    .select(
      "legislature_id, deputy_id, full_name, slug, group_id, group_name, group_color, scrutins, nv, present",
      { count: "exact" }
    );

  if (leg) req = req.eq("legislature_id", leg);
  if (q.group) req = req.eq("group_id", q.group as string);
  if (q.q) req = req.ilike("full_name", `%${q.q}%`);

  // On ne peut pas trier par "rate" côté SQL (car pas une colonne) → tri client
  const { data, count, error } = await req.range(from, to);
  if (error)
    throw createError({ statusCode: 500, statusMessage: error.message });

  const rows = (data || []).map((r) => ({
    ...r,
    rate: r.scrutins ? r.nv / r.scrutins : 0,
  }));

  const sortKey = (r: any) =>
    sort === "nv"
      ? r.nv
      : sort === "scrutins"
      ? r.scrutins
      : sort === "present"
      ? r.present
      : r.rate;

  rows.sort((a, b) => {
    const A = sortKey(a),
      B = sortKey(b);
    return dir === "asc" ? A - B : B - A;
  });

  const total = count ?? rows.length;
  return {
    mode,
    items: rows,
    page,
    pageSize,
    total,
    pageCount: Math.max(1, Math.ceil(total / pageSize)),
    hasNext: page * pageSize < total,
    hasPrev: page > 1,
  };
});
