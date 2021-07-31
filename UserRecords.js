import React, { useEffect, useState } from "react"
import { View, Pressable, Button, SafeAreaView, Text, StyleSheet, Alert, FlatList, ActivityIndicator } from "react-native"
import { db } from "./FirebaseManager"
import AsyncStorage from '@react-native-async-storage/async-storage'

const UserRecords = ({navigation, route}) => {
    const [getData, setData] = useState([])
    const [isLoading, setLoading] = useState(true)
    const [getDocIds, setDocIds] = useState([])

    useEffect(
        () => {
            AsyncStorage.getItem("uid")
                .then(
                    (dataFromStorage) => {
                        if (dataFromStorage === null) {
                            console.log("Could not find data for key = uid")
                        }
                        else {
                            return db.collection("users").doc(dataFromStorage).collection("records").get().then({})
                        }
                    }
                )
                .then(
                    (querySnapshot) => {
                        let temp = []
                        let idtemps = []
                        querySnapshot.forEach((doc) => {
                            //console.log(doc.data())
                            //console.log(doc.id)
                            idtemps.push(doc.id)
                            temp.push(doc.data())
                        })
                        setDocIds(idtemps)
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
        //console.log(getData[index])
        //console.log(getDocIds)
        navigation.navigate("Details", { data: getData[index], id: getDocIds[index]})
    }

    return (
        <View>
            {isLoading ? (<ActivityIndicator animating={true} size="large" />) : (
                <FlatList data={getData}
                    keyExtractor={(item, index) => { return item["site_id"] }}
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

export default UserRecords