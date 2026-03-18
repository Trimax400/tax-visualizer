"use client";

import * as d3 from "d3";
import { useMemo } from "react";
import { taxeStats } from "@/src/type/TaxeStats";
import { TemporelleProps } from "@/src/type/Props";

export default function Temporelle_svg({
  data,
  minYear,
  maxYear,
  activeRegion,
  setActiveRegion,
}: TemporelleProps) {

  const width = 1100;
  const height = 700;
  const margin = { top: 60, right: 50, bottom: 60, left: 80 };

  const yearsRange = useMemo(
    () => d3.range(minYear, maxYear + 1),
    [minYear, maxYear]
  );

  const groupedData = useMemo(
    () => d3.group(data, d => d.region),
    [data]
  );

  const regions = useMemo(
    () => Array.from(new Set(data.map(d => d.region))),
    [data]
  );

  const xScale = useMemo(() => {
    return d3.scalePoint<number>()
      .domain(yearsRange)
      .range([margin.left, width - margin.right]);
  }, [yearsRange]);

  const yMax = d3.max(data, d => d.value) ?? 0;

  const yScale = useMemo(() => {
    return d3.scaleLinear()
      .domain([0, yMax + 1])
      .nice()
      .range([height - margin.bottom, margin.top]);
  }, [yMax]);

  const yTicks = yScale.ticks(5);

  const colorScale = useMemo(() => {
    return d3.scaleOrdinal<string>()
      .domain(regions)
      .range(d3.schemeTableau10);
  }, [regions]);

  const line = d3.line<any>()
    .x(d => xScale(d.year)!)
    .y(d => yScale(d.value))
    .curve(d3.curveMonotoneX);

  return (
    <div className="w-full rounded-xl bg-white shadow-sm p-6">
      <div className="w-full aspect-[16/10]">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full"
        >
          {/* Grid */}

          {/* Axe Y */}
          {yTicks.map(tick => (
            <g key={`y-axis-${tick}`}>
              {/* ligne */}
              <line
                x1={margin.left}
                x2={width - margin.right}
                y1={yScale(tick)}
                y2={yScale(tick)}
                stroke="#eee"
              />
              {/* Le texte de la métrique */}
              <text
                x={margin.left - 10}
                y={yScale(tick)}
                dy="0.32em" 
                textAnchor="end"
                fontSize="16"
                fill="#666"
              >
                {tick}
              </text>
            </g>
          ))}

          {/*Axe X */}
          {yearsRange.map(year => (
            <text
              key={`x-axis-${year}`}
              x={xScale(year)}
              y={height - margin.bottom + 25}
              textAnchor="middle"
              fontSize="16"
              fill="#666"
            >
              {year}
            </text>
          ))} 

          {/* Lignes */}
          {[...groupedData.entries()].map(([region, values]) => {
            const isActive =
              activeRegion === null || activeRegion === region;

            return (
              <path
                key={region}
                d={line(values)!}
                fill="none"
                stroke={colorScale(region)}
                strokeWidth={isActive ? 3 : 1.5}
                opacity={isActive ? 1 : 0.2}
                onMouseEnter={() => setActiveRegion(region)}
                onMouseLeave={() => setActiveRegion(null)}
                className="transition-all duration-200"
              />
            );
          })}

          {/* Points */}
          {[...groupedData.entries()].flatMap(([region, values]) =>
            values.map(d => {
              const isActive =
                activeRegion === null || activeRegion === region;

              return (
                <circle
                  key={`${region}-${d.year}`}
                  cx={xScale(d.year)}
                  cy={yScale(d.value)}
                  r={isActive ? 4 : 3}
                  fill={colorScale(region)}
                  opacity={isActive ? 1 : 0.3}
                />
              );
            })
          )}
        </svg>
      </div>
    </div>
  );
}
