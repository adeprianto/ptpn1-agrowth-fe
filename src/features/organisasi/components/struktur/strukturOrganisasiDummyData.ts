export type OrgNodeType = "ho" | "regional" | "kebun" | "pabrik";

export interface OrgNode {
  id: string;
  name: string;
  type: OrgNodeType;
  employeeCount: number;
  children?: OrgNode[];
}

// DUMMY DATA — nanti diganti hasil GET /api/v1/organisasi/struktur
export const organizationTree: OrgNode = {
  id: "ho",
  name: "PTPN 1 (Head Office)",
  type: "ho",
  employeeCount: 187,
  children: [
    {
      id: "regional-1",
      name: "Regional 1 - Aceh",
      type: "regional",
      employeeCount: 512,
      children: [
        {
          id: "u-1-1",
          name: "Kebun Alue Bilie",
          type: "kebun",
          employeeCount: 118,
        },
        {
          id: "u-1-2",
          name: "Pabrik Alue Bilie",
          type: "pabrik",
          employeeCount: 76,
        },
        {
          id: "u-1-3",
          name: "Kebun Blang Pidie",
          type: "kebun",
          employeeCount: 102,
        },
        { id: "u-1-4", name: "Kebun Sawang", type: "kebun", employeeCount: 96 },
        {
          id: "u-1-5",
          name: "Pabrik Sawang",
          type: "pabrik",
          employeeCount: 60,
        },
      ],
    },
    {
      id: "regional-2",
      name: "Regional 2 - Sumatera Utara",
      type: "regional",
      employeeCount: 688,
      children: [
        {
          id: "u-2-1",
          name: "Kebun Sei Silau",
          type: "kebun",
          employeeCount: 134,
        },
        {
          id: "u-2-2",
          name: "Pabrik Sei Silau",
          type: "pabrik",
          employeeCount: 82,
        },
        {
          id: "u-2-3",
          name: "Kebun Bandar Selamat",
          type: "kebun",
          employeeCount: 121,
        },
        {
          id: "u-2-4",
          name: "Pabrik Bandar Selamat",
          type: "pabrik",
          employeeCount: 78,
        },
        {
          id: "u-2-5",
          name: "Kebun Tanjung Kasau",
          type: "kebun",
          employeeCount: 95,
        },
        {
          id: "u-2-6",
          name: "Kebun Bukit Maradja",
          type: "kebun",
          employeeCount: 102,
        },
        {
          id: "u-2-7",
          name: "Pabrik Bukit Maradja",
          type: "pabrik",
          employeeCount: 76,
        },
      ],
    },
    {
      id: "regional-3",
      name: "Regional 3 - Sumatera Selatan",
      type: "regional",
      employeeCount: 612,
      children: [
        {
          id: "u-3-1",
          name: "Kebun Sei Lakitan",
          type: "kebun",
          employeeCount: 142,
        },
        {
          id: "u-3-2",
          name: "Pabrik Sei Lakitan",
          type: "pabrik",
          employeeCount: 88,
        },
        {
          id: "u-3-3",
          name: "Kebun Suban Jeriji",
          type: "kebun",
          employeeCount: 121,
        },
        {
          id: "u-3-4",
          name: "Kebun Tebenan",
          type: "kebun",
          employeeCount: 96,
        },
        {
          id: "u-3-5",
          name: "Pabrik Tebenan",
          type: "pabrik",
          employeeCount: 74,
        },
        {
          id: "u-3-6",
          name: "Kebun Tj. Kemuning",
          type: "kebun",
          employeeCount: 91,
        },
      ],
    },
    {
      id: "regional-4",
      name: "Regional 4 - Lampung",
      type: "regional",
      employeeCount: 398,
      children: [
        { id: "u-4-1", name: "Kebun Bekri", type: "kebun", employeeCount: 128 },
        {
          id: "u-4-2",
          name: "Pabrik Bekri",
          type: "pabrik",
          employeeCount: 84,
        },
        {
          id: "u-4-3",
          name: "Kebun Way Berulu",
          type: "kebun",
          employeeCount: 102,
        },
        {
          id: "u-4-4",
          name: "Kebun Kedaton",
          type: "kebun",
          employeeCount: 84,
        },
      ],
    },
    {
      id: "regional-5",
      name: "Regional 5 - Jawa Barat",
      type: "regional",
      employeeCount: 745,
      children: [
        {
          id: "u-5-1",
          name: "Kebun Ciwalen",
          type: "kebun",
          employeeCount: 118,
        },
        {
          id: "u-5-2",
          name: "Pabrik Ciwalen",
          type: "pabrik",
          employeeCount: 79,
        },
        {
          id: "u-5-3",
          name: "Kebun Dayeuh Manggung",
          type: "kebun",
          employeeCount: 96,
        },
        {
          id: "u-5-4",
          name: "Kebun Kertajaya",
          type: "kebun",
          employeeCount: 88,
        },
        {
          id: "u-5-5",
          name: "Pabrik Kertajaya",
          type: "pabrik",
          employeeCount: 64,
        },
        { id: "u-5-6", name: "Kebun Sedep", type: "kebun", employeeCount: 102 },
        {
          id: "u-5-7",
          name: "Kebun Malabar",
          type: "kebun",
          employeeCount: 110,
        },
        {
          id: "u-5-8",
          name: "Pabrik Malabar",
          type: "pabrik",
          employeeCount: 88,
        },
      ],
    },
    {
      id: "regional-6",
      name: "Regional 6 - Jawa Tengah",
      type: "regional",
      employeeCount: 456,
      children: [
        {
          id: "u-6-1",
          name: "Kebun Kaligua",
          type: "kebun",
          employeeCount: 112,
        },
        {
          id: "u-6-2",
          name: "Pabrik Kaligua",
          type: "pabrik",
          employeeCount: 72,
        },
        { id: "u-6-3", name: "Kebun Merbuh", type: "kebun", employeeCount: 98 },
        { id: "u-6-4", name: "Kebun Getas", type: "kebun", employeeCount: 104 },
        {
          id: "u-6-5",
          name: "Pabrik Getas",
          type: "pabrik",
          employeeCount: 70,
        },
      ],
    },
    {
      id: "regional-7",
      name: "Regional 7 - Jawa Timur",
      type: "regional",
      employeeCount: 601,
      children: [
        {
          id: "u-7-1",
          name: "Kebun Kertosari",
          type: "kebun",
          employeeCount: 122,
        },
        {
          id: "u-7-2",
          name: "Pabrik Kertosari",
          type: "pabrik",
          employeeCount: 80,
        },
        {
          id: "u-7-3",
          name: "Kebun Wonosari",
          type: "kebun",
          employeeCount: 108,
        },
        {
          id: "u-7-4",
          name: "Kebun Ngrangkah Pawon",
          type: "kebun",
          employeeCount: 96,
        },
        {
          id: "u-7-5",
          name: "Pabrik Ngrangkah Pawon",
          type: "pabrik",
          employeeCount: 82,
        },
        {
          id: "u-7-6",
          name: "Kebun Bantaran",
          type: "kebun",
          employeeCount: 113,
        },
      ],
    },
    {
      id: "regional-8",
      name: "Regional 8 - Kalimantan Selatan",
      type: "regional",
      employeeCount: 520,
      children: [
        {
          id: "u-8-1",
          name: "Kebun Danau Salak",
          type: "kebun",
          employeeCount: 108,
        },
        {
          id: "u-8-2",
          name: "Pabrik Danau Salak",
          type: "pabrik",
          employeeCount: 74,
        },
        {
          id: "u-8-3",
          name: "Kebun Pelaihari",
          type: "kebun",
          employeeCount: 116,
        },
        {
          id: "u-8-4",
          name: "Kebun Batulicin",
          type: "kebun",
          employeeCount: 122,
        },
        {
          id: "u-8-5",
          name: "Pabrik Batulicin",
          type: "pabrik",
          employeeCount: 100,
        },
      ],
    },
  ],
};
