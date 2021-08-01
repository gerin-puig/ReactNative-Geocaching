import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import HomeScreen from './Home';
import LoginScreen from './LoginScreen';
import Signup from './SignUpScreen';
import list from './list';
import SiteDetail from './SiteDetail'

const Stack = createStackNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen}/>
        <Stack.Screen name="Signup" component={Signup}/>
        <Stack.Screen name="Home" component={HomeScreen} 
          options={
            ({ navigation }) => ({
              headerRight: () => (
                <Button title="SignOut" color="#F00" onPress={() => navigation.replace("Login")} />
              )
            })
          }   
        />
        <Stack.Screen name="List" component={list}/>
        <Stack.Screen name="SiteDetail" component={SiteDetail}
        options={
          ({ navigation }) => ({
            headerRight: () => (
              <Button title="Back" color="#F00" onPress={() => navigation.replace("List")} />
            )
          })
        }   
      />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
