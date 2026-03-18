import { render } from "@testing-library/react";
import Diagramme_svg from "../components/svg/Diagramme_svg";
import { describe, expect, test } from "vitest";

const mockData = [
  { region: "Normandie", year: 2022, value: 100100 },
  { region: "Bretagne", year: 2022, value: 224500 },
];

describe("Diagramme_svg", () => {

  test("rend un svg", () => {
    const { container } = render(
      <Diagramme_svg
        data={mockData}
        hoveredRegion={null}
        setHoveredRegion={() => {}}
      />
    );

    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  test("rend des arcs (path)", () => {
    const { container } = render(
      <Diagramme_svg
        data={mockData}
        hoveredRegion={null}
        setHoveredRegion={() => {}}
      />
    );

    const paths = container.querySelectorAll("path");
    expect(paths.length).toBe(2);
  });

});
