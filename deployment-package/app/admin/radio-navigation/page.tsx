
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Trash2, Plus, GripVertical } from 'lucide-react'

interface NavigationItem {
  id: string
  name: string
  href: string
  displayOrder: number
}

export default function RadioNavigationAdmin() {
  const [navigationItems, setNavigationItems] = useState<NavigationItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    fetchNavigationItems()
  }, [])

  const fetchNavigationItems = async () => {
    try {
      const response = await fetch('/api/radio/navigation')
      if (response.ok) {
        const data = await response.json()
        setNavigationItems(data)
      }
    } catch (error) {
      console.error('Error fetching navigation items:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const saveNavigationItems = async () => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/radio/navigation', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(navigationItems),
      })

      if (response.ok) {
        alert('Navigation items saved successfully!')
      } else {
        alert('Error saving navigation items')
      }
    } catch (error) {
      console.error('Error saving navigation items:', error)
      alert('Error saving navigation items')
    } finally {
      setIsSaving(false)
    }
  }

  const addNavigationItem = () => {
    const newItem: NavigationItem = {
      id: `nav-${Date.now()}`,
      name: '',
      href: '',
      displayOrder: navigationItems.length
    }
    setNavigationItems([...navigationItems, newItem])
  }

  const updateNavigationItem = (id: string, field: keyof NavigationItem, value: string | number) => {
    setNavigationItems(items =>
      items.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    )
  }

  const removeNavigationItem = (id: string) => {
    setNavigationItems(items => items.filter(item => item.id !== id))
  }

  const moveItem = (fromIndex: number, toIndex: number) => {
    const newItems = [...navigationItems]
    const [movedItem] = newItems.splice(fromIndex, 1)
    newItems.splice(toIndex, 0, movedItem)
    
    // Update display order
    newItems.forEach((item, index) => {
      item.displayOrder = index
    })
    
    setNavigationItems(newItems)
  }

  if (isLoading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Radio Navigation Management</h1>
        <p className="text-gray-600">Manage the navigation items that appear in the radio section bar.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Radio Navigation Items
            <Button onClick={addNavigationItem} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {navigationItems.map((item, index) => (
              <div key={item.id} className="border p-4 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="cursor-move">
                    <GripVertical className="w-4 h-4 text-gray-400" />
                  </div>
                  
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`name-${item.id}`}>Display Name</Label>
                      <Input
                        id={`name-${item.id}`}
                        value={item.name}
                        onChange={(e) => updateNavigationItem(item.id, 'name', e.target.value)}
                        placeholder="e.g., Toma Tribuna"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`href-${item.id}`}>URL Path</Label>
                      <Input
                        id={`href-${item.id}`}
                        value={item.href}
                        onChange={(e) => updateNavigationItem(item.id, 'href', e.target.value)}
                        placeholder="e.g., /radio/toma-tribuna"
                      />
                    </div>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeNavigationItem(item.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {navigationItems.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No navigation items yet. Click "Add Item" to create one.
            </div>
          )}

          <div className="mt-6 flex gap-2">
            <Button onClick={saveNavigationItems} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button variant="outline" onClick={fetchNavigationItems}>
              Reset Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
