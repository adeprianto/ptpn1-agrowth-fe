export type UnitJenis = "Kebun" | "Pabrik";

export interface UnitOption {
  id: string;
  name: string;
  jenis: string;
  regionalId: string;
}

export const unitOptions: UnitOption[] = [
  { id: "u1", name: "Kebun Sei Lakitan", jenis: "Kebun", regionalId: "3" },
  { id: "u2", name: "Pabrik Tebenan", jenis: "Pabrik", regionalId: "6" },
  { id: "u3", name: "Kebun Tebenan", jenis: "Kebun", regionalId: "6" },
  { id: "u4", name: "Pabrik Cisauk", jenis: "Pabrik", regionalId: "2" },
  { id: "u5", name: "Kebun Alue Bilie", jenis: "Kebun", regionalId: "1" },
];
