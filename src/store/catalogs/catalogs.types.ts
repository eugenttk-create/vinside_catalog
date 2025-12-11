interface Catalog {
  id: string;
  name: string;
  modelsCount: number;
  img: string;
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
