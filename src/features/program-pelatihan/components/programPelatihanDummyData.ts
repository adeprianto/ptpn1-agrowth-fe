export interface Pelatihan {
    id: string;
    nama: string;
    penyelenggara: string;
    jenisPsdm: "Pengembangan BOD/BOC" | "Agrowallet" | "IHT" | "Public Training" | "Kursus Jabatan" | "Benchmarking" | "Program Budaya" | "Sertifikasi";
    jenisKompetensi: "Hard Competency" | "Soft Competency" | "Hard & Soft Competency";
    bidang: string;
    deskripsi: string;
}

export interface PelatihanRow {
    id: string;
    nama: string;
    penyelenggara: string;
    jenisPsdm: "Pengembangan BOD/BOC" | "Agrowallet" | "IHT" | "Public Training" | "Kursus Jabatan" | "Benchmarking" | "Program Budaya" | "Sertifikasi";
    jenisKompetensi: "Hard Competency" | "Soft Competency" | "Hard & Soft Competency";
    bidang: string;
    deskripsi: string;
}

export const dummyDataPelatihan: Pelatihan[] = [
    {
        id: "PLT-001",
        nama: "Pemetaan Spasial Kebun Berbasis GIS",
        penyelenggara: "LPP Agro Nusantara",
        jenisPsdm: "IHT",
        jenisKompetensi: "Hard Competency",
        bidang: "IT",
        deskripsi: "Pelatihan teknis pemetaan lahan perkebunan menggunakan QGIS dan ArcGIS untuk mendukung akurasi data spasial afdeling."
    },
    {
        id: "PLT-002",
        nama: "Sertifikasi Ahli K3 Umum (AK3U)",
        penyelenggara: "Kementerian Ketenagakerjaan RI",
        jenisPsdm: "Sertifikasi",
        jenisKompetensi: "Hard Competency",
        bidang: "Umum",
        deskripsi: "Program sertifikasi wajib untuk personel pengurus P2K3 guna mengawal keselamatan dan kesehatan kerja di lingkungan pabrik dan kebun."
    },
    {
        id: "PLT-003",
        nama: "Service Excellence for Agritourism",
        penyelenggara: "PT MarkPlus Indonesia",
        jenisPsdm: "Agrowallet",
        jenisKompetensi: "Soft Competency",
        bidang: "SDM",
        deskripsi: "Pelatihan peningkatan standar pelayanan tamu dan komunikasi hospitality khusus untuk petugas frontliner di unit agrowisata."
    },
    {
        id: "PLT-004",
        nama: "Internalisasi Core Values AKHLAK BUMN",
        penyelenggara: "CV Solusi SDM Mandiri",
        jenisPsdm: "Program Budaya",
        jenisKompetensi: "Soft Competency",
        bidang: "SDM",
        deskripsi: "Workshop penguatan budaya kerja adaptif dan kolaboratif berbasis nilai-nilai AKHLAK bagi seluruh insan perusahaan."
    },
    {
        id: "PLT-005",
        nama: "Planters Leadership Development Program (PLDP) III - Keuangan",
        penyelenggara: "PTPN I (Persero)",
        jenisPsdm: "Kursus Jabatan",
        jenisKompetensi: "Hard & Soft Competency",
        bidang: "Keuangan",
        deskripsi: "Program orientasi dan pembekalan teknis serta kepemimpinan lapangan bagi jajaran Calon Karyawan Pimpinan (CKP)."
    },
    {
        id: "PLT-006",
        nama: "Benchmarking Pengelolaan Eduwisata Ramah Lingkungan",
        penyelenggara: "Ecotourism Indonesia",
        jenisPsdm: "Benchmarking",
        jenisKompetensi: "Hard & Soft Competency",
        bidang: "Umum",
        deskripsi: "Studi banding pengelolaan infrastruktur hijau dan pengolahan bank sampah di destinasi wisata unggulan."
    },
    {
        id: "PLT-007",
        nama: "Executive Strategic Management for Plantation",
        penyelenggara: "Lembaga Management FEB UI",
        jenisPsdm: "Pengembangan BOD/BOC",
        jenisKompetensi: "Hard & Soft Competency",
        bidang: "Operational",
        deskripsi: "Pengembangan wawasan strategis dan pengambilan keputusan untuk optimalisasi aset oleh jajaran Direksi dan Komisaris."
    },
    {
        id: "PLT-008",
        nama: "Penggunaan Modul SAP HCM untuk Reporting",
        penyelenggara: "SAP Indonesia",
        jenisPsdm: "Public Training",
        jenisKompetensi: "Hard Competency",
        bidang: "SDM",
        deskripsi: "Pelatihan eksternal untuk pemanfaatan sistem SAP ERP pada modul Human Capital Management dalam menarik laporan SDM."
    }
]

