"use client";

import React from "react";
import Image from "next/image";

interface LogoProps {
  className?: string;
  variant?: "navbar" | "dark" | "icon" | "white";
  size?: "sm" | "md" | "lg";
}

export const Logo: React.FC<LogoProps> = ({
  className = "",
  variant = "navbar",
  size = "md",
}) => {
  const isWhite = variant === "dark" || variant === "white";

  const iconSizes = {
    sm: "w-9 h-9",
    md: "w-11 h-11",
    lg: "w-14 h-14",
  };

  const imagePx = {
    sm: 36,
    md: 44,
    lg: 56,
  };

  return (
    <div className={`flex items-center gap-3 cursor-pointer select-none ${className}`}>
      {/* Official Circular IDI Emblem Image matching user upload */}
      <div
        className={`relative ${iconSizes[size]} rounded-full overflow-hidden shadow-sm shrink-0 border-2 ${
          isWhite ? "border-white/40 ring-2 ring-white/20" : "border-red-600/30 ring-2 ring-red-100"
        } bg-white flex items-center justify-center`}
      >
        <Image
          src="/images/idi-logo.png"
          alt="Logo Ikatan Dokter Indonesia (IDI) Cabang Lombok Timur"
          width={imagePx[size]}
          height={imagePx[size]}
          priority
          className="object-contain rounded-full"
        />
      </div>

      {variant !== "icon" && (
        <div className="flex flex-col text-left leading-tight">
          {/* Di atas tulisan IKATAN DOKTER INDONESIA (IDI) */}
          <span
            className={`font-black tracking-tight ${
              size === "sm" ? "text-xs sm:text-sm" : size === "lg" ? "text-base sm:text-lg" : "text-sm sm:text-base"
            } ${isWhite ? "text-white" : "text-slate-900"}`}
          >
            IKATAN DOKTER INDONESIA (IDI)
          </span>

          {/* Di bawah Cabang Lombok Timur */}
          <span
            className={`font-semibold tracking-wide ${
              size === "sm" ? "text-[10px]" : "text-xs"
            } ${isWhite ? "text-purple-200" : "text-red-700"}`}
          >
            Cabang Lombok Timur
          </span>
        </div>
      )}
    </div>
  );
};
export default Logo;
