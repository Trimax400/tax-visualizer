import { screen } from "@testing-library/react";
import { describe, it, beforeEach, expect, vi } from "vitest";
import { renderWithClient } from './tests-utils'; 
import Nuage from "../components/Nuage/Nuage";

vi.mock("@/src/components/svg/Nuage_svg", () => ({
  default: () => <svg data-testid="nuage-svg" />
}));

describe("page Nuage", () => {

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock global de fetch
    global.fetch = vi.fn()
      // 1er fetch → departements (staleTime: Infinity, donc appelé une fois)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          member: [
            { nom: "Seine-Maritime" },
            { nom: "Calvados" },
          ],
        }),
      } as any)
      // 2e fetch → données communes
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          member: [
            {
              nomCommune: "Le Havre",
              annee: 2022,
              tauxNet: 15,
              montantReel: 2000000,
            },
          ],
        }),
      } as any);
  });

  it("affiche le titre", async () => {
    // Utilisation du wrapper QueryClient
    renderWithClient(<Nuage />);
    
    expect(await screen.findByText(/Relation taux d'imposition/i))
      .toBeInTheDocument();
  });

  it("fait les appels API au montage", async () => {
    renderWithClient(<Nuage />);

    // On attend que les données arrivent pour valider que le fetch a eu lieu
    await screen.findByText(/Relation taux d'imposition/i);

    expect(fetch).toHaveBeenCalled();
  });

  it("rend le svg après le chargement", async () => {
    renderWithClient(<Nuage />);

    // findByTestId attend que isLoading passe à false et que le SVG soit monté
    const svg = await screen.findByTestId("nuage-svg");
    expect(svg).toBeInTheDocument();
  });

  it("affiche les 3 selects", async () => {
    renderWithClient(<Nuage />);

    // findAllByRole est parfait car les selects arrivent après le fetch des départements
    const selects = await screen.findAllByRole("combobox");
    expect(selects.length).toBe(3);
  });

});