export const dummyDataPelatihanRows: PelatihanRow[] = [
    {
        id: "PLT-001",
        nama: "Pemetaan Spasial Kebun Berbasis GIS",
        penyelenggara: "LPP Agro Nusantara",
        jenisPsdm: "IHT",
        jenisKompetensi: "Hard Competency",
        bidang: "IT",
        deskripsi: "Pelatihan teknis pemetaan lahan perkebunan menggunakan QGIS dan ArcGIS untuk mendukung akurasi data spasial afdeling."
    },
    {
        id: "PLT-002",
        nama: "Sertifikasi Ahli K3 Umum (AK3U)",
        penyelenggara: "Kementerian Ketenagakerjaan RI",
        jenisPsdm: "Sertifikasi",
        jenisKompetensi: "Hard Competency",
        bidang: "Umum",
        deskripsi: "Program sertifikasi wajib untuk personel pengurus P2K3 guna mengawal keselamatan dan kesehatan kerja di lingkungan pabrik dan kebun."
    },
    {
        id: "PLT-003",
        nama: "Service Excellence for Agritourism",
        penyelenggara: "PT MarkPlus Indonesia",
        jenisPsdm: "Agrowallet",
        jenisKompetensi: "Soft Competency",
        bidang: "SDM",
        deskripsi: "Pelatihan peningkatan standar pelayanan tamu dan komunikasi hospitality khusus untuk petugas frontliner di unit agrowisata."
    },
    {
        id: "PLT-004",
        nama: "Internalisasi Core Values AKHLAK BUMN",
        penyelenggara: "CV Solusi SDM Mandiri",
        jenisPsdm: "Program Budaya",
        jenisKompetensi: "Soft Competency",
        bidang: "SDM",
        deskripsi: "Workshop penguatan budaya kerja adaptif dan kolaboratif berbasis nilai-nilai AKHLAK bagi seluruh insan perusahaan."
    },
    {
        id: "PLT-005",
        nama: "Planters Leadership Development Program (PLDP) III - Keuangan",
        penyelenggara: "PTPN I (Persero)",
        jenisPsdm: "Kursus Jabatan",
        jenisKompetensi: "Hard & Soft Competency",
        bidang: "Keuangan",
        deskripsi: "Program orientasi dan pembekalan teknis serta kepemimpinan lapangan bagi jajaran Calon Karyawan Pimpinan (CKP)."
    },
    {
        id: "PLT-006",
        nama: "Benchmarking Pengelolaan Eduwisata Ramah Lingkungan",
        penyelenggara: "Ecotourism Indonesia",
        jenisPsdm: "Benchmarking",
        jenisKompetensi: "Hard & Soft Competency",
        bidang: "Umum",
        deskripsi: "Studi banding pengelolaan infrastruktur hijau dan pengolahan bank sampah di destinasi wisata unggulan."
    },
    {
        id: "PLT-007",
        nama: "Executive Strategic Management for Plantation",
        penyelenggara: "Lembaga Management FEB UI",
        jenisPsdm: "Pengembangan BOD/BOC",
        jenisKompetensi: "Hard & Soft Competency",
        bidang: "Operational",
        deskripsi: "Pengembangan wawasan strategis dan pengambilan keputusan untuk optimalisasi aset oleh jajaran Direksi dan Komisaris."
    },
    {
        id: "PLT-008",
        nama: "Penggunaan Modul SAP HCM untuk Reporting",
        penyelenggara: "SAP Indonesia",
        jenisPsdm: "Public Training",
        jenisKompetensi: "Hard Competency",
        bidang: "SDM",
        deskripsi: "Pelatihan eksternal untuk pemanfaatan sistem SAP ERP pada modul Human Capital Management dalam menarik laporan SDM."
    }
]
