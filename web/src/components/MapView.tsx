'use client'

import { useEffect, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

interface MapViewProps {
  onCrossingSelect: (crossingId: string | null) => void
  selectedCrossing: string | null
}

export function MapView({ onCrossingSelect, selectedCrossing }: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const [mapError, setMapError] = useState(false)

  const { data: crossings } = useQuery({
    queryKey: ['crossings'],
    queryFn: () => api.getCrossings(),
  })

  useEffect(() => {
    // Initialize Mapbox map
    // Note: This is a placeholder. In production, you would use react-map-gl or mapbox-gl
    // For now, we'll show a placeholder with crossing locations

    if (!mapContainer.current) return

    // Check if Mapbox token is available
    if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
      setMapError(true)
      return
    }

    // TODO: Initialize actual Mapbox map
    // const map = new mapboxgl.Map({
    //   container: mapContainer.current,
    //   style: 'mapbox://styles/mapbox/streets-v12',
    //   center: [-74.0060, 40.7128],
    //   zoom: 10,
    // })
  }, [])

  if (mapError) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-muted/20 p-8">
        <div className="text-center max-w-md">
          <h3 className="text-lg font-semibold mb-2">Map Configuration Required</h3>
          <p className="text-sm text-muted-foreground mb-4">
            To display the interactive map, add your Mapbox access token to the
            environment variables.
          </p>
          <code className="text-xs bg-muted px-2 py-1 rounded">
            NEXT_PUBLIC_MAPBOX_TOKEN=your_token_here
          </code>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-full">
      {/* Map Container */}
      <div ref={mapContainer} className="absolute inset-0 bg-muted/20">
        {/* Placeholder Map View */}
        <div className="h-full flex flex-col items-center justify-center p-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4">Railroad Crossings</h3>
            <div className="grid grid-cols-2 gap-4 max-w-2xl">
              {crossings?.data?.slice(0, 6).map((crossing: any, idx: number) => (
                <button
                  key={crossing.crossingId || idx}
                  onClick={() => onCrossingSelect(crossing.crossingId)}
                  className="p-4 bg-card border rounded-lg hover:bg-muted transition-colors text-left"
                >
                  <div className="flex items-start gap-2">
                    <div
                      className={`w-3 h-3 rounded-full mt-1 ${
                        crossing.status === 'active'
                          ? 'bg-green-500'
                          : 'bg-yellow-500'
                      }`}
                    />
                    <div>
                      <p className="font-medium text-sm">
                        {crossing.name || `Crossing ${idx + 1}`}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {crossing.location?.address || 'Location data'}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Configure Mapbox token for full interactive map
            </p>
          </div>
        </div>
      </div>

      {/* Map Controls */}
      <div className="absolute top-4 right-4 bg-card border rounded-lg shadow-lg p-2 space-y-2">
        <button className="w-8 h-8 flex items-center justify-center hover:bg-muted rounded">
          +
        </button>
        <button className="w-8 h-8 flex items-center justify-center hover:bg-muted rounded">
          -
        </button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-card border rounded-lg shadow-lg p-3">
        <p className="text-xs font-semibold mb-2">Status</p>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span>Active</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-yellow-500" />
            <span>Maintenance</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span>Alert</span>
          </div>
        </div>
      </div>
    </div>
  )
}
