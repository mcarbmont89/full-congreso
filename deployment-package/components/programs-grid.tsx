"use client";

import Image from "next/image";

interface Program {
  id: number | string;
  title: string;
  description?: string;
  imageUrl?: string;
  url?: string;
}

interface ProgramsGridProps {
  programs: Program[];
}

export default function ProgramsGrid({ programs }: ProgramsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {programs.slice(0, 8).map((program) => {

        const handleClick = () => {
          if (program.url) {
            window.open(program.url, '_blank', 'noopener,noreferrer');
          }
        };

        return (
          <div
            key={program.id}
            onClick={handleClick}
            className={`rounded overflow-hidden transform transition-transform duration-300 hover:scale-105 group relative rounded-xl ${
              program.url ? 'cursor-pointer' : 'cursor-default'
            }`}
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={program.imageUrl || "/placeholder.svg"}
                alt={program.title}
                fill
                className="object-cover"
                unoptimized={true}
              />
              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4 rounded-xl my-2">
                <div className="text-center">
                  <p className="text-white text-sm md:text-base font-medium mb-2">
                    {program.description || "Sin descripción disponible"}
                  </p>
                  {program.url && (
                    <div className="flex items-center justify-center">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <div className="w-0 h-0 border-l-[16px] border-t-[10px] border-b-[10px] border-l-white border-t-transparent border-b-transparent ml-1"></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}