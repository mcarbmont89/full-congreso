"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertCircle, Database } from "lucide-react"

export function DatabaseConfigClient() {
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle')
  const [initStatus, setInitStatus] = useState<'idle' | 'initializing' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleTestConnection = async () => {
    setConnectionStatus('testing')
    setMessage('')

    try {
      const response = await fetch('/api/admin/test-connection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // Use environment variables for testing
          useEnvVars: true
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Connection failed')
      }

      setConnectionStatus('success')
      setMessage('Database connection successful!')
    } catch (error) {
      setConnectionStatus('error')
      setMessage(error instanceof Error ? error.message : 'Connection failed')
    }
  }

  const handleInitializeDatabase = async () => {
    setInitStatus('initializing')
    setMessage('')

    try {
      const response = await fetch('/api/admin/init-db', {
        method: 'POST',
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Initialization failed')
      }

      setInitStatus('success')
      setMessage('Database initialized successfully!')
    } catch (error) {
      setInitStatus('error')
      setMessage(error instanceof Error ? error.message : 'Initialization failed')
    }
  }

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2">
        {/* Connection Test Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Connection Test
            </CardTitle>
            <CardDescription>
              Test the connection to your PostgreSQL database
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Status:</span>
              {connectionStatus === 'idle' && <Badge variant="secondary">Not tested</Badge>}
              {connectionStatus === 'testing' && <Badge variant="secondary">Testing...</Badge>}
              {connectionStatus === 'success' && (
                <Badge variant="default" className="bg-green-500">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Connected
                </Badge>
              )}
              {connectionStatus === 'error' && (
                <Badge variant="destructive">
                  <XCircle className="h-3 w-3 mr-1" />
                  Failed
                </Badge>
              )}
            </div>

            <Button 
              onClick={handleTestConnection}
              disabled={connectionStatus === 'testing'}
              className="w-full"
            >
              {connectionStatus === 'testing' ? 'Testing...' : 'Test Connection'}
            </Button>
          </CardContent>
        </Card>

        {/* Database Initialization Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Database Setup
            </CardTitle>
            <CardDescription>
              Initialize the database with required tables and data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Status:</span>
              {initStatus === 'idle' && <Badge variant="secondary">Not initialized</Badge>}
              {initStatus === 'initializing' && <Badge variant="secondary">Initializing...</Badge>}
              {initStatus === 'success' && (
                <Badge variant="default" className="bg-green-500">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Initialized
                </Badge>
              )}
              {initStatus === 'error' && (
                <Badge variant="destructive">
                  <XCircle className="h-3 w-3 mr-1" />
                  Failed
                </Badge>
              )}
            </div>

            <Button 
              onClick={handleInitializeDatabase}
              disabled={initStatus === 'initializing' || connectionStatus !== 'success'}
              className="w-full"
              variant={connectionStatus !== 'success' ? 'secondary' : 'default'}
            >
              {initStatus === 'initializing' ? 'Initializing...' : 'Initialize Database'}
            </Button>

            {connectionStatus !== 'success' && (
              <p className="text-sm text-gray-500">
                Test connection first before initializing
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Status Messages */}
      {message && (
        <Card>
          <CardContent className="pt-6">
            <div className={`p-4 rounded-lg ${
              (connectionStatus === 'success' || initStatus === 'success') 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              <div className="flex items-center gap-2">
                {(connectionStatus === 'success' || initStatus === 'success') ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )}
                <span className="font-medium">{message}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  )
}