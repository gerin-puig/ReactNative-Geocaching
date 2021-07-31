import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, FlatList, Pressable, Image, Button } from 'react-native'
import { set } from 'react-native-reanimated'
import { db } from './FirebaseManager'
import AsyncStorage from '@react-native-async-storage/async-storage'

const SiteDetailsScreen = ({ navigation, route }) => {

    const { data } = route.params
    const { id } = route.params
    const [getRecord, setRecord] = useState({})
    const [getSiteData, setSiteData] = useState({})
    const [getUId, setUId] = useState("")

    useEffect(
        () => {
            //console.log(data)
            setRecord(data)
            //console.log(id)

                gettingSiteData()

                AsyncStorage.getItem("uid")
                .then(
                    (dataFromStorage) => {
                        if (dataFromStorage === null) {
                            console.log("Could not find data for key = uid")
                        }
                        else {
                            setUId(dataFromStorage)
                        }
                    }
                )
        }, []
    )

    const gettingSiteData = () => {
        db.collection("locations").doc(data["site_id"]).get()
        .then(
            (docSnapshot) => {
                if (docSnapshot.exists) {
                    //console.log(docSnapshot.data())
                    setSiteData(docSnapshot.data())
                }
            }
        )
    }

    const completePressed = () => {
        console.log(getUId)
        db.collection("users").doc(getUId).collection("records").doc(id).update({
            completed: true
        })

        let temp = getRecord
        temp["completed"] = true

        setRecord(temp)

        gettingSiteData()
        
    }

    return (
        <View>
            <Text>{getRecord["title"]}</Text>
            <Text>Latitude: {getSiteData["Latitude"]}</Text>
            <Text>Longitude: {getSiteData["Longitude"]}</Text>
            <Text>Note: {getRecord["note"]}</Text>
            {
                getRecord["completed"] === true ? (<Text>Completed: {String(getRecord["completed"])}</Text>) : (
                    <View>
                        <Text>Progress: In Progress</Text>
                        <Button title="Complete" onPress={completePressed} />
                    </View>
                )
            }
        </View>
    )
}

export default SiteDetailsScreen