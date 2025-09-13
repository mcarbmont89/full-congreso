"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type MobileMenuContextType = {
  isMenuOpen: boolean
  toggleMenu: () => void
  closeMenu: () => void
}

const MobileMenuContext = createContext<MobileMenuContextType | undefined>(undefined)

export function MobileMenuProvider({ children }: { children: ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      // Apply immediately without delay
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
      document.body.classList.add("menu-open")
    } else {
      // Small delay when closing to prevent flickering
      const timeoutId = setTimeout(() => {
        document.body.style.overflow = ''
        document.body.style.position = ''
        document.body.style.width = ''
        document.body.classList.remove("menu-open")
      }, 50)
      
      return () => clearTimeout(timeoutId)
    }

    return () => {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
      document.body.classList.remove("menu-open")
    }
  }, [isMenuOpen])

  return (
    <MobileMenuContext.Provider value={{ isMenuOpen, toggleMenu, closeMenu }}>{children}</MobileMenuContext.Provider>
  )
}

export function useMobileMenu() {
  const context = useContext(MobileMenuContext)
  if (context === undefined) {
    console.warn("useMobileMenu used outside MobileMenuProvider, returning default values")
    return { isMenuOpen: false, toggleMenu: () => {}, closeMenu: () => {} }
  }
  return context
}