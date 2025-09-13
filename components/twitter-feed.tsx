
import React from 'react'

interface TwitterFeedProps {
  className?: string
}

const TwitterFeed: React.FC<TwitterFeedProps> = ({ className }) => {
  return (
    <div className={className}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <h2 className="bg-purple-900 text-white px-4 py-2 font-bold uppercase text-sm">
          Twitter Feed
        </h2>
        <div className="p-4">
          <div className="space-y-4">
            <div className="border-b border-gray-200 pb-4">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-bold text-sm">CC</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-gray-900">Canal del Congreso</span>
                    <span className="text-gray-500 text-sm">@CanalCongreso</span>
                    <span className="text-gray-500 text-sm">·</span>
                    <span className="text-gray-500 text-sm">2h</span>
                  </div>
                  <p className="text-gray-700 text-sm">
                    Mantente informado sobre las últimas actividades del Congreso de México. 
                    Transmisiones en vivo y contenido oficial.
                  </p>
                </div>
              </div>
            </div>
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm">
                El feed de Twitter se mostrará aquí cuando esté configurado
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TwitterFeed
