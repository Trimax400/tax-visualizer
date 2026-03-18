import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Optionnel : Mock global de fetch si tu ne l'as pas fait
global.fetch = vi.fn();