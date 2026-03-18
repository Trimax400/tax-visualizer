"use client";

import { pie, arc, PieArcDatum } from "d3-shape";
import { useMemo } from "react";
import { taxeStats } from "@/src/type/TaxeStats";
import { DiagrammeProps } from "@/src/type/Props";

const COLORS = ["#2563eb", "#16a34a", "#ea580c", "#7c3aed", "#06b6d4", "#f43f5e"];

export default function Digramme_svg({
    data,
    hoveredRegion,
    setHoveredRegion
}: DiagrammeProps) {

    const totalSum = useMemo(
        () => data.reduce((acc, curr) => acc + curr.value, 0),
        [data]
    );

    const pieGenerator = pie<taxeStats>()
        .value(d => d.value)
        .sort(null);

    const arcGenerator = arc<PieArcDatum<taxeStats>>()
        .innerRadius(120)
        .outerRadius(240)
        .cornerRadius(4)
        .padAngle(0.006);

    const arcs = useMemo(() => pieGenerator(data), [data]);

    return (
        <div className="flex flex-col items-center">

            {/* SVG */}
            <svg width={350} height={350} viewBox="-240 -240 480 480">

                {arcs.map((d, i) => {
                    const isActive =
                        hoveredRegion === null ||
                        hoveredRegion.region === d.data.region;

                    return (
                        <path
                            key={`arc-${d.data.region}`}
                            d={arcGenerator(d)!}
                            fill={COLORS[i % COLORS.length]}
                            opacity={isActive ? 1 : 0.3}
                            onMouseEnter={() => setHoveredRegion(d.data)}
                            onMouseLeave={() => setHoveredRegion(null)}
                            className="transition-all duration-300 cursor-pointer"
                        />
                    );
                })}

                {/* Centre */}
                {hoveredRegion && totalSum > 0 && (
                    <text textAnchor="middle" className="text-lg fill-gray-700">
                        <tspan className="font-bold text-xl" x="0" dy="0">{hoveredRegion.region}</tspan>
                        <tspan x="0" dy="1.2em">
                            {Math.round(hoveredRegion.value).toLocaleString()} €
                        </tspan>
                        <tspan x="0" dy="1.2em">
                            {((hoveredRegion.value / totalSum) * 100).toFixed(1)}%
                        </tspan>
                    </text>
                )}
            </svg>

            <div className="md:col-span-3 mt-4">
                <div className="mt-6 flex flex-wrap gap-4 justify-center custom-scrollbar">
                    {arcs.map((d, i) => {
                        const percentage = totalSum > 0 ? ((d.data.value / totalSum) * 100).toFixed(1) : 0;
                        const isActive = hoveredRegion === null || hoveredRegion.region === d.data.region;

                        return (
                            <div
                                key={`legend-${d.data.region}`}
                                onMouseEnter={() => setHoveredRegion(d.data)}
                                onMouseLeave={() => setHoveredRegion(null)}
                                className={` flex items-center gap-2 p-2 rounded-md border transition-all ${isActive
                                    ? "bg-gray-50 shadow-sm scale-[1.02]"
                                    : "border-transparent opacity-50 grayscale-[0.5]"
                                    }`}>
                                <span
                                    className="w-3 h-3 rounded-sm"
                                    style={{ backgroundColor: COLORS[i % COLORS.length] }}
                                />

                                <div className="flex flex-col min-w-0">
                                    <span className="text-xs font-bold text-gray-800 truncate">
                                        {d.data.region}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] text-gray-600 font-semibold">{percentage}%</span>
                                        <span className="text-[10px] text-gray-400 truncate">
                                            {Math.round(d.data.value).toLocaleString()} €
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

        </div>
    );
}
