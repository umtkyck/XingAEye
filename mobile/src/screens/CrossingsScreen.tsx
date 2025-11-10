import React from 'react'
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import { useQuery } from '@tanstack/react-query'
import { Ionicons } from '@expo/vector-icons'
import { api } from '../services/api'

export function CrossingsScreen() {
  const { data } = useQuery({
    queryKey: ['crossings'],
    queryFn: () => api.getCrossings(),
  })

  const renderCrossing = ({ item }: any) => (
    <TouchableOpacity style={styles.crossingCard}>
      <View style={styles.crossingHeader}>
        <View
          style={[
            styles.statusDot,
            { backgroundColor: item.status === 'active' ? '#10b981' : '#eab308' },
          ]}
        />
        <Text style={styles.crossingName}>{item.name}</Text>
      </View>
      <Text style={styles.crossingAddress}>{item.location?.address}</Text>
      <View style={styles.crossingFooter}>
        <View style={styles.crossingInfo}>
          <Ionicons name="hardware-chip" size={16} color="#6b7280" />
          <Text style={styles.infoText}>2 devices</Text>
        </View>
        <View style={styles.crossingInfo}>
          <Ionicons name="alert-circle" size={16} color="#6b7280" />
          <Text style={styles.infoText}>0 alerts</Text>
        </View>
      </View>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <FlatList
        data={data?.data || []}
        renderItem={renderCrossing}
        keyExtractor={(item) => item.crossingId}
        contentContainerStyle={styles.list}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  list: {
    padding: 16,
  },
  crossingCard: {
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
  crossingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  crossingName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  crossingAddress: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  crossingFooter: {
    flexDirection: 'row',
    gap: 16,
  },
  crossingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: 12,
    color: '#6b7280',
  },
})
