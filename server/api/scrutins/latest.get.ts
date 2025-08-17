export default defineEventHandler(async (event) => {
  const q = getQuery(event);
  const limit = Math.max(1, Math.min(12, Number(q.limit ?? 3)));
  const leg = q.legislature ? Number(q.legislature) : undefined;

  const supabase = serverSupabase();

  // Scrutins récents (+ dossier)
  let s = supabase
    .from("scrutins")
    .select(
      `
      id, an_id, date, type, objet, legislature_id, url_source,
      dossier:dossier_id ( id, alias, titre_officiel )
    `
    )
    .order("date", { ascending: false })
    .limit(limit);
  if (leg) s = s.eq("legislature_id", leg);

  const { data: scrutins, error: sErr } = await s;
  if (sErr) throw createError({ statusCode: 500, statusMessage: sErr.message });

  const ids = (scrutins ?? []).map((r) => r.id);
  if (!ids.length) return { items: [] };

  // Votes (agrégats)
  const { data: votes, error: vErr } = await supabase
    .from("votes")
    .select("scrutin_id, decision")
    .in("scrutin_id", ids);
  if (vErr) throw createError({ statusCode: 500, statusMessage: vErr.message });

  const agg = new Map<
    number,
    { POUR: number; CONTRE: number; ABSTENTION: number; NV: number }
  >();
  for (const id of ids)
    agg.set(id, { POUR: 0, CONTRE: 0, ABSTENTION: 0, NV: 0 });
  for (const v of votes ?? []) {
    const a = agg.get(v.scrutin_id)!;
    if (v.decision === "POUR") a.POUR++;
    else if (v.decision === "CONTRE") a.CONTRE++;
    else if (v.decision === "ABSTENTION") a.ABSTENTION++;
    else a.NV++;
  }

  const items = (scrutins ?? []).map((s) => {
    const c = agg.get(s.id)!;
    const dossier = Array.isArray(s.dossier) ? s.dossier[0] : s.dossier;
    return {
      id: s.id,
      date: s.date,
      type: s.type,
      url_source: s.url_source,
      title: dossier?.alias || dossier?.titre_officiel || s.objet,
      subtitle:
        dossier?.titre_officiel && dossier?.alias
          ? dossier.titre_officiel
          : s.objet,
      counts: c,
    };
  });

  return { items };
});
