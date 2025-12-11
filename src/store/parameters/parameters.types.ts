interface ParameterValue {
  idx: string;
  value: string;
  description: {
    model: string | null;
    productionFrom: string | null;
    salesTerm: string | null;
  } | null;
}

interface Parameter {
  key: string;
  name: string;
  values: ParameterValue[];
  sortOrder: number;
}

interface ParametersState {
  parameters: Parameter[];
  carId: string | null;
  parametersLoading: boolean;
  parametersError: string | null;
  selectedParameters: string[];
}

export const initialState: ParametersState = {
  parameters: [],
  carId: null,
  parametersLoading: false,
  parametersError: null,
  selectedParameters: [],
};
