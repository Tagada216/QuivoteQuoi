export type ScrutinRow = {
  id: number;
  an_id: number;
  date: string;
  type: string | null;
  objet: string;
  dossier_id: number | null;
  legislature_id: number | null;
  url_source: string;
};

export type DossierRow = {
  id: number;
  titre: string;
  resume: string | null;
  url_an: string | null;
  url_legifrance: string | null;
  nor: string | null;
};

export interface Database {
  public: {
    Tables: {
      scrutins: { Row: ScrutinRow };
      dossiers: { Row: DossierRow };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}
