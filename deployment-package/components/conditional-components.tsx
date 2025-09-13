
"use client"

import { usePathname } from "next/navigation"
import Navbar from "@/components/navbar"
import SocialBar from "@/components/social-bar"
import AccessibilityButton from "@/components/accessibility-button"

export default function ConditionalComponents() {
  const pathname = usePathname()
  
  // Hide navbar, social bar, and accessibility button on transmission pages, admin pages, and login page
  const isTransmissionPage = pathname?.startsWith('/transmisiones/') && pathname !== '/transmisiones'
  const isAdminPage = pathname?.startsWith('/admin')
  const isLoginPage = pathname === '/login'
  
  if (isTransmissionPage || isAdminPage || isLoginPage) {
    return null
  }
  
  return (
    <>
      <SocialBar />
      <AccessibilityButton />
      <Navbar />
    </>
  )
}
