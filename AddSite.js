import React, { useEffect, useState } from 'react'
import { View, Text, TextInput, Button, Alert, FlatList, Pressable } from 'react-native'
import { db } from "./FirebaseManager"
import AsyncStorage from '@react-native-async-storage/async-storage'

const AddNewSite = ({ navigation, route }) => {
    const [getSiteName, setSiteName] = useState("")
    const [getLat, setLat] = useState("")
    const [getLong, setLong] = useState("")
    const [getDesc, setDesc] = useState("")
    const [getUId, setUId] = useState("")
    const [getDocIds, setDocIds] = useState([])
    const [getUserLocations, setUserLocations] = useState([])

    useEffect(
        () => {
            getDataFromFirestore()
        }, []
    )

    const getDataFromFirestore = () => {
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
                    let idtemps = []
                    qSnapshot.forEach((doc) => {
                        temp.push(doc.data())
                        idtemps.push(doc.id)
                    })
                    setUserLocations(temp)
                    setDocIds(idtemps)
                }
            )
            .catch((error) => { console.log(`Error occured: ${error}`) })
    }

    const addPressed = () => {
        let isValid = true

        if (getSiteName === "") {
            isValid = false
        }

        if (getLat === "") {
            isValid = false
        }
        if (getLong === "") {
            isValid = false
        }
        if (getDesc === "") {
            isValid = false
        }

        if (!isValid) {
            Alert.alert(
                "Add New Location",
                "Please fill in all inputs.",
                [
                    {
                        text: "OK"
                    }
                ]
            )
            return
        }

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
                    newSite["site_id"] = doc.id
                    return db.collection("users").doc(getUId).collection("added_locations").add(newSite).then()
                }
            )
            .then(
                () => {
                    getDataFromFirestore()
                    console.log("Document added to user list")
                }


            )
            .catch(
                (error) => { console.log(error) }
            )


    }

    const itemPressed = (index) => {
        navigation.navigate("Details", { data: getUserLocations[index], id: getDocIds[index], isFav: true, isAddSite: true })
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
                    <FlatList data={getUserLocations} extraData={getUserLocations}
                        keyExtractor={(item, index) => { return item["title"] }}
                        renderItem={({ item, index }) => (
                            <Pressable onPress={() => { itemPressed(index) }} onLongPress={() => { console.log(item.title + " is selected") }}>
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