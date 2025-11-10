import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native'
import { useQuery } from '@tanstack/react-query'
import { Ionicons } from '@expo/vector-icons'
import { api } from '../services/api'

export function HomeScreen() {
  const { data: stats, isLoading, refetch } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => api.getDashboardStats(),
  })

  const { data: recentAlerts } = useQuery({
    queryKey: ['recent-alerts'],
    queryFn: () => api.getAlerts({ limit: 5 }),
  })

  const StatCard = ({ title, value, subtitle, icon, color }: any) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statContent}>
        <View>
          <Text style={styles.statTitle}>{title}</Text>
          <Text style={styles.statValue}>{value}</Text>
          <Text style={styles.statSubtitle}>{subtitle}</Text>
        </View>
        <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
          <Ionicons name={icon} size={24} color={color} />
        </View>
      </View>
    </View>
  )

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={refetch} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dashboard</Text>
        <Text style={styles.headerSubtitle}>
          Railroad Crossing Safety System
        </Text>
      </View>

      <View style={styles.statsGrid}>
        <StatCard
          title="Total Crossings"
          value={stats?.overview?.totalCrossings || 0}
          subtitle={`${stats?.overview?.activeCrossings || 0} active`}
          icon="map"
          color="#2563eb"
        />
        <StatCard
          title="Online Devices"
          value={stats?.overview?.onlineDevices || 0}
          subtitle={`of ${stats?.overview?.totalDevices || 0} total`}
          icon="hardware-chip"
          color="#10b981"
        />
        <StatCard
          title="Active Alerts"
          value={stats?.overview?.activeAlerts || 0}
          subtitle={`${stats?.overview?.criticalAlerts || 0} critical`}
          icon="alert-circle"
          color="#ef4444"
        />
        <StatCard
          title="System Uptime"
          value={`${stats?.performance?.uptime || 99.5}%`}
          subtitle="Last 30 days"
          icon="trending-up"
          color="#8b5cf6"
        />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Alerts</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        {recentAlerts?.data?.alerts?.slice(0, 3).map((alert: any) => (
          <TouchableOpacity key={alert.alertId} style={styles.alertCard}>
            <View style={styles.alertIconContainer}>
              <Ionicons
                name="alert-circle"
                size={20}
                color={getSeverityColor(alert.severity)}
              />
            </View>
            <View style={styles.alertContent}>
              <Text style={styles.alertTitle}>{alert.title}</Text>
              <Text style={styles.alertDescription} numberOfLines={1}>
                {alert.description}
              </Text>
              <Text style={styles.alertTime}>
                {new Date(alert.timestamp).toLocaleTimeString()}
              </Text>
            </View>
            <View
              style={[
                styles.severityBadge,
                { backgroundColor: getSeverityColor(alert.severity) + '20' },
              ]}
            >
              <Text
                style={[
                  styles.severityText,
                  { color: getSeverityColor(alert.severity) },
                ]}
              >
                {alert.severity}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  )
}

function getSeverityColor(severity: string) {
  switch (severity) {
    case 'critical':
      return '#ef4444'
    case 'high':
      return '#f97316'
    case 'medium':
      return '#eab308'
    case 'low':
      return '#3b82f6'
    default:
      return '#6b7280'
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  statsGrid: {
    padding: 16,
    gap: 12,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  statContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statTitle: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  statSubtitle: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  seeAll: {
    fontSize: 14,
    color: '#2563eb',
  },
  alertCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  alertIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  alertDescription: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2,
  },
  alertTime: {
    fontSize: 11,
    color: '#9ca3af',
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  severityText: {
    fontSize: 11,
    fontWeight: '600',
  },
})
