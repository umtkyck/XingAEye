'use client'

import { Bell, User, Settings } from 'lucide-react'

export function Header() {
  return (
    <header className="bg-card border-b px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">🚂 XingAEye</h1>
          <p className="text-sm text-muted-foreground">
            Railroad Crossing Safety System
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative p-2 hover:bg-muted rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
          </button>

          {/* Settings */}
          <button className="p-2 hover:bg-muted rounded-lg transition-colors">
            <Settings className="w-5 h-5" />
          </button>

          {/* User Profile */}
          <button className="flex items-center gap-2 p-2 hover:bg-muted rounded-lg transition-colors">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-sm font-medium">Admin User</span>
          </button>
        </div>
      </div>
    </header>
  )
}
