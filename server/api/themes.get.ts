export default defineEventHandler(async () => {
  const supabase = serverSupabase();
  const { data, error } = await supabase
    .from("categories")
    .select("slug, name")
    .order("name", { ascending: true });
  if (error)
    throw createError({ statusCode: 500, statusMessage: error.message });
  return data ?? [];
});
