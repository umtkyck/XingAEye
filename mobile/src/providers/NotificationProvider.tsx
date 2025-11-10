import React, { useEffect, useRef } from 'react'
import * as Notifications from 'expo-notifications'
import { useNavigation } from '@react-navigation/native'

interface NotificationProviderProps {
  children: React.ReactNode
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const notificationListener = useRef<any>()
  const responseListener = useRef<any>()
  const navigation = useNavigation()

  useEffect(() => {
    // Handle notifications that arrive while app is foregrounded
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log('Notification received:', notification)
      })

    // Handle user interaction with notifications
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log('Notification response:', response)

        // Navigate based on notification data
        const data = response.notification.request.content.data
        if (data?.alertId) {
          // Navigate to alert details
          // navigation.navigate('AlertDetails', { alertId: data.alertId })
        } else if (data?.crossingId) {
          // Navigate to crossing details
          // navigation.navigate('CrossingDetails', { crossingId: data.crossingId })
        }
      })

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current)
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current)
      }
    }
  }, [navigation])

  return <>{children}</>
}
