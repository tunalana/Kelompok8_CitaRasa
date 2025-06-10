// App.js
import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator }    from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons }                 from '@expo/vector-icons';

import { AuthProvider } from './AuthContext';

// --- Auth screens ---
import SplashScreen      from './LoginScreen/splash';
import GetStartedScreen  from './LoginScreen/getStarted';
import LoginScreen       from './LoginScreen/Login';
import RegisterScreen    from './LoginScreen/Register';
import ForgotPassword    from './LoginScreen/ForgotPW';
import ResetPassword     from './LoginScreen/ResetPW';

// --- Main tabs & details ---
import Home               from './MainScreen/Home';
import Search             from './MainScreen/Search';
import AllRecipe          from './MainScreen/AllRecipe';
import Categories         from './MainScreen/Kategori';
import Bookmark           from './MainScreen/Bookmark';
import DetailMenu         from './MainScreen/DetailMenu';
import NotificationScreen from './MainScreen/Notifikasi';

// --- Profile screens ---
import CreateRecipe       from './ProfileScreen/CreateRecipe';
import Profile            from './ProfileScreen/Profile';
import EditProfile        from './ProfileScreen/EditProfile';
import EditRecipe         from './ProfileScreen/EditRecipe';

// --- Info screens ---
import FAQ                from './InfoScreen/FAQ';
import Setting            from './InfoScreen/Setting';


// --- Bottom Tab Navigator ---
const Tab = createBottomTabNavigator();
function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown:           false,
        tabBarActiveTintColor:   '#FF6F3C',
        tabBarInactiveTintColor: '#7F4F24',
        tabBarStyle:            { backgroundColor: '#FFF8F0' },
        tabBarIcon: ({ color, size }) => {
          switch (route.name) {
            case 'Home':
              return <Ionicons name="home-outline"   size={size} color={color} />;
            case 'Search':
              return <Ionicons name="search-outline" size={size} color={color} />;
            case 'CreateRecipe':
              return <Ionicons name="add-circle"     size={size+8} color={color} />;
            case 'Bookmark':
              return <Ionicons name="bookmark-outline" size={size} color={color} />;
            case 'Setting':
              return <Ionicons name="settings-outline" size={size} color={color} />;
            default:
              return null;
          }
        },
        tabBarLabel: route.name === 'CreateRecipe' ? '' : route.name,
      })}
    >
      <Tab.Screen name="Home"         component={Home} />
      <Tab.Screen name="Search"       component={Search} />
      <Tab.Screen
        name="CreateRecipe"
        component={CreateRecipe}
        options={{
          tabBarLabel:     '',
          title:           'Tambah Resep',
          tabBarIconStyle: { marginTop: -8 },
        }}
      />
      <Tab.Screen name="Bookmark"     component={Bookmark} />
      <Tab.Screen name="Setting"      component={Setting} />
    </Tab.Navigator>
  );
}


// --- Stack Navigator (Auth flow + Main + Details) ---
const Stack = createStackNavigator();
function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{ headerShown: false }}
      >
        {/* Auth flow */}
        <Stack.Screen name="Splash"         component={SplashScreen} />
        <Stack.Screen name="GetStarted"     component={GetStartedScreen} />
        <Stack.Screen name="Login"          component={LoginScreen} />
        <Stack.Screen name="Register"       component={RegisterScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="ResetPassword"  component={ResetPassword} />

        {/* Main app via Bottom Tabs */}
        <Stack.Screen name="Main"           component={MainTabNavigator} />

        {/* Extra / detail screens */}
        <Stack.Screen name="AllRecipe"      component={AllRecipe} />
        <Stack.Screen name="Categories"     component={Categories} />
        <Stack.Screen name="DetailMenu"     component={DetailMenu} />
        <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
        <Stack.Screen name="Profile"        component={Profile} />
        <Stack.Screen name="EditProfile"    component={EditProfile} />
        <Stack.Screen name="EditRecipe"     component={EditRecipe} />
        <Stack.Screen name="FAQ"            component={FAQ} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


// --- Root App ---
export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}