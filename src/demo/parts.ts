import type { Part, PartsResponse } from "../store/parts/parts.types";

const mkPart = (
  id: string,
  name: string,
  number: string,
  positionNumber: string,
): Part => ({
  id,
  name,
  number,
  notice: "",
  positionNumber,
  url: "",
  description: {
    positionNumber,
    number,
    name,
    qty: "1",
  },
});

const rearBrakePads: PartsResponse = {
  img: "",
  imgDescription: "Rear brake pads diagram",
  partGroups: [
    {
      description: "Rear brake pads set",
      name: "Brake Pads",
      number: "BP-REAR-001",
      positionNumber: "1",
      parts: [
        mkPart("part_rear_pads_1", "Brake Pad Set - Rear", "5Q0698451A", "1"),
        mkPart("part_rear_pads_2", "Brake Pad Wear Sensor", "5Q0998201", "2"),
      ],
    },
  ],
  positions: [
    { number: "1", coordinates: [120, 150] },
    { number: "2", coordinates: [180, 150] },
  ],
};

const frontBrakePads: PartsResponse = {
  img: "",
  imgDescription: "Front brake pads diagram",
  partGroups: [
    {
      description: "Front brake pads set",
      name: "Brake Pads",
      number: "BP-FRONT-001",
      positionNumber: "1",
      parts: [
        mkPart("part_front_pads_1", "Brake Pad Set - Front", "5Q0698151A", "1"),
        mkPart("part_front_pads_2", "Brake Pad Wear Sensor", "5Q0998201", "2"),
      ],
    },
  ],
  positions: [
    { number: "1", coordinates: [100, 200] },
    { number: "2", coordinates: [160, 200] },
  ],
};

const frontBrakeDiscs: PartsResponse = {
  img: "",
  imgDescription: "Front brake discs diagram",
  partGroups: [
    {
      description: "Front brake discs",
      name: "Brake Discs",
      number: "BD-FRONT-001",
      positionNumber: "1",
      parts: [
        mkPart("part_front_disc_1", "Brake Disc - Front Left", "5Q0615301A", "1"),
        mkPart("part_front_disc_2", "Brake Disc - Front Right", "5Q0615302A", "2"),
      ],
    },
  ],
  positions: [
    { number: "1", coordinates: [110, 180] },
    { number: "2", coordinates: [170, 180] },
  ],
};

const oilFilter: PartsResponse = {
  img: "",
  imgDescription: "Oil filter location",
  partGroups: [
    {
      description: "Engine oil filter",
      name: "Oil Filter",
      number: "OF-001",
      positionNumber: "1",
      parts: [
        mkPart("part_oil_filter_1", "Oil Filter", "03L115562", "1"),
      ],
    },
  ],
  positions: [
    { number: "1", coordinates: [150, 120] },
  ],
};

const timingBelt: PartsResponse = {
  img: "",
  imgDescription: "Timing belt diagram",
  partGroups: [
    {
      description: "Timing belt kit",
      name: "Timing Belt",
      number: "TB-001",
      positionNumber: "1",
      parts: [
        mkPart("part_timing_belt_1", "Timing Belt", "03L109158Q", "1"),
        mkPart("part_timing_belt_2", "Tensioner Pulley", "03L109243B", "2"),
      ],
    },
  ],
  positions: [
    { number: "1", coordinates: [130, 140] },
    { number: "2", coordinates: [190, 140] },
  ],
};

const shockAbsorbersParts: PartsResponse = {
  img: "",
  imgDescription: "Shock absorber diagram",
  partGroups: [
    {
      description: "Front shock absorbers",
      name: "Shock Absorbers",
      number: "SA-001",
      positionNumber: "1",
      parts: [
        mkPart("part_shock_1", "Shock Absorber - Front Left", "5Q0413031A", "1"),
        mkPart("part_shock_2", "Shock Absorber - Front Right", "5Q0413032A", "2"),
      ],
    },
  ],
  positions: [
    { number: "1", coordinates: [100, 160] },
    { number: "2", coordinates: [160, 160] },
  ],
};

const coilSprings: PartsResponse = {
  img: "",
  imgDescription: "Coil spring diagram",
  partGroups: [
    {
      description: "Front coil springs",
      name: "Coil Springs",
      number: "CS-001",
      positionNumber: "1",
      parts: [
        mkPart("part_spring_1", "Coil Spring - Front Left", "5Q0411101A", "1"),
        mkPart("part_spring_2", "Coil Spring - Front Right", "5Q0411102A", "2"),
      ],
    },
  ],
  positions: [
    { number: "1", coordinates: [110, 170] },
    { number: "2", coordinates: [170, 170] },
  ],
};

const batteryParts: PartsResponse = {
  img: "",
  imgDescription: "Battery location",
  partGroups: [
    {
      description: "Vehicle battery",
      name: "Battery",
      number: "BAT-001",
      positionNumber: "1",
      parts: [
        mkPart("part_battery_1", "Battery 70Ah", "000915105DE", "1"),
      ],
    },
  ],
  positions: [
    { number: "1", coordinates: [140, 130] },
  ],
};

const starterMotor: PartsResponse = {
  img: "",
  imgDescription: "Starter motor location",
  partGroups: [
    {
      description: "Starter motor",
      name: "Starter Motor",
      number: "SM-001",
      positionNumber: "1",
      parts: [
        mkPart("part_starter_1", "Starter Motor", "02M911024R", "1"),
      ],
    },
  ],
  positions: [
    { number: "1", coordinates: [150, 110] },
  ],
};

export const demoParts: Record<string, PartsResponse> = {
  grp_brake_rear: rearBrakePads,
  grp_brake_pads: frontBrakePads,
  grp_brake_discs: frontBrakeDiscs,
  grp_engine_oil: oilFilter,
  grp_engine_belt: timingBelt,
  grp_susp_shock: shockAbsorbersParts,
  grp_susp_springs: coilSprings,
  grp_elec_battery: batteryParts,
  grp_elec_starter: starterMotor,
};
