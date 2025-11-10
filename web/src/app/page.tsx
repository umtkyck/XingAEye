'use client'

import { useState } from 'react'
import { MapView } from '@/components/MapView'
import { StatsOverview } from '@/components/StatsOverview'
import { AlertList } from '@/components/AlertList'
import { Header } from '@/components/Header'
import { Sidebar } from '@/components/Sidebar'

export default function Dashboard() {
  const [selectedCrossing, setSelectedCrossing] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header />

        {/* Dashboard Content */}
        <main className="flex-1 overflow-hidden">
          <div className="h-full p-6 space-y-6 overflow-y-auto">
            {/* Stats Overview */}
            <StatsOverview />

            {/* Map and Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Map View */}
              <div className="lg:col-span-2">
                <div className="bg-card rounded-lg border shadow-sm overflow-hidden h-[600px]">
                  <div className="p-4 border-b">
                    <h2 className="text-lg font-semibold">Railroad Crossings Map</h2>
                    <p className="text-sm text-muted-foreground">
                      Real-time monitoring of all crossing locations
                    </p>
                  </div>
                  <MapView
                    onCrossingSelect={setSelectedCrossing}
                    selectedCrossing={selectedCrossing}
                  />
                </div>
              </div>

              {/* Active Alerts */}
              <div className="lg:col-span-1">
                <div className="bg-card rounded-lg border shadow-sm h-[600px] flex flex-col">
                  <div className="p-4 border-b">
                    <h2 className="text-lg font-semibold">Active Alerts</h2>
                    <p className="text-sm text-muted-foreground">
                      Recent alerts requiring attention
                    </p>
                  </div>
                  <AlertList crossingId={selectedCrossing} />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
