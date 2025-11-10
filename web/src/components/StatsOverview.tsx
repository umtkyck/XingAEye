'use client'

import { useQuery } from '@tanstack/react-query'
import { AlertTriangle, MapPin, Monitor, TrendingUp } from 'lucide-react'
import { api } from '@/lib/api'

export function StatsOverview() {
  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => api.getDashboardStats(),
    refetchInterval: 30000, // Refresh every 30 seconds
  })

  const cards = [
    {
      title: 'Total Crossings',
      value: stats?.overview?.totalCrossings || 0,
      subtitle: `${stats?.overview?.activeCrossings || 0} active`,
      icon: MapPin,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Online Devices',
      value: stats?.overview?.onlineDevices || 0,
      subtitle: `of ${stats?.overview?.totalDevices || 0} total`,
      icon: Monitor,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Active Alerts',
      value: stats?.overview?.activeAlerts || 0,
      subtitle: `${stats?.overview?.criticalAlerts || 0} critical`,
      icon: AlertTriangle,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
    },
    {
      title: 'System Uptime',
      value: `${stats?.performance?.uptime || 99.5}%`,
      subtitle: 'Last 30 days',
      icon: TrendingUp,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <div
            key={card.title}
            className="bg-card rounded-lg border shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </p>
                <p className="text-3xl font-bold mt-2">{card.value}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {card.subtitle}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${card.bgColor}`}>
                <Icon className={`w-6 h-6 ${card.color}`} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
