// AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [registeredUser, setRegisteredUserState] = useState(null);
  const [user, setUserState]               = useState(null);
  const [vibrate, setVibrateState]         = useState(true);
  const [fastMode, setFastModeState]       = useState(false);

  // load stored prefs & registered user on app start
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('registeredUser');
        if (storedUser) {
          setRegisteredUserState(JSON.parse(storedUser));
        }

        const storedVibrate = await AsyncStorage.getItem('vibrate');
        if (storedVibrate !== null) {
          setVibrateState(storedVibrate === 'true');
        }

        const storedFastMode = await AsyncStorage.getItem('fastMode');
        if (storedFastMode !== null) {
          setFastModeState(storedFastMode === 'true');
        }
      } catch (e) {
        console.log('Failed to load data', e);
      }
    };

    loadUserData();
  }, []);

  // register a new user
  const setRegisteredUser = async (userData) => {
    try {
      await AsyncStorage.setItem('registeredUser', JSON.stringify(userData));
      setRegisteredUserState(userData);
    } catch (e) {
      console.log('Failed to save registered user', e);
    }
  };

  // log in (store in AsyncStorage + state)
  const setUser = async (userData) => {
    try {
      await AsyncStorage.setItem('loggedInUser', JSON.stringify(userData));
      setUserState(userData);
    } catch (e) {
      console.log('Failed to save login user', e);
    }
  };

  // log out (remove from AsyncStorage + clear state)
  const logout = async () => {
    try {
      await AsyncStorage.removeItem('loggedInUser');
      setUserState(null);
    } catch (e) {
      console.log('Failed to logout', e);
    }
  };

  // toggle vibrate preference
  const setVibrate = async (value) => {
    try {
      await AsyncStorage.setItem('vibrate', value.toString());
      setVibrateState(value);
    } catch (e) {
      console.log('Failed to save vibrate setting', e);
    }
  };

  // toggle fastMode preference
  const setFastMode = async (value) => {
    try {
      await AsyncStorage.setItem('fastMode', value.toString());
      setFastModeState(value);
    } catch (e) {
      console.log('Failed to save fast mode setting', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        registeredUser,
        setRegisteredUser,
        user,
        setUser,
        logout,
        vibrate,
        setVibrate,
        fastMode,
        setFastMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
