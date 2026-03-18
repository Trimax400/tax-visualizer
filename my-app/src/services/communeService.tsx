import { CommuneData } from "@/src/type/CommuneData";
import { Departement } from "@/src/type/Departement";
import { API_BASE_URL } from "@/src/data/api";

export const fetchDepartements = async (): Promise<Departement[]> => {
    const res = await fetch(`${API_BASE_URL}/api/departements`)
    if (!res.ok) throw new Error("Erreur départements");
    const apiData = await res.json();
    return apiData.member.map((d: any) => ({ nom: d.nom }));
};

export const fetchCommuneStats = async (
    taxe: string,
    dep: string,
    year: number
): Promise<CommuneData[]> => {
    const res = await fetch(
        `${API_BASE_URL}/api/${taxe}?departement.nom=${dep}&annee=${year}&order[tauxNet]=desc&pagination=false`
    );
    if (!res.ok) throw new Error("Erreur stats communes");
    const apiData = await res.json();

    return (apiData.member || []).map((d: any) => ({
        commune: d.nomCommune,
        departement: dep,
        year: d.annee,
        taxType: taxe,
        taxRate: d.tauxNet,
        volume: d.montantReel,
    }));
};
