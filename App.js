import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Button, Pressable } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import HomeScreen from './Home';
import LoginScreen from './LoginScreen';
import Signup from './SignUpScreen';
import list from './list';
import SiteDetail from './SiteDetail'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from './Style';

const Stack = createStackNavigator()

export default function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="Home" component={HomeScreen}
          options={
            ({ navigation }) => ({
              headerRight: () => (
                <Pressable style={({ pressed }) => [{ backgroundColor: pressed ? 'rgb(210,230,255)' : 'red' }, styles.buttons, { width: 100 }]} onPress={() => {
                  navigation.replace("Login")
                  AsyncStorage.removeItem("uid")
                }}>
                  <Text style={{ fontSize: 16, color: 'white', padding: 3 }}>SIGN OUT</Text>
                </Pressable>
              )
            })
          }
        />
        <Stack.Screen name="List" component={list} />
        <Stack.Screen name="SiteDetail" component={SiteDetail}
          options={({ navigation }) => ({ headerRight: () => (<Button title="Back" color="#F00" onPress={() => navigation.replace("Home")} />) })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
