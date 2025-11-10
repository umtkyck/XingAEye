import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons'
import { HomeScreen } from '../screens/HomeScreen'
import { AlertsScreen } from '../screens/AlertsScreen'
import { CrossingsScreen } from '../screens/CrossingsScreen'
import { ProfileScreen } from '../screens/ProfileScreen'

const Tab = createBottomTabNavigator()

export function Navigation() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home'

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline'
          } else if (route.name === 'Alerts') {
            iconName = focused ? 'alert-circle' : 'alert-circle-outline'
          } else if (route.name === 'Crossings') {
            iconName = focused ? 'map' : 'map-outline'
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline'
          }

          return <Ionicons name={iconName} size={size} color={color} />
        },
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: 'gray',
        headerStyle: {
          backgroundColor: '#2563eb',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: '🚂 XingAEye' }}
      />
      <Tab.Screen
        name="Alerts"
        component={AlertsScreen}
        options={{ title: 'Alerts' }}
      />
      <Tab.Screen
        name="Crossings"
        component={CrossingsScreen}
        options={{ title: 'Crossings' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  )
}
