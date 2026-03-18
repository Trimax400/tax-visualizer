'use client'

import { pie, arc } from "d3-shape";
import { useEffect, useMemo, useState } from "react";
import { taxes } from '@/src/data/taxes';
import { taxeStats } from "@/src/type/TaxeStats";
import { years } from "@/src/data/years";
import Digramme_svg from "../svg/Diagramme_svg";
import { fetchTaxeData } from "@/src/services/taxeStatService";
import { useQuery } from "@tanstack/react-query";

const COLORS = ["#2563eb", "#16a34a", "#ea580c", "#7c3aed", "#06b6d4", "#f43f5e"];

export default function Diagramme() {
    const [taxe, setTaxe] = useState("cves");
    const [selectedYear, setSelectedYear] = useState<number>(2022);
    const [hoveredRegion, setHoveredRegion] = useState<taxeStats | null>(null);

    const { data: data = [], isLoading } = useQuery<taxeStats[]>({
        queryKey: ['diagrammeData', taxe, selectedYear],
        queryFn: () => fetchTaxeData(taxe, selectedYear, "montant"),
        staleTime: 1000 * 60 * 2, // Cache de 2 minutes
        placeholderData: (prev) => prev,
    });

    return (
        <section className="w-full max-w-5xl bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Impôt collecté par région</h2>
                {isLoading && <span className="text-sm text-blue-500 animate-pulse">Chargement...</span>}
            </div>

            <div className="flex gap-4 mb-8">
                <select value={taxe} onChange={e => setTaxe(e.target.value)} className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500m"
                >
                    {taxes.map(t => <option key={t.route} value={t.route}>{t.label}</option>)}
                </select>
                <select value={selectedYear} onChange={e => setSelectedYear(Number(e.target.value))} className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500m"
                >
                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                <div className="md:col-span-3 flex justify-center relative">
                    <Digramme_svg
                        data={data}
                        hoveredRegion={hoveredRegion}
                        setHoveredRegion={setHoveredRegion}
                    />
                </div>
            </div>
        </section>
    );
}