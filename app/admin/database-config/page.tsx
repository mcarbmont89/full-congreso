import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, AlertCircle, Database } from "lucide-react"
import { DatabaseConfigClient } from "./database-config-client"

export default function DatabaseConfigPage() {
  return (
    <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-3">
            <Database className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Database Configuration</h1>
              <p className="text-gray-600">Manage your database connection and initialization</p>
            </div>
          </div>

          <DatabaseConfigClient />

          {/* Database Info */}
          <Card>
            <CardHeader>
              <CardTitle>Database Information</CardTitle>
              <CardDescription>
                Current database configuration details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Environment Variables</h4>
                  <div className="space-y-1 text-sm">
                    <div>Database URL: {process.env.DATABASE_URL ? '✓ Set' : '✗ Not set'}</div>
                    <div>Direct URL: {process.env.DIRECT_URL ? '✓ Set' : '✗ Not set'}</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Tables</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div>• live_streams</div>
                    <div>• programs</div>
                    <div>• news</div>
                    <div>• organs</div>
                    <div>• parliamentary_groups</div>
                    <div>• legislators</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
  )
}