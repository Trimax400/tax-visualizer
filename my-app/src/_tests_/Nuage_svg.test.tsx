import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Nuage_svg from "../components/svg/Nuage_svg";
import { CommuneData } from "@/src/type/CommuneData";

describe("Nuage_svg", () => {

  const mockSetHovered = vi.fn();
  const mockSetTooltip = vi.fn();

  const data: CommuneData[] = [
    { commune: "Le Havre", departement: "Seine-Maritime", year: 2022, taxType: "cves", taxRate: 15, volume: 2000000 },
    { commune: "Rouen", departement: "Seine-Maritime", year: 2022, taxType: "cves", taxRate: 18, volume: 1500000 },
  ];

  const props = {
    data,
    width: 700,
    height: 400,
    margin: { top: 40, right: 30, bottom: 50, left: 60 },
    hovered: null,
    setHovered: mockSetHovered,
    setTooltip: mockSetTooltip
  };

  it("rend un svg avec les axes", () => {
    render(<Nuage_svg {...props} />);
    const svg = document.querySelector("svg");
    expect(svg).toBeInTheDocument();
    
    // Vérifie les axes
    const lines = svg?.querySelectorAll("line");
    expect(lines?.length).toBeGreaterThanOrEqual(2);
  });

  it("rend le bon nombre de cercles", () => {
    render(<Nuage_svg {...props} />);
    const circles = document.querySelectorAll("circle");
    expect(circles.length).toBe(data.length);
  });

  it("appelle setHovered et setTooltip au survol d'un point", () => {
    render(<Nuage_svg {...props} />);
    const circles = document.querySelectorAll("circle");

    // simulate hover
    fireEvent.mouseEnter(circles[0]);
    expect(mockSetHovered).toHaveBeenCalledWith("Le Havre");
    expect(mockSetTooltip).toHaveBeenCalled();

    fireEvent.mouseLeave(circles[0]);
    expect(mockSetHovered).toHaveBeenCalledWith(null);
    expect(mockSetTooltip).toHaveBeenCalledWith(null);
  });

  it("change le rayon et l'opacité si hovered correspond", () => {
    const newProps = { ...props, hovered: "Rouen" };
    render(<Nuage_svg {...newProps} />);
    const circles = document.querySelectorAll("circle");

    // 1er cercle -> Le Havre (pas hovered)
    expect(circles[0].getAttribute("r")).toBe("5");
    expect(circles[0].getAttribute("opacity")).toBe("0.2");

    // 2e cercle -> Rouen (hovered)
    expect(circles[1].getAttribute("r")).toBe("8");
    expect(circles[1].getAttribute("opacity")).toBe("0.9");
  });
});
