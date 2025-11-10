'use client'

import {
  LayoutDashboard,
  MapPin,
  AlertTriangle,
  Video,
  BarChart3,
  Settings,
  ChevronLeft,
  Monitor,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
}

const navigation = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/', current: true },
  { name: 'Crossings', icon: MapPin, href: '/crossings', current: false },
  { name: 'Alerts', icon: AlertTriangle, href: '/alerts', current: false },
  { name: 'Devices', icon: Monitor, href: '/devices', current: false },
  { name: 'Videos', icon: Video, href: '/videos', current: false },
  { name: 'Analytics', icon: BarChart3, href: '/analytics', current: false },
  { name: 'Settings', icon: Settings, href: '/settings', current: false },
]

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  return (
    <aside
      className={cn(
        'bg-card border-r transition-all duration-300',
        isOpen ? 'w-64' : 'w-20'
      )}
    >
      <div className="h-full flex flex-col">
        {/* Toggle Button */}
        <div className="p-4 flex justify-end">
          <button
            onClick={onToggle}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <ChevronLeft
              className={cn(
                'w-5 h-5 transition-transform',
                !isOpen && 'rotate-180'
              )}
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <a
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                  item.current
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {isOpen && <span className="text-sm font-medium">{item.name}</span>}
              </a>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t">
          <div className={cn('text-xs text-muted-foreground', !isOpen && 'text-center')}>
            {isOpen ? 'v1.0.0' : 'v1'}
          </div>
        </div>
      </div>
    </aside>
  )
}
