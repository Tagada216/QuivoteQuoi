// scripts/fetch-deputy-photos.js
// Usage: node scripts/fetch-deputy-photos.js --leg=17
import sharp from "sharp";
import { createClient } from "@supabase/supabase-js";

const UA =
  process.env.QVQ_UA ||
  "QuiVoteQuoi/0.1 (+https://example.com; hello@axilia.pro)";

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
} // remplace par ta clé de service

const BUCKET = process.env.QVQ_BUCKET;
if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false },
});

// QIDs des législatures (Wikidata)
const LEG =
  process.argv.find((a) => a.startsWith("--leg="))?.split("=")[1] || "17";
const LEG_QID = LEG === "16" ? "Q112567597" : "Q126471296"; // XVI / XVII  :contentReference[oaicite:0]{index=0}

// SPARQL : députés de la législature (P39 = membre AN Q3044918, qualifié par P2937 = législature)
// + identifiants AN (P4123) et Sycomore (P1045) + portrait (P18)
const SPARQL = `
SELECT ?item ?itemLabel ?anid ?syco ?img WHERE {
  ?item p:P39 ?st .
  ?st ps:P39 wd:Q3044918 ; pq:P2937 wd:${LEG_QID} .   # membre AN + terme ${LEG}
  OPTIONAL { ?item wdt:P4123 ?anid }                   # French National Assembly ID
  OPTIONAL { ?item wdt:P1045 ?syco }                   # Sycomore ID
  OPTIONAL { ?item wdt:P18   ?img }                    # portrait
  SERVICE wikibase:label { bd:serviceParam wikibase:language "fr,en". }
}`; // P39 position held, P2937 parliamentary term, Q3044918 "member of the French National Assembly" :contentReference[oaicite:1]{index=1}

async function sparql(query) {
  const url =
    "https://query.wikidata.org/sparql?format=json&query=" +
    encodeURIComponent(query);
  let attempt = 0;
  while (true) {
    attempt++;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        accept: "application/sparql-results+json",
        "user-agent": UA,
      },
    });
    if (res.ok) return res.json();

    // 403/429 → backoff progressif
    if ((res.status === 403 || res.status === 429) && attempt <= 6) {
      const wait =
        Math.min(30000, 500 * 2 ** attempt) + Math.floor(Math.random() * 300);
      console.warn(`WDQS ${res.status} → retry #${attempt} dans ${wait}ms`);
      await sleep(wait);
      continue;
    }
    const text = await res.text();
    throw new Error(`SPARQL ${res.status} ${text.slice(0, 200)}`);
  }
}

async function fetchCommonsMeta(fileTitle) {
  // fileTitle = full URL or "https://commons.wikimedia.org/wiki/Special:FilePath/..." or "https://.../File:..."
  // On normalise vers "File:Name.ext"
  let title = fileTitle;
  if (title.startsWith("http")) {
    const m = title.match(/(?:File:|Fichier:)(.+)$/i);
    if (m) title = "File:" + decodeURIComponent(m[1]);
    else title = "File:" + decodeURIComponent(title.split("/").pop());
  }
  const u = new URL("https://commons.wikimedia.org/w/api.php");
  u.search = new URLSearchParams({
    action: "query",
    titles: title,
    prop: "imageinfo",
    iiprop: "url|extmetadata",
    iiurlwidth: "768",
    format: "json",
    origin: "*", // inutile en Node mais ok
  }).toString();
  const r = await fetch(u, { headers: { "user-agent": UA } });

  const j = await r.json();
  const page = Object.values(j.query.pages)[0];
  const ii = page?.imageinfo?.[0];
  if (!ii) return null;
  const meta = ii.extmetadata || {};
  const credit = (meta.Artist?.value || meta.Credit?.value || "")
    .replace(/<[^>]*>/g, "")
    .trim();
  const license = (meta.LicenseShortName?.value || "").trim();
  const licenseUrl = (meta.LicenseUrl?.value || "").trim();
  return {
    downloadUrl: ii.thumburl || ii.url,
    sourceUrl: `https://commons.wikimedia.org/wiki/${encodeURIComponent(
      title
    )}`,
    credit,
    license: license || "CC (voir source)",
    licenseUrl,
  };
}

async function toWebP(buffer) {
  return sharp(buffer)
    .resize(512, 512, { fit: "cover" })
    .webp({ quality: 82 })
    .toBuffer();
}

async function uploadToSupabase({ leg, an_id, webpBuffer }) {
  const path = `${leg}/${an_id}.webp`;
  const { error: upErr } = await supabase.storage
    .from(BUCKET)
    .upload(path, webpBuffer, {
      contentType: "image/webp",
      upsert: true,
    });
  if (upErr && !upErr.message.includes("exists")) throw upErr;
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

async function updateDB({ an_id, photo_url, credit, license, sourceUrl }) {
  const fields = {
    photo_url: photo_url,
    photo_credit: credit || null,
    photo_license: license || null,
    photo_source_url: sourceUrl || null,
  };
  const { error } = await supabase
    .from("deputies")
    .update(fields)
    .eq("an_id", an_id)
    .eq("legislature_id", Number(LEG));
  if (error) {
    // fallback par nom si jamais l'an_id ne matche pas (rare)
    // (désactivé par défaut; dé-commente si besoin)
    // await supabase.from('deputies').update(fields).eq('full_name', name).eq('legislature_id', Number(LEG))
    throw error;
  }
}

async function main() {
  console.log(`→ Récupération Wikidata (leg=${LEG})…`);
  const json = await sparql(SPARQL);
  const rows = json.results.bindings
    .map((b) => ({
      name: b.itemLabel?.value,
      an_id: b.anid?.value || null,
      syco: b.syco?.value || null,
      image: b.img?.value || null,
    }))
    .filter((x) => x.image); // on ne traite que ceux avec P18

  console.log(`Trouvé ${rows.length} entrées avec photo (P18).`);
  let done = 0,
    ok = 0,
    ko = 0;

  // petite limite de parallélisme
  const pool = Number(process.env.QVQ_POOL || 3);
  const queue = [...rows];
  const workers = Array.from({ length: pool }, async () => {
    while (queue.length) {
      const r = queue.shift();
      try {
        const an_id = r.an_id || r.syco; // on privilégie P4123; sinon P1045
        if (!an_id) {
          ko++;
          continue;
        }
        const meta = await fetchCommonsMeta(r.image);
        if (!meta) {
          ko++;
          continue;
        }
        const imgRes = await fetch(meta.downloadUrl);
        const buf = Buffer.from(await imgRes.arrayBuffer());
        const webp = await toWebP(buf);
        const publicUrl = await uploadToSupabase({
          leg: LEG,
          an_id,
          webpBuffer: webp,
        });
        await updateDB({
          an_id,
          photo_url: publicUrl,
          credit: meta.credit,
          license: meta.license,
          sourceUrl: meta.sourceUrl,
        });
        ok++;
        process.stdout.write(`✔︎ ${r.name}\n`);
      } catch (e) {
        ko++;
        process.stdout.write(`✖︎ ${r.name} → ${e.message}\n`);
      } finally {
        done++;
      }
    }
  });
  await Promise.all(workers);
  console.log(`Terminé: OK=${ok} KO=${ko} (total ${done})`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
