import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import FavouritesScreen from './Favourites'
import FavouritesDetailScreen from './FavouritesDetailScreen'
import SiteDetailsScreen from './SiteDetailsScreen'

const Stack = createStackNavigator()

const FavouritesNav = () => {
    return(
        <NavigationContainer independent={true}>
            <Stack.Navigator>
                <Stack.Screen name="Favourites" component={FavouritesScreen} />
                <Stack.Screen name="FavouriteDetail" component={SiteDetailsScreen} options={{title:"Details"}}/>
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default FavouritesNav