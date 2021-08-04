import React, { useEffect, useState } from 'react'
import { View, Text, ActivityIndicator, Pressable, FlatList } from 'react-native'
import { db } from './FirebaseManager'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useIsFocused } from '@react-navigation/native'

const FavouritesScreen = ({ navigation, route }, props) => {
    const [getData, setData] = useState([])
    const [isLoading, setLoading] = useState(true)
    const [getDocIds, setDocIds] = useState([])
    const [getuid, setuid] = useState("")
    const isFocused = useIsFocused()

    useEffect(
        () => {
            getDataFromFirestore()

        }, []
    )

    useEffect(() => {
            if (isFocused) {
                getDataFromFirestore()
            }
        }, [props, isFocused]
    )



    const getDataFromFirestore = () => {
        AsyncStorage.getItem("uid")
            .then(
                (dataFromStorage) => {
                    if (dataFromStorage === null) {
                        console.log("Could not find data for key = uid")
                    }
                    else {
                        setuid(dataFromStorage)
                        return db.collection("users").doc(dataFromStorage).collection("favourites").get().then({})
                    }
                }
            )
            .then(
                (querySnapshot) => {
                    let temp = []
                    let idtemps = []
                    querySnapshot.forEach((doc) => {
                        temp.push(doc.data())
                        idtemps.push(doc.id)
                    })
                    setData(temp)
                    setDocIds(idtemps)
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
    }

    const itemPressed = (index) => {
        navigation.navigate("FavouriteDetail", { data: getData[index], id: getDocIds[index], isFav: true })
    }

    return (
        <View>
            {isLoading ? (<ActivityIndicator animating={true} size="large" />) : (
                <FlatList data={getData} extraData={getData}
                    keyExtractor={(item, index) => { return item["title"] }}
                    renderItem={({ item, index }) => (
                        <Pressable onPress={() => { itemPressed(index) }} onLongPress={() => { console.log(item.title + " is selected") }}>
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