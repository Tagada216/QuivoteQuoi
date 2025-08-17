import { serverSupabase } from "../../utils/supabase";

type Dec = "POUR" | "CONTRE" | "ABSTENTION" | "NV";

export default defineEventHandler(async (event) => {
  const { id } = event.context.params as { id: string };
  const key = Number(id);
  if (!Number.isFinite(key)) {
    throw createError({
      statusCode: 400,
      statusMessage: "id de scrutin invalide",
    });
  }

  const supabase = serverSupabase();

  // 1) Scrutin (par id interne, fallback sur an_id AN)
  let { data: scrData, error: sErr } = await supabase
    .from("scrutins")
    .select(
      "id, an_id, date, type, objet, legislature_id, url_source, dossier:dossier_id ( id, alias, titre_officiel, url_an )"
    )
    .eq("id", key)
    .single();

  if (sErr || !scrData) {
    const alt = await supabase
      .from("scrutins")
      .select(
        "id, an_id, date, type, objet, legislature_id, url_source, dossier:dossier_id ( id, alias, titre_officiel, url_an )"
      )
      .eq("an_id", key)
      .single();
    scrData = alt.data ?? null;
  }
  if (!scrData)
    throw createError({
      statusCode: 404,
      statusMessage: "Scrutin introuvable",
    });

  const scrutinId = scrData.id;

  // 2) Totaux (POUR/CONTRE/ABST/NV)
  const statsRes = await supabase
    .from("v_scrutin_stats")
    .select("pour, contre, abst, nv")
    .eq("id", scrutinId)
    .single();
  if (statsRes.error)
    throw createError({
      statusCode: 500,
      statusMessage: statsRes.error.message,
    });

  const totals = {
    POUR: Number(statsRes.data.pour) || 0,
    CONTRE: Number(statsRes.data.contre) || 0,
    ABSTENTION: Number(statsRes.data.abst) || 0,
    NV: Number(statsRes.data.nv) || 0,
  };
  const EXPRESSES = totals.POUR + totals.CONTRE;
  const TOTAL = EXPRESSES + totals.ABSTENTION + totals.NV;

  // 3) Buckets par groupe + sièges actuels de l’hémicycle (par législature)
  const [gbRes, seatsRes] = await Promise.all([
    supabase
      .from("v_scrutin_group_buckets")
      .select(
        "group_id, group_name, group_color, pour, contre, abst, nv, total"
      )
      .eq("scrutin_id", scrutinId),
    supabase
      .from("v_group_seats_current")
      .select("group_id, seats")
      .eq("legislature_id", scrData.legislature_id),
  ]);
  if (gbRes.error)
    throw createError({ statusCode: 500, statusMessage: gbRes.error.message });
  if (seatsRes.error)
    throw createError({
      statusCode: 500,
      statusMessage: seatsRes.error.message,
    });

  const seatMap = new Map<string, number>();
  for (const s of seatsRes.data ?? [])
    seatMap.set(String(s.group_id), Number(s.seats));

  const groups = (gbRes.data ?? [])
    .map((g: any) => ({
      id: g.group_id as string,
      acronym: g.group_id as string,
      name: g.group_name as string,
      color: g.group_color as string,
      seats: seatMap.get(g.group_id as string) ?? Number(g.total) ?? 0,
      counts: {
        POUR: Number(g.pour) || 0,
        CONTRE: Number(g.contre) || 0,
        ABSTENTION: Number(g.abst) || 0,
        NV: Number(g.nv) || 0,
      } as Record<Dec, number>,
    }))
    .sort((a, b) => b.seats - a.seats);

  // 4) Liste nominative (hover/clic)
  const depRes = await supabase
    .from("v_scrutin_deputy_votes")
    .select("full_name, slug, group_id, group_color, decision")
    .eq("scrutin_id", scrutinId);
  if (depRes.error)
    throw createError({ statusCode: 500, statusMessage: depRes.error.message });

  const deputies = (depRes.data ?? []).map((d: any) => ({
    fullName: d.full_name as string,
    slug: (d.slug as string) ?? null,
    groupId: d.group_id as string,
    groupColor: d.group_color as string,
    decision: d.decision as Dec,
  }));

  return {
    scrutin: scrData,
    totals: { ...totals, EXPRESSES, TOTAL },
    groups,
    deputies,
  };
});
