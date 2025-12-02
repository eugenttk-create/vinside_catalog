interface Model {
  id: string;
  name: string;
  img: string;
}

interface ModelsState {
  models: Model[];
  modelsLoading: boolean;
  modelsError: string | null;
  catalogId: string;
}

export const initialState: ModelsState = {
  models: [],
  modelsLoading: false,
  modelsError: null,
  catalogId: "",
};
