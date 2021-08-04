import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Ionicons from 'react-native-vector-icons/Ionicons'
import list from './list'
import UserRecordsNavigation from './UserRecordsNav'
import FavouritesNav from './FavouritesNav'
import AddSiteNav from './AddSiteNav'

const Tab = createBottomTabNavigator()

const HomeScreen = ({navigation, route}) => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName
                    if (route.name === "List") {
                        iconName = focused ? "md-list-circle-sharp" : "md-list-circle-outline"
                    }
                    else if (route.name === "Favourites") {
                        iconName = focused ? "md-heart" : "md-heart-outline"
                    }
                    else if (route.name === "Add") {
                        iconName = focused ? "add-circle" : "add-circle-outline"
                    }
                    else if (route.name === "Records") {
                        iconName = focused ? "clipboard" : "clipboard-outline"
                    }
                    return <Ionicons name={iconName} size={size} color={color} />
                }
            })}
            tabBarOptions={{ activeTintColor: "green", inactiveTintColor: "gray" }}>
            
            <Tab.Screen name="List" component={list} />
            <Tab.Screen name="Add" component={AddSiteNav} />
            <Tab.Screen name="Records" component={UserRecordsNavigation} />
            <Tab.Screen name="Favourites" component={FavouritesNav} />
        </Tab.Navigator>
    )
}

export default HomeScreen