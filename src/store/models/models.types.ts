export interface Model {
  description: {
    model_type: string | null;
    year_from: string | null;
    year_to: string | null;
    series: string | null;
    code: string | null;
    catalog: string | null;
    cabin: string | null;
    engine: string | null;
    gearbox: string | null;
    steering: string | null;
    suspension: string | null;
    wheel_base: string | null;
    production: string | null;
    type: string | null;
  } | null;
  id: string;
  name: string;
  img: string;
}

interface ModelsState {
  models: Model[];
  modelsLoading: boolean;
  modelsError: string | null;
  catalogId: string;
  selectedBrand?: string;
  catalogOpened: boolean;
  isVinSearch: boolean;
}

export const initialState: ModelsState = {
  models: [],
  modelsLoading: false,
  modelsError: null,
  catalogId: "",
  selectedBrand: "",
  catalogOpened: false,
  isVinSearch: false,
};
