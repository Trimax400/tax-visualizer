import { taxeStats } from "@/src/type/TaxeStats";
import { API_BASE_URL } from "@/src/data/api";

export const fetchTaxeData = async (taxe: string, year: number, metric: string): Promise<taxeStats[]> => {
    const response = await fetch(
        `${API_BASE_URL}/api/${taxe}/stats?annee=${year}&groupBy=region&metric=${metric}`
    );

    if (!response.ok) {
        throw new Error(`Erreur API pour l'année ${year}`);
    }

    const apiData = await response.json();

    return apiData.member.map((d: any) => ({
        region: d.label,
        year: year,
        value: d.value,
    }));
};
