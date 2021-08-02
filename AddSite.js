import React, { useEffect, useState } from 'react'
import { View, Text, TextInput, Button, Alert, FlatList, Pressable } from 'react-native'
import { db } from "./FirebaseManager"
import AsyncStorage from '@react-native-async-storage/async-storage'

const AddNewSite = () => {
    const [getSiteName, setSiteName] = useState("")
    const [getLat, setLat] = useState("")
    const [getLong, setLong] = useState("")
    const [getDesc, setDesc] = useState("")
    const [getUId, setUId] = useState("")
    const [getUserLocations, setUserLocations] = useState([])

    useEffect(
        () => {
            AsyncStorage.getItem("uid")
                .then(
                    (dataFromStorage) => {
                        if (dataFromStorage === null) {
                            console.log("Could not find data for key = uid")
                        }
                        else {
                            //console.log(dataFromStorage)
                            setUId(dataFromStorage)
                            return db.collection("users").doc(dataFromStorage).collection("added_locations").get().then({})
                        }

                    }
                )
                .then(
                    (qSnapshot) => {
                        let temp = []
                        qSnapshot.forEach((doc) => {
                            temp.push(doc.data())
                        })
                        setUserLocations(temp)
                    }
                )
                .catch((error) => { console.log(`Error occured: ${error}`) })
        }, []
    )

    const addPressed = () => {
        let newSite = {
            title: getSiteName,
            user: getUId,
            Latitude: parseFloat(getLat),
            Longitude: parseFloat(getLong),
            Desc: getDesc
        }

        db.collection("geocachingSites").add(newSite)
            .then(
                (doc) => {
                    console.log("Document created with id:" + doc.id)
                    Alert.alert(
                        "New Site",
                        "Successfully Added!",
                        [
                            {
                                text: "OK"
                            }
                        ]
                    )
                }
            )
            .catch(
                (error) => { console.log(error) }
            )

        db.collection("users").doc(getUId).collection("added_locations").add(newSite)
            .then(
                console.log("Document added to user list")
            )
            .catch(
                (error) => { console.log(error) }
            )
    }

    return (
        <View>
            <Text>Enter Title, Latitude, Longitude and Description to add a new site:</Text>
            <TextInput placeholder="Enter Title" value={getSiteName} onChangeText={(data) => { setSiteName(data) }} />
            <TextInput placeholder="Enter Latitude" value={getLat} onChangeText={(data) => { setLat(data) }} />
            <TextInput placeholder="Enter Longitude" value={getLong} onChangeText={(data) => { setLong(data) }} />
            <TextInput placeholder="Enter Description" value={getDesc} onChangeText={(data) => { setDesc(data) }} />
            <Button title="Add" onPress={addPressed} />
            {
                getUserLocations.length <= 0 ? (<Text>No Geocaching Sites Added</Text>) : (
                    <FlatList data={getUserLocations}
                        keyExtractor={(item, index) => { return item["title"] }}
                        renderItem={({ item, index }) => (
                            <Pressable onPress={() => { console.log("item pressed") }} onLongPress={() => { console.log(item.title + " is selected") }}>
                                <View>
                                    <Text>{item.title}</Text>
                                </View>
                            </Pressable>

                        )}
                    />
                )
            }
        </View>
    )
}

export default AddNewSite