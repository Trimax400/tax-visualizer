import { beforeEach, describe, expect, it, vi } from "vitest";
import Diagramme from "../components/Diagramme/Diagramme";
import { renderWithClient } from './tests-utils';
import { screen } from "@testing-library/react";

describe("page Diagramme", () => {

    beforeEach(() => {
        vi.clearAllMocks();

        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({
                member: [
                    { label: "Normandie", value: 100000 },
                    { label: "Bretagne", value: 200000 },
                ],
            }),
        } as any);
    });

    it("affiche le titre", async () => {
        const { getByText } = renderWithClient(<Diagramme />);
        expect(getByText(/Impôt collecté par région/i)).toBeInTheDocument();
    });

    it("fait un appel API au montage", async () => {
        renderWithClient(<Diagramme />);
        
        await screen.findByText(/Impôt collecté/i);

        expect(fetch).toHaveBeenCalled();
    });

    it("rend un svg", async () => {
        renderWithClient(<Diagramme />);

        await screen.findByText(/Impôt collecté/i);

        const svg = document.querySelector("svg");
        expect(svg).toBeInTheDocument();
    });

});
