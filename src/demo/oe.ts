import type { OE } from "../store/OE/OE.types";
import type { Group } from "../store/groups/groups.types";

export const demoOE: Record<string, OE> = {
  "5Q0698451A": {
    engid: "oe_001",
    name: "Brake Pad Set - Rear",
    oe_number: "5Q0698451A",
    remark: "Rear axle brake pads",
    models: [
      { brand: "Volkswagen", carId: "vw_golf_14tsi_car", model: "Golf VII", year: "2017-2024" },
      { brand: "Volkswagen", carId: "vw_passat_20tdi_car", model: "Passat B8", year: "2014-2024" },
    ],
  },
  "03L115562": {
    engid: "oe_002",
    name: "Oil Filter",
    oe_number: "03L115562",
    remark: "Engine oil filter",
    models: [
      { brand: "Volkswagen", carId: "vw_golf_14tsi_car", model: "Golf VII", year: "2017-2024" },
      { brand: "Škoda", carId: "skoda_octavia_15tsi_car", model: "Octavia IV", year: "2019-2024" },
    ],
  },
};

export const demoOEGroups: Record<string, Group[]> = {
  vw_golf_14tsi_car: [
    {
      id: "grp_brake_rear",
      name: "Rear Brakes",
      hasSubgroups: false,
      hasParts: true,
      img: "",
      scope: null,
      description: null,
    },
  ],
};

export const demoOEParts: Record<string, typeof import("./parts").demoParts[string]> = {
  grp_brake_rear: {
    img: "",
    imgDescription: "Rear brake pads diagram (OE)",
    partGroups: [
      {
        description: "Rear brake pads set (OE route)",
        name: "Brake Pads",
        number: "BP-REAR-OE",
        positionNumber: "1",
        parts: [
          {
            id: "part_oe_rear_pads_1",
            name: "Brake Pad Set - Rear (OE)",
            number: "5Q0698451A",
            notice: "",
            positionNumber: "1",
            url: "",
            description: { positionNumber: "1", number: "5Q0698451A", name: "Brake Pad Set - Rear (OE)", qty: "1" },
          },
        ],
      },
    ],
    positions: [
      { number: "1", coordinates: [120, 150] },
    ],
  },
};
