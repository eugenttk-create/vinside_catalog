export const palettes = [
  { id: "blue", name: "Blue", color: "#0ea5e9" },
  { id: "green", name: "Green", color: "#15803d" },
  { id: "emerald", name: "Emerald", color: "#047857" },
  { id: "teal", name: "Teal", color: "#0f766e" },
  { id: "cyan", name: "Cyan", color: "#0e7490" },
  { id: "indigo", name: "Indigo", color: "#4f46e5" },
  { id: "violet", name: "Violet", color: "#7c3aed" },
  { id: "rose", name: "Rose", color: "#be123c" },
  { id: "orange", name: "Orange", color: "#c2410c" },
  { id: "graphite", name: "Graphite", color: "#475569" },
] as const;

export type PaletteId = (typeof palettes)[number]["id"];

export const isPaletteId = (value: string | null): value is PaletteId =>
  palettes.some((palette) => palette.id === value);

export const getSavedPalette = (): PaletteId => {
  const saved = localStorage.getItem("catalog-palette");
  return isPaletteId(saved) ? saved : "blue";
};
