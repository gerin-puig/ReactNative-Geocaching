import React, { useEffect, useState } from 'react'
import { View, Text, ActivityIndicator, Pressable, FlatList } from 'react-native'
import { db } from './FirebaseManager'
import AsyncStorage from '@react-native-async-storage/async-storage'

const FavouritesScreen = () => {
    const [getData, setData] = useState([])
    const [isLoading, setLoading] = useState(true)


    useEffect(
        () => {
            AsyncStorage.getItem("uid")
                .then(
                    (dataFromStorage) => {
                        if (dataFromStorage === null) {
                            console.log("Could not find data for key = uid")
                        }
                        else {
                            return db.collection("users").doc(dataFromStorage).collection("favourites").get().then({})
                        }
                    }
                )
                .then(
                    (querySnapshot) => {
                        let temp = []
                        querySnapshot.forEach((doc) => {
                            temp.push(doc.data())
                            //console.log(doc.data())
                        })
                        setData(temp)
                    }
                )
                .finally(
                    () => {
                        setLoading(false)
                    }
                )
                .catch(
                    (e) => { console.log(e) }
                )
        }, []
    )

    const itemPressed = (index) => {
        
    }

    return (
        <View>
            {isLoading ? (<ActivityIndicator animating={true} size="large" />) : (
                <FlatList data={getData}
                    keyExtractor={(item, index) => { return item["title"] }}
                    renderItem={({ item, index }) => (
                        <Pressable onPress={()=>{itemPressed(index)}} onLongPress={() => { console.log(item.title + " is selected") }}>
                            <View>
                                <Text>{item.title}</Text>
                            </View>
                        </Pressable>

                    )}
                />
            )}
        </View>
    )
}

export default FavouritesScreen