import React, { useState } from 'react'
import { View, Text, TextInput, Button, Alert } from 'react-native'
import { db } from "./FirebaseManager"

const AddNewSite = () => {
    const [getSiteName, setSiteName] = useState("")
    const [getLat, setLat] = useState("")
    const [getLong, setLong] = useState("")

    const addPressed = () => {
        let newSite = {
            title: getSiteName,
            user: "user@mail.com",
            Latitude: getLat,
            Longitude: getLong
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
            <Text>Enter Title, Latitude, and Longitude to add a new site:</Text>
            <TextInput placeholder="Enter Title" value={getSiteName} onChangeText={(data) => { setSiteName(data) }} />
            <TextInput placeholder="Enter Latitude" value={getLat} onChangeText={(data) => { setLat(data) }} />
            <TextInput placeholder="Enter Longitude" value={getLong} onChangeText={(data) => { setLong(data) }} />
            <Button title="Add" onPress={addPressed} />
        </View>
    )
}

export default AddNewSite