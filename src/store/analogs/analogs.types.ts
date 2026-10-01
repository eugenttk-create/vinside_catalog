export interface Analog {
  id: number;
  articleNumber: string;
  genericArticleIds: number[];
  name: string;
  brand: string;
  description: string;
}

export interface AnalogBrand {
  id: number;
  brand: string;
}

export interface AnalogInfo {
  name: string;
  brand: string;
  articleNumber: string;
  articleId: number;
  code: string;
  info: string;
  quantityPerPackage: number;
  quantityPerPartPerPackage: string;
  replacesArticles: string;
  criteria: unknown[];
  brands: AnalogBrand[];
}

export interface ApplicabilityCriterion {
  id: number;
  name: string;
  value: string;
}

export interface ApplicabilityItem {
  model: string;
  carId: number;
  engine: string;
  fuelType: string;
  powerKw: number;
  powerHp: number;
  cylinderCapacity: number;
  criteria: ApplicabilityCriterion[];
}

export interface AnalogsState {
  analogs: Analog[];
  analogsLoading: boolean;
  analogsError: string | null;
  searchQuery: string | null;
  selectedAnalog: Analog | null;
  analogInfo: AnalogInfo | null;
  analogInfoLoading: boolean;
  analogInfoError: string | null;
  applicability: ApplicabilityItem[];
  applicabilityLoading: boolean;
  applicabilityError: string | null;
  selectedBrandId: number | null;
  isAnalogsView: boolean;
  isAnalogDetailView: boolean;
}

export const initialState: AnalogsState = {
  analogs: [],
  analogsLoading: false,
  analogsError: null,
  searchQuery: null,
  selectedAnalog: null,
  analogInfo: null,
  analogInfoLoading: false,
  analogInfoError: null,
  applicability: [],
  applicabilityLoading: false,
  applicabilityError: null,
  selectedBrandId: null,
  isAnalogsView: false,
  isAnalogDetailView: false,
};
