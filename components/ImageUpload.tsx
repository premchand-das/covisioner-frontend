"use client";

import { useRef, useState } from "react";
import api from "@/lib/api";

export default function ImageUpload({
  label,
  value,
  onChange,
}: {
  label: string;
  value?: string;
  onChange: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async (file: File) => {
    try {
      setUploading(true);
      setError("");

      const formData = new FormData();
      formData.append("image", file);

      const res = await api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      onChange(res.data.imageUrl);
    }  catch (err: any) {
  console.error("IMAGE UPLOAD ERROR:", err);
  setError(
    err?.response?.data?.message ||
      err?.response?.data?.error ||
      "Image upload failed"
  );
}
  };

  return (
    <div>
      <label className="text-sm font-extrabold text-neutral-800">{label}</label>

      <div className="mt-2 rounded-2xl border border-black/10 bg-white p-4">
        {value ? (
          <img
            src={value}
            alt={label}
            className="h-40 w-full rounded-xl object-cover"
          />
        ) : (
          <div className="flex h-40 w-full items-center justify-center rounded-xl bg-neutral-100 text-sm font-bold text-neutral-400">
            No image uploaded
          </div>
        )}

        <div className="mt-4 flex gap-3">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="rounded-xl bg-neutral-950 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60"
          >
            {uploading ? "Uploading..." : "Upload Image"}
          </button>

          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="rounded-xl bg-red-50 px-4 py-2.5 text-sm font-bold text-red-600"
            >
              Remove
            </button>
          )}
        </div>

        {error && <p className="mt-3 text-sm font-semibold text-red-600">{error}</p>}

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/jpg"
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleUpload(file);
          }}
        />
      </div>
    </div>
  );
}