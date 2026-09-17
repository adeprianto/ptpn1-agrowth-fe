import type { DropdownOption } from "./UnitFormModal";

// Dummy — nanti diganti fetch GET /api/v1/entities?tipe=REGIONAL
export const regionalParentOptions: DropdownOption[] = [
  { id: "REG-01", label: "Regional 1" },
  { id: "REG-02", label: "Regional 2" },
  { id: "REG-03", label: "Regional 3" },
];

// Dummy — nanti diganti fetch GET /api/v1/operational-categories
export const kategoriOptions: DropdownOption[] = [
  { id: "EST", label: "Kebun" },
  { id: "FAC", label: "Pabrik" },
];

// Dummy — nanti diganti fetch GET /api/v1/business-types
export const komoditasOptions: DropdownOption[] = [
  { id: "SAWIT", label: "Kelapa Sawit" },
  { id: "KARET", label: "Karet" },
  { id: "TEH", label: "Teh" },
];
