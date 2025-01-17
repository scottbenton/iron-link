import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach, vi } from "vitest";

beforeEach(() => {
  vi.mock(
    "../components/pages/games/characterSheet/hooks/useCharacterId",
    () => ({
      useCharacterId: vi.fn(),
      useCharacterIdOptional: vi.fn(),
    }),
  );
  vi.mock("../components/pages/games/gamePageLayout/hooks/useGameId", () => ({
    useGameId: vi.fn(),
    useGameIdOptional: vi.fn(),
  }));
});

afterEach(() => {
  cleanup();
});
