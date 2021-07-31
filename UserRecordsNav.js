import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import SiteDetailsScreen from './SiteDetailsScreen'
import UserRecords from './UserRecords'

const Stack = createStackNavigator()

const UserRecordsNavigation = () => {
    return (
        <NavigationContainer independent={true}>
            <Stack.Navigator>
                <Stack.Screen name="UserRecords" component={UserRecords}/>
                <Stack.Screen name="Details" component={SiteDetailsScreen}/>
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default UserRecordsNavigation