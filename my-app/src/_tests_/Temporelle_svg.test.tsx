import { render } from "@testing-library/react";
import Temporelle_svg from "../components/svg/Temporelle_svg";
import { describe, expect, test } from "vitest";

const mockData = [
  { region: "Normandie", year: 2018, value: 100004 },
  { region: "Normandie", year: 2019, value: 1202210 },
  { region: "Bretagne", year: 2018, value: 422012 },
  { region: "Bretagne", year: 2019, value: 1050259 },
];

describe("Temporelle_svg", () => {

  test("render un svg", () => {
    const { container } = render(
      <Temporelle_svg
        data={mockData}
        minYear={2018}
        maxYear={2019}
        activeRegion={null}
        setActiveRegion={() => {}}
      />
    );

    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  test("render des lignes", () => {
    const { container } = render(
      <Temporelle_svg
        data={mockData}
        minYear={2018}
        maxYear={2019}
        activeRegion={null}
        setActiveRegion={() => {}}
      />
    );

    const paths = container.querySelectorAll("path");
    expect(paths.length).toBeGreaterThan(0);
  });

});
