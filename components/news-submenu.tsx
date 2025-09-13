"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { label: "Inicio", href: "/noticias" },
  {
    label: "Todas las Noticias",
    href: "/noticias/todas",
  },
  {
    label: "Foros y seminarios",
    href: "/noticias/categorias/foros-y-seminarios",
  },
  {
    label: "Reformas aprobadas",
    href: "/noticias/categorias/reformas-aprobadas",
  },
  {
    label: "Temas de actualidad",
    href: "/noticias/categorias/temas-de-actualidad",
  },
  {
    label: "Trabajo en comisiones",
    href: "/noticias/categorias/trabajo-en-comisiones",
  },
  { label: "Reformas en DOF", href: "/noticias/categorias/reformas-en-dof" },
  {
    label: "Trabajos en pleno",
    href: "/noticias/categorias/trabajos-en-pleno",
  },
];

export default function NewsSubmenu() {
  const pathname = usePathname();

  return (
    <nav className="w-full bg-[#c41c5c]">
      <div className="px-4 py-2 md:px-8 max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-center gap-1 md:gap-2">
          {menuItems.map((item) => {
            const isActive =
              pathname === item.href || pathname?.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  whitespace-nowrap px-3 py-1 md:px-4 md:py-1 text-white text-xs md:text-base font-medium
                  transition-colors duration-200 hover:bg-[#a01a4d] hover:text-white rounded
                  ${isActive ? "bg-[#a01a4d] text-white" : ""}
                `}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}