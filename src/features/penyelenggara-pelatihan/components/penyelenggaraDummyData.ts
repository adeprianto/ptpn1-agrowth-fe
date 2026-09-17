export type TipePenyelenggara = 'LPP' | 'INTERNAL_PTPN' | 'EKSTERNAL' | 'KEMENTERIAN';

export type StatusPenyelenggaraPelatihan = "Aktif" | "Non-aktif";

export interface PenyelenggaraPelatihan {
    id: string;
    nama: string;
    tipe: TipePenyelenggara;
    alamat: string;
    kota: string;
    phone: string;
    email: string;
    website?: string;

    // --- DATA PIC (Person In Charge) ---
    namaPic: string;
    phonePic: string;
    emailPic: string;
    jabatanPic: string;

    // --- ADMINISTRASI & MONITORING ---
    npwp?: string;           // Opsional, tapi sering dibutuhkan HR/Finance untuk vendor eksternal
    rating?: number;         // Skor 1-5 dari hasil evaluasi pasca-pelatihan sebelumnya
    status: StatusPenyelenggaraPelatihan;       // Wajib ada untuk "Soft Delete" master data
}

export interface PenyelenggaraPelatihanRow {
    id: string;
    nama: string;
    tipe: TipePenyelenggara;
    alamat: string;
    kota: string;
    phone: string;
    email: string;
    website?: string;
    status: StatusPenyelenggaraPelatihan;
}

export const dummyDataPenyelenggara: PenyelenggaraPelatihan[] = [
    {
        id: "PYL-001",
        nama: "LPP Agro Nusantara",
        tipe: "LPP",
        alamat: "Jl. Jend. Urip Sumoharjo No. 100",
        kota: "Yogyakarta",
        phone: "0274-586601",
        email: "info@lpp.co.id",
        website: "https://lpp.co.id",

        namaPic: "Budi Santoso",
        phonePic: "081234567890",
        emailPic: "budi.s@lpp.co.id",
        jabatanPic: "Manager Pelatihan",

        npwp: "01.234.567.8-542.000",
        rating: 4.8,
        status: "Aktif",
    },
    {
        id: "PYL-002",
        nama: "PTPN IV Corporate University",
        tipe: "INTERNAL_PTPN",
        alamat: "Jl. Letjen Suprapto No.2",
        kota: "Medan",
        phone: "061-4154666",
        email: "corpu@ptpn4.co.id",

        namaPic: "Siti Rahmawati",
        phonePic: "081345678901",
        emailPic: "siti.rahma@ptpn4.co.id",
        jabatanPic: "Head of Learning Center",

        rating: 4.5,
        status: "Aktif",
    },
    {
        id: "PYL-003",
        nama: "PT MarkPlus Indonesia",
        tipe: "EKSTERNAL",
        alamat: "EightyEight@Kasablanka Tower, Lt. 8",
        kota: "Jakarta Selatan",
        phone: "021-28565300",
        email: "contact@markplusinc.com",
        website: "https://markplusinc.com",

        namaPic: "Reza Mahendra",
        phonePic: "081987654321",
        emailPic: "reza.m@markplusinc.com",
        jabatanPic: "Account Executive BUMN",

        npwp: "31.555.678.9-014.000",
        rating: 4.9,
        status: "Aktif",
    },
    {
        id: "PYL-004",
        nama: "Balai Besar Pelatihan Manajemen dan Kepemimpinan Pertanian",
        tipe: "KEMENTERIAN",
        alamat: "Jl. Raya Puncak Km. 72, Ciawi",
        kota: "Bogor",
        phone: "0251-8246522",
        email: "bbpmkp@pertanian.go.id",
        website: "https://bbpmkp.bppsdmp.pertanian.go.id",

        namaPic: "Dr. Hendro Wibowo",
        phonePic: "085612349876",
        emailPic: "hwibowo@pertanian.go.id",
        jabatanPic: "Widyaiswara Ahli Madya",

        rating: 4.2,
        status: "Aktif",
    },
    {
        id: "PYL-005",
        nama: "CV Solusi SDM Mandiri",
        tipe: "EKSTERNAL",
        alamat: "Jl. Gatot Subroto No. 45",
        kota: "Bandung",
        phone: "022-7654321",
        email: "admin@solusisdm.com",

        namaPic: "Anita Larasati",
        phonePic: "087766554433",
        emailPic: "anita@solusisdm.com",
        jabatanPic: "Direktur",

        npwp: "74.888.999.0-423.000",
        rating: 3.1,
        status: "Non-aktif", // Contoh vendor yang sudah dinonaktifkan (mungkin karena rating rendah atau tutup)
    }
];

export const dummyDataPenyelenggaraRows: PenyelenggaraPelatihanRow[] = [
    {
        id: "PYL-001",
        nama: "LPP Agro Nusantara",
        tipe: "LPP",
        alamat: "Jl. Jend. Urip Sumoharjo No. 100",
        kota: "Yogyakarta",
        phone: "0274-586601",
        email: "info@lpp.co.id",
        website: "https://lpp.co.id",
        status: "Aktif",
    },
    {
        id: "PYL-002",
        nama: "PTPN IV Corporate University",
        tipe: "INTERNAL_PTPN",
        alamat: "Jl. Letjen Suprapto No.2",
        kota: "Medan",
        phone: "061-4154666",
        email: "corpu@ptpn4.co.id",
        status: "Aktif",
    },
    {
        id: "PYL-003",
        nama: "PT MarkPlus Indonesia",
        tipe: "EKSTERNAL",
        alamat: "EightyEight@Kasablanka Tower, Lt. 8",
        kota: "Jakarta Selatan",
        phone: "021-28565300",
        email: "contact@markplusinc.com",
        website: "https://markplusinc.com",
        status: "Aktif",
    },
    {
        id: "PYL-004",
        nama: "Balai Besar Pelatihan Manajemen dan Kepemimpinan Pertanian",
        tipe: "KEMENTERIAN",
        alamat: "Jl. Raya Puncak Km. 72, Ciawi",
        kota: "Bogor",
        phone: "0251-8246522",
        email: "bbpmkp@pertanian.go.id",
        website: "https://bbpmkp.bppsdmp.pertanian.go.id",
        status: "Aktif",
    },
    {
        id: "PYL-005",
        nama: "CV Solusi SDM Mandiri",
        tipe: "EKSTERNAL",
        alamat: "Jl. Gatot Subroto No. 45",
        kota: "Bandung",
        phone: "022-7654321",
        email: "admin@solusisdm.com",
        status: "Non-aktif",
    }
];

export function getPenyelenggaraPelatihanDetail(id: string): PenyelenggaraPelatihan | undefined {
    return dummyDataPenyelenggara.find((penyelenggara) => penyelenggara.id === id);
}
