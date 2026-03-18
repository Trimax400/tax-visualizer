import { screen, waitFor } from "@testing-library/react";
import { describe, test, vi, expect, beforeEach } from "vitest";
import { renderWithClient } from './tests-utils'; // Ton helper avec le Provider
import Temporelle from "../components/Temporelle/Temporelle";


describe("page Temporelle", () => {
  
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Configuration du fetch pour répondre à chaque appel d'année
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        member: [
          { label: "Normandie", value: 10 },
          { label: "Bretagne", value: 12 },
        ],
      }),
    });
  });

  test("affiche le titre", async () => {
    renderWithClient(<Temporelle />);
    expect(await screen.findByText(/Taux moyen par région/i)).toBeInTheDocument();
  });

  test("affiche les selects", async () => {
    renderWithClient(<Temporelle />);
    
    expect(await screen.findByText("Taxe")).toBeInTheDocument();
    expect(screen.getByText("De")).toBeInTheDocument();
    expect(screen.getByText("à")).toBeInTheDocument();
  });

  test("fetch les données et affiche le graphique", async () => {
    renderWithClient(<Temporelle />);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });

    await waitFor(() => {
      const svg = document.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });
  });

});