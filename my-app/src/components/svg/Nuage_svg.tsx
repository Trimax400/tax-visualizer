"use client";

import * as d3 from "d3";
import { NuageProps } from "@/src/type/Props";


export default function Nuage_svg({
  data,
  width,
  height,
  margin,
  hovered,
  setHovered,
  setTooltip
}: NuageProps) {

  const communes = Array.from(new Set(data.map(d => d.commune)));

  const colorScale = d3.scaleOrdinal<string>()
    .domain(communes)
    .range(d3.schemeTableau10);

  const xScale = d3.scaleLinear()
    .domain(d3.extent(data, d => d.taxRate) as [number, number] || [0, 100])
    .nice()
    .range([margin.left, width - margin.right]);

  const yScale = d3.scaleLinear()
    .domain(d3.extent(data, d => d.volume) as [number, number] || [0, 100000])
    .nice()
    .range([height - margin.bottom, margin.top]);

  const xTicks = xScale.ticks(5);
  const yTicks = yScale.ticks(5);

  return (
    <svg width={width} height={height} className="mx-auto block">

      {/* Axes */}
      <line
        x1={margin.left}
        x2={margin.left}
        y1={margin.top}
        y2={height - margin.bottom}
        stroke="#9ca3af"
      />
      <line
        x1={margin.left}
        x2={width - margin.right}
        y1={height - margin.bottom}
        y2={height - margin.bottom}
        stroke="#9ca3af"
      />

      {/* Y ticks */}
      {yTicks.map(t => (
        <text
          key={t}
          x={margin.left - 10}
          y={yScale(t)}
          textAnchor="end"
          alignmentBaseline="middle"
          fontSize="11"
        >
          {d3.format(".2s")(t)}
        </text>
      ))}

      {/* X ticks */}
      {xTicks.map(t => (
        <text
          key={t}
          x={xScale(t)}
          y={height - margin.bottom + 18}
          textAnchor="middle"
          fontSize="11"
        >
          {t.toFixed(1)}
        </text>
      ))}

      {/* Points */}
      {data.map((d, i) => (
        <circle
          key={i}
          cx={xScale(d.taxRate)}
          cy={yScale(d.volume)}
          r={hovered === d.commune ? 8 : 5}
          fill={colorScale(d.commune)}
          opacity={hovered && hovered !== d.commune ? 0.2 : 0.9}
          className="transition-all duration-200 cursor-pointer"
          onMouseEnter={(e) => {
            setHovered(d.commune);

            const rect = (e.target as SVGCircleElement).getBoundingClientRect();

            setTooltip({
              x: rect.x + rect.width / 2,
              y: rect.y,
              data: d
            });
          }}
          onMouseLeave={() => {
            setHovered(null);
            setTooltip(null);
          }}
        />
      ))}

    </svg>
  );
}
