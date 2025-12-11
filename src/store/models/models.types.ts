interface Model {
  description: {
    modelType: string | null;
    productionFrom: string | null;
    productionTo: string | null;
    series: string | null;
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
