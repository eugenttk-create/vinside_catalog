import type { Group, GroupNode } from "../store/groups/groups.types";

const mkGroup = (
  id: string,
  name: string,
  hasSubgroups: boolean,
  hasParts: boolean,
  img = "",
): Group => ({
  id,
  name,
  hasSubgroups,
  hasParts,
  img,
  scope: null,
  description: null,
});

const brakeSystem: Group = mkGroup("grp_brake", "Brake System", true, false);
const frontBrakes: Group = mkGroup("grp_brake_front", "Front Brakes", true, false);
const rearBrakes: Group = mkGroup("grp_brake_rear", "Rear Brakes", false, true);
const brakePads: Group = mkGroup("grp_brake_pads", "Brake Pads", false, true);
const brakeDiscs: Group = mkGroup("grp_brake_discs", "Brake Discs", false, true);

const engineSystem: Group = mkGroup("grp_engine", "Engine", true, false);
const engineOil: Group = mkGroup("grp_engine_oil", "Oil Filter", false, true);
const engineBelt: Group = mkGroup("grp_engine_belt", "Timing Belt", false, true);

const suspensionSystem: Group = mkGroup("grp_suspension", "Suspension", true, false);
const shockAbsorbers: Group = mkGroup("grp_susp_shock", "Shock Absorbers", false, true);
const springs: Group = mkGroup("grp_susp_springs", "Coil Springs", false, true);

const electricalSystem: Group = mkGroup("grp_electric", "Electrical System", true, false);
const battery: Group = mkGroup("grp_elec_battery", "Battery", false, true);
const starter: Group = mkGroup("grp_elec_starter", "Starter Motor", false, true);

const buildTopLevel = (): Group[] => [
  brakeSystem,
  engineSystem,
  suspensionSystem,
  electricalSystem,
];

const subgroupsMap: Record<string, Group[]> = {
  grp_brake: [frontBrakes, rearBrakes],
  grp_brake_front: [brakePads, brakeDiscs],
  grp_engine: [engineOil, engineBelt],
  grp_suspension: [shockAbsorbers, springs],
  grp_electric: [battery, starter],
};

export const demoGroupsRoot: Group[] = buildTopLevel();

export function getDemoGroups(groupId?: string): Group[] {
  if (!groupId) return demoGroupsRoot;
  return subgroupsMap[groupId] ?? [];
}

export function getDemoGroupNode(groupId?: string): GroupNode[] {
  return getDemoGroups(groupId).map((g) => ({ ...g }));
}
