import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LayoutDashboard, Package, TrendingUp } from 'lucide-react-native';
import { colors } from './src/theme/colors';

// Screens
import Dashboard from './src/screens/Dashboard';
import InventoryList from './src/screens/InventoryList';
import ProductDetail from './src/screens/ProductDetail';
import AddItem from './src/screens/AddItem';
import SalesTracker from './src/screens/SalesTracker';
import Login from './src/screens/Login';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function InventoryStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="InventoryList" component={InventoryList} />
      <Stack.Screen name="ProductDetail" component={ProductDetail} />
      <Stack.Screen name="AddItem" component={AddItem} />
    </Stack.Navigator>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    // Check for persisted auth state
    const checkAuth = async () => {
      try {
        if (typeof localStorage !== 'undefined') {
          const authValue = localStorage.getItem('mira_store_auth');
          if (authValue === 'true') {
            setIsAuthenticated(true);
          }
        }
      } catch (e) {
        console.error('Failed to load auth state', e);
      } finally {
        setIsReady(true);
      }
    };
    checkAuth();
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('mira_store_auth', 'true');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('mira_store_auth');
    }
  };

  if (!isReady) {
    return null; // Or a loading spinner
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            if (route.name === 'Dashboard') {
              return <LayoutDashboard size={size} color={color} />;
            } else if (route.name === 'Inventory') {
              return <Package size={size} color={color} />;
            } else if (route.name === 'Sales') {
              return <TrendingUp size={size} color={color} />;
            }
          },
          tabBarActiveTintColor: colors.primaryContainer,
          tabBarInactiveTintColor: colors.slate500,
          tabBarStyle: {
            backgroundColor: colors.white,
            borderTopColor: colors.slate200,
            paddingBottom: 5,
            height: 60,
          },
          headerShown: false,
        })}
      >
        <Tab.Screen name="Dashboard">
          {(props) => <Dashboard {...props} onLogout={handleLogout} />}
        </Tab.Screen>
        <Tab.Screen name="Sales" component={SalesTracker} />
        <Tab.Screen name="Inventory" component={InventoryStack} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
