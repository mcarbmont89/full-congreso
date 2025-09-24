"use client"

import dynamic from 'next/dynamic'
import React from 'react'

// Dynamically import TinyMCE to avoid SSR issues
const TinyMCEEditor = dynamic(() => import('./tinymce-editor'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-64 bg-gray-100 border border-gray-300 rounded-md flex items-center justify-center">
      <span className="text-gray-500">Cargando editor...</span>
    </div>
  )
})

interface TinyMCEWrapperProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: number;
  readOnly?: boolean;
}

export default function TinyMCEWrapper(props: TinyMCEWrapperProps) {
  return <TinyMCEEditor {...props} />
}