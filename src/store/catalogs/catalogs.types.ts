interface Catalog {
  id: string;
  name: string;
  modelsCount: number;
}

interface CatalogsState {
  catalogs: Catalog[];
  catalogsLoading: boolean;
  catalogsError: string | null;
}

export const initialState: CatalogsState = {
  catalogs: [],
  catalogsLoading: false,
  catalogsError: null,
};
