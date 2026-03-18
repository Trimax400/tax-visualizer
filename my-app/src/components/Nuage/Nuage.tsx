"use client";

import { useEffect, useMemo, useState } from "react";
import * as d3 from "d3";
import { taxes } from '@/src/data/taxes';
import { CommuneData } from "@/src/type/CommuneData";
import { Departement } from "@/src/type/Departement";
import { years } from "@/src/data/years";
import Nuage_svg from "@/src/components/svg/Nuage_svg";
import { fetchDepartements, fetchCommuneStats } from "@/src/services/communeService";
import { useQuery } from "@tanstack/react-query";

export default function Nuage() {
  const [year, setYear] = useState(2022);
  const [taxe, setTaxe] = useState("cves");

  //const [departements, setDepartements] = useState<Departement[]>([]);
  const [selectedDepartement, setSelectedDepartement] = useState<string>("");
  const [hovered, setHovered] = useState<string | null>(null);

  //const [data, setData] = useState<CommuneData[]>([]);
  //const [isLoading, setIsLoading] = useState(false);

  const [isExpanded, setIsExpanded] = useState(false);

  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    data: CommuneData;
  } | null>(null);

  const width = 700;
  const height = 420;
  const margin = { top: 40, right: 30, bottom: 50, left: 60 };

  /**
  * Récupérer tous les départements
  */
  const { data: departements = [] } = useQuery({
    queryKey: ['departements'],
    queryFn: fetchDepartements,
    staleTime: Infinity, // Les départements ne changent jamais en théorie
  });

  // Sélectionne le premier département pour le select
  useMemo(() => {
    if (departements.length > 0 && !selectedDepartement) {
      setSelectedDepartement(departements[0].nom);
    }
  }, [departements, selectedDepartement]);

  /**
   * Récupérer les communes en fonction du départements
   */
  const { data = [], isLoading } = useQuery({
    queryKey: ['nuageData', taxe, selectedDepartement, year],
    queryFn: () => fetchCommuneStats(taxe, selectedDepartement, year),
    enabled: !!selectedDepartement, // attente d'un département
    placeholderData: (prev) => prev,
    staleTime: 1000 * 60 * 2, // Cache de 2 minutes
  });

  const communes = useMemo(() => {
    return Array.from(new Set(data.map(d => d.commune)));
  }, [data]);


  /**
 * Couleurs
 */


  const colorScale = useMemo(() => {
    return d3.scaleOrdinal<string>()
      .domain(communes)
      .range(d3.schemeTableau10);
  }, [communes]);

  /**
   * Scales
   */
  const xScale = useMemo(() => {
    const domain = data.length
      ? d3.extent(data, d => d.taxRate) as [number, number]
      : [0, 100];

    return d3.scaleLinear()
      .domain(domain)
      .nice()
      .range([margin.left, width - margin.right]);
  }, [data]);

  const yScale = useMemo(() => {
    const domain = data.length
      ? d3.extent(data, d => d.volume) as [number, number]
      : [0, 1000000];

    return d3.scaleLinear()
      .domain(domain)
      .nice()
      .range([height - margin.bottom, margin.top]);
  }, [data]);


  if (!xScale || !yScale) return <p>Chargement...</p>;


  const xTicks = xScale.ticks(5);
  const yTicks = yScale.ticks(5);

  return (
    <section className="w-full max-w-5xl">
      <div className="rounded-xl bg-white shadow-sm p-6">

        <h2 className="text-2xl font-semibold text-gray-800 mb-1">
          Relation taux d'imposition / Volume collecté
        </h2>

        {/* Options */}
        <div className="mb-6 flex flex-wrap gap-4">

          <select
            value={taxe}
            onChange={e => setTaxe(e.target.value)}
            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500m"
          >
            {taxes.map(t => (
              <option key={t.route} value={t.route}>{t.label}</option>
            ))}
          </select>

          <select
            value={year}
            onChange={e => setYear(+e.target.value)}
            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>

          <select
            value={selectedDepartement}
            onChange={e => setSelectedDepartement(e.target.value)}
            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {departements.map(dep => (
              <option key={dep.nom} value={dep.nom}>
                {dep.nom}
              </option>
            ))}
          </select>

        </div>

        {isLoading && <p className="text-gray-400">Chargement...</p>}

        {/* SVG */}
        <Nuage_svg
          data={data}
          width={width}
          height={height}
          margin={margin}
          hovered={hovered}
          setHovered={setHovered}
          setTooltip={setTooltip}
        />


        {tooltip && (
          <div
            className="fixed z-50 bg-white shadow-lg rounded-lg px-4 py-2 text-sm border border-gray-200 pointer-events-none"
            style={{
              left: tooltip.x,
              top: tooltip.y - 10,
              transform: "translate(-50%, -100%)"
            }}
          >
            <div className="font-semibold text-gray-800">
              {tooltip.data.commune}
            </div>
            <div className="text-gray-600">
              Taux : {tooltip.data.taxRate.toFixed(2)} %
            </div>
            <div className="text-gray-600">
              Volume : {d3.format(",")(tooltip.data.volume)} €
            </div>
          </div>
        )}

        {/* Légende */}
        <div className="mt-8 border-t pt-6">
          <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center transition-all">
            {(isExpanded ? communes : communes.slice(0, 30)).map(commune => (
              <div
                key={commune}
                onMouseEnter={() => setHovered(commune)}
                onMouseLeave={() => setHovered(null)}
                className="flex items-center gap-2 cursor-pointer group"
                style={{ width: 'fit-content' }} // Empêche certains comportements de saut
              >
                <span
                  className={`w-3 h-3 rounded-full transition-transform ${hovered === commune ? "scale-125" : "scale-100"}`}
                  style={{ backgroundColor: colorScale(commune) }}
                />
                <span
                  className={`text-sm transition-colors ${hovered === commune
                    ? "text-blue-600 font-medium" // On évite le bold extrême pour le saut de ligne
                    : "text-gray-500"
                    }`}
                >
                  {commune}
                </span>
              </div>
            ))}
          </div>

          {/* Bouton Voir plus / Voir moins */}
          {communes.length > 30 && (
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
              >
                {isExpanded ? (
                  <>
                    Voir moins
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                  </>
                ) : (
                  <>
                    Voir les {communes.length - 30} autres villes
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
