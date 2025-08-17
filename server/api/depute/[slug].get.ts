import { serverSupabase } from "../../utils/supabase";

export default defineEventHandler(async (event) => {
  const { slug } = event.context.params as { slug: string };
  const supabase = serverSupabase();
  const today = new Date().toISOString().slice(0, 10);

  // Deputy
  const { data: dep, error: dErr } = await supabase
    .from("deputies")
    .select("id, full_name, slug, circ, departement, photo_url, legislature_id")
    .eq("slug", slug)
    .single();
  if (dErr || !dep)
    throw createError({ statusCode: 404, statusMessage: "Député introuvable" });

  // Group (actif aujourd'hui)
  const { data: mem, error: mErr } = await supabase
    .from("deputy_group_memberships")
    .select("group_id, from_date, to_date")
    .eq("deputy_id", dep.id);
  if (mErr) throw createError({ statusCode: 500, statusMessage: mErr.message });
  const active = (mem ?? []).find(
    (r) => r.from_date <= today && (r.to_date === null || r.to_date >= today)
  );
  let group = null as null | { acronym: string; name: string; color: string };
  if (active) {
    const { data: g } = await supabase
      .from("groups")
      .select("acronym, name, color")
      .eq("id", active.group_id)
      .single();
    if (g)
      group = {
        acronym: g.acronym as string,
        name: g.name as string,
        color: g.color as string,
      };
  }

  // Derniers votes (10) avec scrutin + dossier
  const { data: votes, error: vErr } = await supabase
    .from("votes")
    .select(
      `
      decision,
      scrutin:scrutin_id (
        id, date, type, objet,
        dossier:dossier_id ( alias, titre_officiel )
      )
    `
    )
    .eq("deputy_id", dep.id)
    .order("scrutin(date)", { ascending: false })
    .limit(10);
  if (vErr) throw createError({ statusCode: 500, statusMessage: vErr.message });

  return { deputy: dep, group, votes: votes ?? [] };
});
