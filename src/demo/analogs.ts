import type { Analog, AnalogInfo, ApplicabilityItem } from "../store/analogs/analogs.types";

export const demoAnalogs: Record<string, Analog[]> = {
  "5Q0698451A": [
    { id: 1, articleNumber: "5Q0698451A", genericArticleIds: [1], name: "Brake Pad Set - Rear", brand: "Volkswagen (OEM)", description: "Original equipment manufacturer" },
    { id: 2, articleNumber: "13.0460-7102.2", genericArticleIds: [1], name: "Brake Pad Set - Rear", brand: "ATE", description: "Premium aftermarket brake pads" },
    { id: 3, articleNumber: "8DB355015-081S", genericArticleIds: [1], name: "Brake Pad Set - Rear", brand: "Bosch", description: "Aftermarket brake pads" },
  ],
  "03L115562": [
    { id: 4, articleNumber: "03L115562", genericArticleIds: [2], name: "Oil Filter", brand: "Volkswagen (OEM)", description: "Original equipment manufacturer" },
    { id: 5, articleNumber: "OC-1057", genericArticleIds: [2], name: "Oil Filter", brand: "Mahle", description: "Aftermarket oil filter" },
  ],
};

export const demoAnalogInfo: Record<number, AnalogInfo> = {
  1: {
    name: "Brake Pad Set - Rear",
    brand: "Volkswagen (OEM)",
    articleNumber: "5Q0698451A",
    articleId: 1,
    code: "5Q0698451A",
    info: "Rear axle brake pad set for Golf VII, Passat B8",
    quantityPerPackage: 1,
    quantityPerPartPerPackage: "4",
    replacesArticles: "",
    criteria: [],
    brands: [
      { id: 1, brand: "Volkswagen (OEM)" },
      { id: 2, brand: "ATE" },
      { id: 3, brand: "Bosch" },
    ],
  },
  2: {
    name: "Brake Pad Set - Rear",
    brand: "ATE",
    articleNumber: "13.0460-7102.2",
    articleId: 2,
    code: "13.0460-7102.2",
    info: "Premium aftermarket rear brake pads",
    quantityPerPackage: 1,
    quantityPerPartPerPackage: "4",
    replacesArticles: "5Q0698451A",
    criteria: [],
    brands: [{ id: 2, brand: "ATE" }],
  },
  4: {
    name: "Oil Filter",
    brand: "Volkswagen (OEM)",
    articleNumber: "03L115562",
    articleId: 4,
    code: "03L115562",
    info: "Engine oil filter for TSI/TDI engines",
    quantityPerPackage: 1,
    quantityPerPartPerPackage: "1",
    replacesArticles: "",
    criteria: [],
    brands: [
      { id: 4, brand: "Volkswagen (OEM)" },
      { id: 5, brand: "Mahle" },
    ],
  },
};

export const demoApplicability: Record<number, ApplicabilityItem[]> = {
  1: [
    {
      model: "Golf VII",
      carId: 1,
      engine: "1.4 TSI",
      fuelType: "Petrol",
      powerKw: 110,
      powerHp: 150,
      cylinderCapacity: 1395,
      criteria: [],
    },
    {
      model: "Passat B8",
      carId: 2,
      engine: "2.0 TDI",
      fuelType: "Diesel",
      powerKw: 110,
      powerHp: 150,
      cylinderCapacity: 1968,
      criteria: [],
    },
  ],
};
