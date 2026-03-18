import { CommuneData } from "@/src/type/CommuneData";
import { taxeStats } from "./TaxeStats";

export type NuageProps = {
    data: CommuneData[];
    width: number;
    height: number;
    margin: { top: number; right: number; bottom: number; left: number };
    hovered: string | null;
    setHovered: (c: string | null) => void;
    setTooltip: (t: any) => void;
};

export type DiagrammeProps = {
    data: taxeStats[];
    hoveredRegion: taxeStats | null;
    setHoveredRegion: (d: taxeStats | null) => void;
};

export type TemporelleProps = {
    data: taxeStats[];
    minYear: number;
    maxYear: number;
    activeRegion: string | null;
    setActiveRegion: (region: string | null) => void;
};