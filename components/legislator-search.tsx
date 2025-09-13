"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Calendar } from "lucide-react"
import type { ParliamentaryGroup } from "@/lib/api"

export default function LegislatorSearch({
  parliamentaryGroups,
}: {
  parliamentaryGroups: ParliamentaryGroup[]
}) {
  const router = useRouter()
  const [name, setName] = useState("")
  const [groupId, setGroupId] = useState("")
  const [keywords, setKeywords] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [isSearching, setIsSearching] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSearching(true)

    try {
      // Build search query for VOD
      const searchTerms = []
      if (name) searchTerms.push(name)
      if (groupId) searchTerms.push(groupId)
      if (keywords) searchTerms.push(keywords)
      
      const searchQuery = searchTerms.join(" ")
      const vodUrl = `https://vod.canaldelcongreso.gob.mx/search?q=${encodeURIComponent(searchQuery)}`
      
      // Open VOD search in new tab
      window.open(vodUrl, '_blank')
    } catch (error) {
      console.error("Error searching legislators:", error)
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
      <div className="space-y-6">
        <div>
          <label htmlFor="legislator-name" className="block text-sm font-medium mb-2 text-white">
            Nombre Legislador (a):
          </label>
          <input
            id="legislator-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-transparent border-b border-white/70 pb-1 text-white focus:outline-none focus:border-white"
          />
        </div>

        <div>
          <label htmlFor="parliamentary-group" className="block text-sm font-medium mb-2 text-white">
            Grupo Parlamentario:
          </label>
          <input
            id="parliamentary-group"
            type="text"
            value={groupId}
            onChange={(e) => setGroupId(e.target.value)}
            className="w-full bg-transparent border-b border-white/70 pb-1 text-white focus:outline-none focus:border-white"
          />
        </div>

        <div>
          <label htmlFor="keywords" className="block text-sm font-medium mb-2 text-white">
            Palabras Clave:
          </label>
          <input
            id="keywords"
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            className="w-full bg-transparent border-b border-white/70 pb-1 text-white focus:outline-none focus:border-white"
          />
        </div>

        <div className="flex gap-8">
          <div className="flex-1">
            <label htmlFor="start-date" className="block text-sm font-medium mb-2 text-white">
              Del
            </label>
            <div className="relative">
              <input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-transparent border-b border-white/70 pb-1 text-white focus:outline-none focus:border-white [color-scheme:dark]"
              />
              <Calendar className="absolute right-0 bottom-2 w-4 h-4 text-white" />
            </div>
          </div>

          <div className="flex-1">
            <label htmlFor="end-date" className="block text-sm font-medium mb-2 text-white">
              Al
            </label>
            <div className="relative">
              <input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-transparent border-b border-white/70 pb-1 text-white focus:outline-none focus:border-white [color-scheme:dark]"
              />
              <Calendar className="absolute right-0 bottom-2 w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-8">
        <button
          type="submit"
          disabled={isSearching}
          className="bg-white text-[#2e004f] px-8 py-2 rounded-md font-medium disabled:opacity-70 hover:bg-white/90 transition-colors"
        >
          {isSearching ? "Buscando..." : "Enviar"}
        </button>
      </div>
    </form>
  )
}
