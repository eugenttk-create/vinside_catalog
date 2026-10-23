interface Catalog {
  id: string;
  name: string;
  modelsCount: number;
  img: string;
}

export const demoCatalogs: Catalog[] = [
  { id: "vw", name: "Volkswagen", modelsCount: 3, img: "" },
  { id: "audi", name: "Audi", modelsCount: 2, img: "" },
  { id: "skoda", name: "Škoda", modelsCount: 2, img: "" },
  { id: "porsche", name: "Porsche", modelsCount: 1, img: "" },
];
