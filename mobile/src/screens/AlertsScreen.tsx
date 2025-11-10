import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native'
import { useQuery } from '@tanstack/react-query'
import { Ionicons } from '@expo/vector-icons'
import { api } from '../services/api'

export function AlertsScreen() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['alerts'],
    queryFn: () => api.getAlerts(),
  })

  const renderAlert = ({ item }: any) => (
    <TouchableOpacity style={styles.alertCard}>
      <View style={styles.alertHeader}>
        <View
          style={[
            styles.alertIcon,
            { backgroundColor: getSeverityColor(item.severity) + '20' },
          ]}
        >
          <Ionicons
            name="alert-circle"
            size={20}
            color={getSeverityColor(item.severity)}
          />
        </View>
        <View style={styles.alertInfo}>
          <Text style={styles.alertTitle}>{item.title}</Text>
          <Text style={styles.alertDescription} numberOfLines={2}>
            {item.description}
          </Text>
          <View style={styles.alertMeta}>
            <Text style={styles.alertTime}>
              {new Date(item.timestamp).toLocaleString()}
            </Text>
            <Text style={styles.alertLocation}>{item.crossingId}</Text>
          </View>
        </View>
        <View
          style={[
            styles.severityBadge,
            { backgroundColor: getSeverityColor(item.severity) },
          ]}
        >
          <Text style={styles.severityText}>{item.severity}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <FlatList
        data={data?.data?.alerts || []}
        renderItem={renderAlert}
        keyExtractor={(item) => item.alertId}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="checkmark-circle" size={64} color="#10b981" />
            <Text style={styles.emptyText}>No Active Alerts</Text>
            <Text style={styles.emptySubtext}>All systems operating normally</Text>
          </View>
        }
      />
    </View>
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
  list: {
    padding: 16,
  },
  alertCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  alertHeader: {
    flexDirection: 'row',
    gap: 12,
  },
  alertIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertInfo: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  alertDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  alertMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  alertTime: {
    fontSize: 12,
    color: '#9ca3af',
  },
  alertLocation: {
    fontSize: 12,
    color: '#2563eb',
  },
  severityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    height: 28,
    justifyContent: 'center',
  },
  severityText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
    textTransform: 'uppercase',
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 48,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
})
