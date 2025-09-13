
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Trash2, Plus, Key } from 'lucide-react'

interface User {
  id: number
  username: string
  role: string
  is_active: boolean
}

export default function UsersManagementPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<string>('')

  // Form states
  const [newUsername, setNewUsername] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newRole, setNewRole] = useState('admin')
  const [updatePassword, setUpdatePassword] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      } else {
        setMessage('Error al obtener los usuarios')
      }
    } catch (error) {
      setMessage('Error al obtener los usuarios')
    } finally {
      setLoading(false)
    }
  }

  const createUser = async () => {
    if (!newUsername || !newPassword) {
      setMessage('El nombre de usuario y la contraseña son obligatorios')
      return
    }

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: newUsername,
          password: newPassword,
          role: newRole,
        }),
      })

      if (response.ok) {
        setMessage('Usuario creado exitosamente')
        setNewUsername('')
        setNewPassword('')
        setNewRole('admin')
        setIsCreateDialogOpen(false)
        fetchUsers()
      } else {
        const error = await response.json()
        setMessage(error.error || 'Error al crear el usuario')
      }
    } catch (error) {
      setMessage('Error al crear el usuario')
    }
  }

  const deactivateUser = async (username: string) => {
    if (!confirm(`¿Estás seguro de que quieres desactivar al usuario: ${username}?`)) {
      return
    }

    try {
      const response = await fetch('/api/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          action: 'deactivate',
        }),
      })

      if (response.ok) {
        setMessage('Usuario desactivado exitosamente')
        fetchUsers()
      } else {
        const error = await response.json()
        setMessage(error.error || 'Error al desactivar el usuario')
      }
    } catch (error) {
      setMessage('Error al desactivar el usuario')
    }
  }

  const updateUserPassword = async () => {
    if (!selectedUser || !updatePassword) {
      setMessage('El usuario y la nueva contraseña son obligatorios')
      return
    }

    try {
      const response = await fetch('/api/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: selectedUser,
          newPassword: updatePassword,
          action: 'updatePassword',
        }),
      })

      if (response.ok) {
        setMessage('Contraseña actualizada exitosamente')
        setUpdatePassword('')
        setSelectedUser('')
        setIsPasswordDialogOpen(false)
      } else {
        const error = await response.json()
        setMessage(error.error || 'Error al actualizar la contraseña')
      }
    } catch (error) {
      setMessage('Error al actualizar la contraseña')
    }
  }

  const initializeUsers = async () => {
    try {
      const response = await fetch('/api/admin/init-users', {
        method: 'POST',
      })

      if (response.ok) {
        setMessage('Usuarios predeterminados inicializados exitosamente')
        fetchUsers()
      } else {
        const error = await response.json()
        setMessage(error.error || 'Error al inicializar los usuarios')
      }
    } catch (error) {
      setMessage('Error al inicializar los usuarios')
    }
  }

  if (loading) {
    return <div className="p-6">Cargando usuarios...</div>
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Usuarios</CardTitle>
          <CardDescription>
            Administra los usuarios del sistema y sus permisos de acceso
          </CardDescription>
        </CardHeader>
        <CardContent>
          {message && (
            <Alert className="mb-4">
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2 mb-6">
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Crear Usuario
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Crear Nuevo Usuario</DialogTitle>
                  <DialogDescription>
                    Agregar un nuevo usuario al sistema
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="username">Nombre de Usuario</Label>
                    <Input
                      id="username"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      placeholder="Ingresa el nombre de usuario"
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Contraseña</Label>
                    <Input
                      id="password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Ingresa la contraseña"
                    />
                  </div>
                  <div>
                    <Label htmlFor="role">Rol</Label>
                    <Select value={newRole} onValueChange={setNewRole}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Administrador</SelectItem>
                        <SelectItem value="editor">Editor</SelectItem>
                        <SelectItem value="viewer">Visualizador</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={createUser} className="w-full">
                    Crear Usuario
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Key className="w-4 h-4 mr-2" />
                  Actualizar Contraseña
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Actualizar Contraseña de Usuario</DialogTitle>
                  <DialogDescription>
                    Cambiar la contraseña de un usuario
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="userSelect">Seleccionar Usuario</Label>
                    <Select value={selectedUser} onValueChange={setSelectedUser}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un usuario" />
                      </SelectTrigger>
                      <SelectContent>
                        {users.filter(user => user.is_active).map((user) => (
                          <SelectItem key={user.id} value={user.username}>
                            {user.username}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="newPassword">Nueva Contraseña</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={updatePassword}
                      onChange={(e) => setUpdatePassword(e.target.value)}
                      placeholder="Ingresa la nueva contraseña"
                    />
                  </div>
                  <Button onClick={updateUserPassword} className="w-full">
                    Actualizar Contraseña
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Button variant="outline" onClick={initializeUsers}>
              Inicializar Usuarios Predeterminados
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Usuario</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                      {user.role}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span 
                      className={`px-2 py-1 text-xs rounded-full ${
                        user.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {user.is_active ? 'Activo' : 'Inactivo'}
                    </span>
                  </TableCell>
                  <TableCell>
                    {user.is_active && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deactivateUser(user.username)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {users.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No se encontraron usuarios. Haz clic en "Inicializar Usuarios Predeterminados" para crear las cuentas de administrador predeterminadas.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
