import React, { useEffect, useState } from 'react'
import { View, Text, TextInput, Button, Alert } from 'react-native'
import { db } from "./FirebaseManager"
import AsyncStorage from '@react-native-async-storage/async-storage'

const AddNewSite = () => {
    const [getSiteName, setSiteName] = useState("")
    const [getLat, setLat] = useState("")
    const [getLong, setLong] = useState("")
    const [getDesc, setDesc] = useState("")
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
                            //console.log(dataFromStorage)

                        }
                        setUId(dataFromStorage)
                    }
                )
                .catch((error) => { console.log(`Error occured: ${error}`) })
        }, []
    )

    const addPressed = () => {
        let newSite = {
            title: getSiteName,
            user: getUId,
            Latitude: getLat,
            Longitude: getLong,
            Desc: getDesc
        }

        db.collection("locations").add(newSite)
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
    }

    return (
        <View>
            <Text>Enter Title, Latitude, Longitude and Description to add a new site:</Text>
            <TextInput placeholder="Enter Title" value={getSiteName} onChangeText={(data) => { setSiteName(data) }} />
            <TextInput placeholder="Enter Latitude" value={getLat} onChangeText={(data) => { setLat(data) }} />
            <TextInput placeholder="Enter Longitude" value={getLong} onChangeText={(data) => { setLong(data) }} />
            <TextInput placeholder="Enter Description" value={getDesc} onChangeText={(data) => { setDesc(data) }} />
            <Button title="Add" onPress={addPressed} />
        </View>
    )
}

export default AddNewSite