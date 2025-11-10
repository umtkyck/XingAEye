'use client'

import { useQuery } from '@tanstack/react-query'
import { AlertTriangle, Clock, CheckCircle } from 'lucide-react'
import { api } from '@/lib/api'
import { formatDistanceToNow } from 'date-fns'

interface AlertListProps {
  crossingId?: string | null
}

export function AlertList({ crossingId }: AlertListProps) {
  const { data: alerts, isLoading } = useQuery({
    queryKey: ['alerts', crossingId],
    queryFn: () => api.getAlerts({ crossingId: crossingId || undefined, status: 'new' }),
    refetchInterval: 10000, // Refresh every 10 seconds
  })

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-500 bg-red-500/10'
      case 'high':
        return 'text-orange-500 bg-orange-500/10'
      case 'medium':
        return 'text-yellow-500 bg-yellow-500/10'
      case 'low':
        return 'text-blue-500 bg-blue-500/10'
      default:
        return 'text-gray-500 bg-gray-500/10'
    }
  }

  const getAlertIcon = (type: string) => {
    // Return appropriate icon based on alert type
    return AlertTriangle
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Loading alerts...</p>
        </div>
      </div>
    )
  }

  const alertsList = alerts?.data?.alerts || []

  if (alertsList.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
          <p className="text-sm font-medium">No Active Alerts</p>
          <p className="text-xs text-muted-foreground mt-1">
            All systems operating normally
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4 space-y-3">
        {alertsList.map((alert: any) => {
          const Icon = getAlertIcon(alert.type)
          return (
            <div
              key={alert.alertId}
              className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${getSeverityColor(alert.severity)}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-medium truncate">{alert.title}</h4>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${getSeverityColor(
                        alert.severity
                      )}`}
                    >
                      {alert.severity}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {alert.description}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDistanceToNow(new Date(alert.timestamp), {
                        addSuffix: true,
                      })}
                    </span>
                    <span className="truncate">
                      {alert.crossingId}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
