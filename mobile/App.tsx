import { StatusBar } from 'expo-status-bar'
import { NavigationContainer } from '@react-navigation/native'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Navigation } from './src/navigation'
import { NotificationProvider } from './src/providers/NotificationProvider'
import { useEffect } from 'react'
import { registerForPushNotificationsAsync } from './src/utils/notifications'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 60 * 1000, // 1 minute
    },
  },
})

export default function App() {
  useEffect(() => {
    // Register for push notifications
    registerForPushNotificationsAsync()
  }, [])

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <NotificationProvider>
          <NavigationContainer>
            <Navigation />
            <StatusBar style="auto" />
          </NavigationContainer>
        </NotificationProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  )
}
