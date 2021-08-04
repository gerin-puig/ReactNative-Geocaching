import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import SiteDetailsScreen from './SiteDetailsScreen'
import AddNewSite from './AddSite'

const Stack = createStackNavigator()

const AddSiteNav = () => {
    return(
        <NavigationContainer independent={true}>
            <Stack.Navigator>
                <Stack.Screen name="Add" component={AddNewSite} />
                <Stack.Screen name="Details" component={SiteDetailsScreen}/>
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default AddSiteNav