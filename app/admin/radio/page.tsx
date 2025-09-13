
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'

interface RadioProgram {
  id: string
  title: string
  description: string
  imageUrl: string
  latestEpisode: {
    title: string
    date: string
    duration: string
    description: string
  }
  programLink: string
  episodesLink: string
}

export default function RadioAdminPage() {
  const [programs, setPrograms] = useState<RadioProgram[]>([])
  const [streamUrl, setStreamUrl] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [selectedProgram, setSelectedProgram] = useState<RadioProgram | null>(null)

  useEffect(() => {
    fetchRadioData()
  }, [])

  const fetchRadioData = async () => {
    try {
      const [configResponse, programsResponse] = await Promise.all([
        fetch('/api/radio/config'),
        fetch('/api/radio/programs')
      ])
      
      const config = await configResponse.json()
      const programs = await programsResponse.json()
      
      setStreamUrl(config.streamUrl)
      setPrograms(programs)
    } catch (error) {
      console.error('Error fetching radio data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateStreamUrl = async () => {
    try {
      // In a real implementation, this would update the database
      console.log('Updating stream URL:', streamUrl)
      alert('Stream URL updated successfully!')
    } catch (error) {
      console.error('Error updating stream URL:', error)
    }
  }

  const updateProgram = async (program: RadioProgram) => {
    try {
      // In a real implementation, this would update the database
      const updatedPrograms = programs.map(p => 
        p.id === program.id ? program : p
      )
      setPrograms(updatedPrograms)
      setSelectedProgram(null)
      alert('Program updated successfully!')
    } catch (error) {
      console.error('Error updating program:', error)
    }
  }

  if (isLoading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Radio Content Management</h1>
      
      {/* Stream Configuration */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Live Stream Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="streamUrl">Stream URL</Label>
              <div className="flex space-x-2">
                <Input
                  id="streamUrl"
                  value={streamUrl}
                  onChange={(e) => setStreamUrl(e.target.value)}
                  placeholder="Enter HLS stream URL"
                />
                <Button onClick={updateStreamUrl}>Update</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Programs Management */}
      <Card>
        <CardHeader>
          <CardTitle>Featured Programs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {programs.map((program) => (
              <div key={program.id} className="border p-4 rounded">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{program.title}</h3>
                    <p className="text-gray-600 text-sm">{program.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Latest: {program.latestEpisode.title}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedProgram(program)}
                  >
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Edit Program Modal */}
      {selectedProgram && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Edit Program: {selectedProgram.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="programTitle">Program Title</Label>
                  <Input
                    id="programTitle"
                    value={selectedProgram.title}
                    onChange={(e) => setSelectedProgram({
                      ...selectedProgram,
                      title: e.target.value
                    })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="programDescription">Description</Label>
                  <Textarea
                    id="programDescription"
                    value={selectedProgram.description}
                    onChange={(e) => setSelectedProgram({
                      ...selectedProgram,
                      description: e.target.value
                    })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="episodeTitle">Latest Episode Title</Label>
                  <Input
                    id="episodeTitle"
                    value={selectedProgram.latestEpisode.title}
                    onChange={(e) => setSelectedProgram({
                      ...selectedProgram,
                      latestEpisode: {
                        ...selectedProgram.latestEpisode,
                        title: e.target.value
                      }
                    })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="episodeDescription">Episode Description</Label>
                  <Textarea
                    id="episodeDescription"
                    value={selectedProgram.latestEpisode.description}
                    onChange={(e) => setSelectedProgram({
                      ...selectedProgram,
                      latestEpisode: {
                        ...selectedProgram.latestEpisode,
                        description: e.target.value
                      }
                    })}
                  />
                </div>
                
                <div className="flex space-x-2">
                  <Button onClick={() => updateProgram(selectedProgram)}>
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={() => setSelectedProgram(null)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
