import React from 'react'
import { View, Text } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Ionicons from 'react-native-vector-icons/Ionicons'
import FavouritesScreen from './Favourites'
import SitesList from './SitesList'

const Tab = createBottomTabNavigator()

const HomeScreen = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: (focused, color, size) => {
                    let iconName
                    if (route.name === "List") {
                        iconName = focused ? "md-list-circle-sharp" : "md-list-circle-outline"
                    }
                    else if (route.name === "Favourites") {
                        iconName = focused ? "md-heart" : "md-heart-outline"
                    }
                    return <Ionicons name={iconName} size={size} color={color} />
                }
            })}
            tabBarOptions={{ activeTintColor: "green", inactiveTintColor: "gray" }}>
            <Tab.Screen name="List" component={SitesList} />
            <Tab.Screen name="Favourites" component={FavouritesScreen} />
        </Tab.Navigator>
    )
}

export default HomeScreen