import { serverSupabase } from "../utils/supabase";

export default defineEventHandler(async () => {
  const supabase = serverSupabase();

  const { data, error } = await supabase
    .from("scrutins")
    .select(
      "id, an_id, date, type, objet, url_source, dossier:dossiers!dossier_id(id, titre)"
    )
    .order("date", { ascending: false })
    .limit(20);

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message });
  }
  return data;
});
