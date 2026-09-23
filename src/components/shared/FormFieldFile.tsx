"use client";

import React, { useState, useRef, DragEvent, ChangeEvent } from "react";
import { cn } from "cn";

interface FormFieldFileProps {
    onFileSelect?: (file: File) => void;
    maxSizeMB?: number;
}

export default function FormFieldFile({
    onFileSelect,
    maxSizeMB = 50
}: FormFieldFileProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const validateAndProcessFile = (file: File) => {
        setError(null);

        // Validasi ekstensi/tipe (opsional, sebagai pengamanan tambahan)
        const fileExtension = file.name.split('.').pop()?.toLowerCase();
        if (!["xlsx", "xls", "csv"].includes(fileExtension || "")) {
            setError("Format file tidak didukung. Harap unggah .XLSX, .XLS, atau .CSV");
            return;
        }

        // Validasi ukuran
        if (file.size > maxSizeMB * 1024 * 1024) {
            setError(`Ukuran file melebihi batas maksimal (${maxSizeMB} MB)`);
            return;
        }

        setSelectedFileName(file.name);
        if (onFileSelect) {
            onFileSelect(file);
        }
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            validateAndProcessFile(file);
            e.dataTransfer.clearData();
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            validateAndProcessFile(file);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="w-full">
            <div
                className={cn(
                    // tata letak
                    "relative flex flex-col items-center justify-center",
                    // tampilan
                    "rounded-2xl border-2 border-dashed p-10",
                    // teks
                    "text-center",
                    // gerak
                    "transition-colors duration-200",
                    // keadaan
                    isDragging
                        ? "border-emerald-500 bg-emerald-50/50"
                        : "border-emerald-200/80 bg-white hover:bg-emerald-200/10",
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                {/* Hidden File Input */}
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleChange}
                    accept=".xlsx, .xls, .csv"
                    className="hidden"
                />

                {/* Icon */}
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="h-7 w-7"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                        />
                    </svg>
                </div>

                {/* Text */}
                <h3 className="mb-1 text-base font-semibold text-slate-800">
                    Tarik dan lepas berkas spreadsheet ke sini
                </h3>
                <p className="mb-6 text-sm text-slate-500">
                    Format file yang didukung: .XLSX, .XLS, atau .CSV (Maksimal {maxSizeMB} MB)
                </p>

                {/* Button */}
                <button
                    type="button"
                    onClick={triggerFileInput}
                    className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                >
                    Pilih Berkas Komputer
                </button>
            </div>

            {/* Feedback Messages */}
            {error && (
                <p className="mt-3 text-sm font-medium text-rose-500 text-center">
                    {error}
                </p>
            )}
            {selectedFileName && !error && (
                <p className="mt-3 text-sm font-medium text-emerald-600 text-center">
                    File terpilih: {selectedFileName}
                </p>
            )}
        </div>
    );
}
