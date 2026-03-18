"use client";

import { useMemo, useState } from "react";
import { useQueries } from "@tanstack/react-query";
import * as d3 from "d3";
import { taxes } from '@/src/data/taxes';
import { taxeStats } from "@/src/type/TaxeStats";
import { years as allYears } from "@/src/data/years";
import Temporelle_svg from "../svg/Temporelle_svg";
import { fetchTaxeData } from "@/src/services/taxeStatService";

export default function Temporelle() {
    const [taxe, setTaxe] = useState("cves");
    const [minYear, setMinYear] = useState<number>(2018);
    const [maxYear, setMaxYear] = useState<number>(2022);
    const [activeRegion, setActiveRegion] = useState<string | null>(null);

    const yearsToFetch = useMemo(() => d3.range(minYear, maxYear + 1), [minYear, maxYear]);

    const results = useQueries({
        queries: yearsToFetch.map(year => ({
            queryKey: ['taxeYear', taxe, year],
            queryFn: () => fetchTaxeData(taxe, year, "taux"),
            staleTime: 1000 * 60 * 2, // 2 minutes
        }))
    });

    // React-Query (cache)
    const data = useMemo(() => {
        return results.map(r => r.data).filter(Boolean).flat() as taxeStats[];
    }, [results]);

    const isLoading = results.some(r => r.isLoading);

    // Régions
    const regions = useMemo(() => {
        return Array.from(new Set(data.map(d => d.region)));
    }, [data]);

    // Filtres 
    const startYears = useMemo(() => allYears.filter(y => y <= maxYear), [maxYear]);
    const endYears = useMemo(() => allYears.filter(y => y >= minYear), [minYear]);

    const colorScale = useMemo(() => {
        return d3.scaleOrdinal<string>().domain(regions).range(d3.schemeTableau10);
    }, [regions]);

    return (
        <section className="w-full max-w-4xl">
            {isLoading ? (
                <div className="h-96 w-full bg-gray-100 animate-pulse rounded-xl" />
            ) : (
                <div className="rounded-xl bg-white text-gray-700 shadow-sm p-6">
                    <div className="flex flex-wrap items-center gap-4 mb-6">
                        <h2 className="text-lg font-bold">Taux moyen par région</h2>

                        <div className="flex items-center gap-2">
                            <label className="text-sm">Taxe</label>
                            <select
                                value={taxe}
                                onChange={e => setTaxe(e.target.value)}
                                className="border rounded px-2 py-1"
                            >
                                {taxes.map(t => <option key={t.route} value={t.route}>{t.label}</option>)}
                            </select>
                        </div>

                        <div className="flex items-center gap-2">
                            <label className="text-sm">De</label>
                            <select
                                value={minYear}
                                onChange={e => setMinYear(Number(e.target.value))}
                                className="border rounded px-2 py-1"
                            >
                                {startYears.map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                            <label className="text-sm">à</label>
                            <select
                                value={maxYear}
                                onChange={e => setMaxYear(Number(e.target.value))}
                                className="border rounded px-2 py-1"
                            >
                                {endYears.map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                        </div>
                    </div>

                    <Temporelle_svg
                        data={data}
                        minYear={minYear}
                        maxYear={maxYear}
                        activeRegion={activeRegion}
                        setActiveRegion={setActiveRegion}
                    />

                    {/* Légende */}
                    <div className="mt-6 flex flex-wrap gap-4 justify-center">
                        {regions.map(region => (
                            <div
                                key={region}
                                className="flex items-center gap-2 cursor-pointer transition-opacity"
                                onMouseEnter={() => setActiveRegion(region)}
                                onMouseLeave={() => setActiveRegion(null)}
                                style={{ opacity: activeRegion === null || activeRegion === region ? 1 : 0.3 }}
                            >
                                <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: colorScale(region) }} />
                                <span className="text-sm">{region}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}