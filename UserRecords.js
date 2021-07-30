import React, { useEffect, useState } from "react"
import { View, Pressable, Button, SafeAreaView, Text, StyleSheet, Alert, FlatList, ActivityIndicator } from "react-native"
import { db } from "./FirebaseManager"
import AsyncStorage from '@react-native-async-storage/async-storage'

const UserRecords = () => {
    const [getData, setData] = useState([])
    const [isLoading, setLoading] = useState(true)
    const [getUId, setUId] = useState("")

    useEffect(
        () => {
            AsyncStorage.getItem("uid")
                .then(
                    (dataFromStorage) => {
                        if (dataFromStorage === null) {
                            console.log("Could not find data for key = uid")
                        }
                        else {
                            setUId(dataFromStorage)
                            return db.collection("users").doc(dataFromStorage).collection("records").get().then({})
                        }
                    }
                )
                .then(
                    (querySnapshot) => {
                        let temp = []
                        querySnapshot.forEach((doc) => {
                            console.log(doc.data())
                            temp.push(doc.data())
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

    return (
        <View>
            {isLoading ? (<ActivityIndicator animating={true} size="large" />) : (
                <FlatList data={getData}
                    keyExtractor={(item, index) => { return item["site_id"] }}
                    renderItem={({ item }) => (
                        <Pressable onPress={()=>{}} onLongPress={() => { console.log(item.title + " is selected") }}>
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