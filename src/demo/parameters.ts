import type { Parameter, ParameterValue } from "../store/parameters/parameters.types";

const val = (idx: string, value: string, img = ""): ParameterValue => ({
  idx,
  value,
  img,
  description: null,
});

export const demoParameters: Record<string, Parameter[]> = {
  vw_golf: [
    {
      key: "engine",
      name: "Engine",
      sortOrder: 1,
      values: [
        val("pl_vw_golf_14tsi", "1.4 TSI 150 HP"),
        val("pl_vw_golf_20tdi", "2.0 TDI 150 HP"),
      ],
    },
  ],
  vw_passat: [
    {
      key: "engine",
      name: "Engine",
      sortOrder: 1,
      values: [
        val("pl_vw_passat_20tdi", "2.0 TDI 150 HP"),
        val("pl_vw_passat_20tfsi", "2.0 TFSI 190 HP"),
      ],
    },
  ],
  vw_tiguan: [
    {
      key: "engine",
      name: "Engine",
      sortOrder: 1,
      values: [
        val("pl_vw_tiguan_20tsi", "2.0 TSI 180 HP"),
      ],
    },
  ],
  audi_a4: [
    {
      key: "engine",
      name: "Engine",
      sortOrder: 1,
      values: [
        val("pl_audi_a4_20tfsi", "2.0 TFSI 190 HP"),
        val("pl_audi_a4_30tdi", "3.0 TDI 240 HP"),
      ],
    },
  ],
  audi_q5: [
    {
      key: "engine",
      name: "Engine",
      sortOrder: 1,
      values: [
        val("pl_audi_q5_20tdi", "2.0 TDI 163 HP"),
      ],
    },
  ],
  skoda_octavia: [
    {
      key: "engine",
      name: "Engine",
      sortOrder: 1,
      values: [
        val("pl_skoda_octavia_15tsi", "1.5 TSI 150 HP"),
      ],
    },
  ],
  skoda_kodiaq: [
    {
      key: "engine",
      name: "Engine",
      sortOrder: 1,
      values: [
        val("pl_skoda_kodiaq_20tdi", "2.0 TDI 150 HP"),
      ],
    },
  ],
  porsche_911: [
    {
      key: "engine",
      name: "Engine",
      sortOrder: 1,
      values: [
        val("pl_porsche_911_30tt", "3.0 Twin-Turbo 385 HP"),
      ],
    },
  ],
};

export const demoCars: Record<
  string,
  Record<string, { id: string }>
> = {
  vw_golf: {
    pl_vw_golf_14tsi: { id: "vw_golf_14tsi_car" },
    pl_vw_golf_20tdi: { id: "vw_golf_20tdi_car" },
  },
  vw_passat: {
    pl_vw_passat_20tdi: { id: "vw_passat_20tdi_car" },
    pl_vw_passat_20tfsi: { id: "vw_passat_20tfsi_car" },
  },
  vw_tiguan: {
    pl_vw_tiguan_20tsi: { id: "vw_tiguan_20tsi_car" },
  },
  audi_a4: {
    pl_audi_a4_20tfsi: { id: "audi_a4_20tfsi_car" },
    pl_audi_a4_30tdi: { id: "audi_a4_30tdi_car" },
  },
  audi_q5: {
    pl_audi_q5_20tdi: { id: "audi_q5_20tdi_car" },
  },
  skoda_octavia: {
    pl_skoda_octavia_15tsi: { id: "skoda_octavia_15tsi_car" },
  },
  skoda_kodiaq: {
    pl_skoda_kodiaq_20tdi: { id: "skoda_kodiaq_20tdi_car" },
  },
  porsche_911: {
    pl_porsche_911_30tt: { id: "porsche_911_30tt_car" },
  },
};
