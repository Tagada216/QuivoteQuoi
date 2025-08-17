import { serverSupabase } from "../utils/supabase";

export default defineEventHandler(async (event) => {
  const q = getQuery(event);
  const group = (q.group as string) || undefined;
  const search = (q.q as string) || undefined;

  const supabase = serverSupabase();
  let req = supabase
    .from("v_condamnations")
    .select(
      "id, deputy_id, full_name, slug, title, decision_date, status, source_url, group_id, group_name, group_color"
    );

  if (group) req = req.eq("group_id", group);
  if (search) {
    // recherche simple sur nom & texte
    req = req
      .ilike("full_name", `%${search}%`)
      .or(`title.ilike.%${search}%,details.ilike.%${search}%`);
  }

  const { data, error } = await req
    .order("decision_date", { ascending: false, nullsFirst: false })
    .limit(200);
  if (error)
    throw createError({ statusCode: 500, statusMessage: error.message });

  return data ?? [];
});
