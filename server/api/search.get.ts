// server/api/search.get.ts
import { serverSupabase } from "../utils/supabase";

export default defineEventHandler(async (event) => {
  const q = getQuery(event);

  const page = Math.max(1, parseInt((q.page as string) || "1"));
  const pageSize = Math.min(
    50,
    Math.max(1, parseInt((q.pageSize as string) || "20"))
  );
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const supabase = serverSupabase();

  // Sélection depuis la TABLE (pas la vue) => relation "dossiers" dispo
  let req = supabase
    .from("scrutins")
    .select(
      "id, an_id, legislature_id, date, type, objet, url_source, dossier:dossiers ( id, alias, titre_officiel )",
      { count: "exact" }
    );

  // Filtres
  if (q.leg) req = req.eq("legislature_id", Number(q.leg));
  if (q.type && q.type !== "tous") req = req.eq("type", q.type);

  // Recherche plein texte simple sur l'objet
  if (q.q) req = req.ilike("objet", `%${q.q}%`);

  const { data, count, error } = await req
    .order("date", { ascending: false })
    .range(from, to);

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message });
  }

  return {
    q: (q.q as string) || null,
    leg: q.leg ? Number(q.leg) : null,
    type: ((q.type as string) || "tous") as
      | "tous"
      | "ordinaire"
      | "solennel"
      | "censure",
    dossiers: [], // tu peux ignorer ce champ ou le remplir plus tard
    scrutins: data ?? [],
    page,
    pageSize,
    total: count ?? 0,
    pageCount: Math.max(1, Math.ceil((count ?? 0) / pageSize)),
    hasNext: page * pageSize < (count ?? 0),
    hasPrev: page > 1,
  };
});
