import React, { useEffect, useState, useRef } from 'react'
import { StyleSheet, Text, View, FlatList, Pressable, Image, Button, Dimensions, TextInput } from 'react-native'
import { db } from './FirebaseManager'
import AsyncStorage from '@react-native-async-storage/async-storage'
import MapView, { Marker } from 'react-native-maps'
import { styles } from './Style'

const SiteDetailsScreen = ({ navigation, route }) => {

    const { data } = route.params
    const { id } = route.params
    const { isFav } = route.params
    const { isAddSite } = route.params
    const [getNote, setNote] = useState("")
    const [getRecord, setRecord] = useState({})
    const [getSiteData, setSiteData] = useState({})
    const [getUId, setUId] = useState("")
    const mapRef = useRef(null)
    const [curRegion, setCurRegion] = useState({
        latitude: 43, longitude: -79, latitudeDelta: 0.5, longitudeDelta: 0.5
    })

    useEffect(
        () => {
            //console.log(data)
            setRecord(data)
            //console.log(id)
            setNote(data["note"])

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
        db.collection("geocachingSites").doc(data["site_id"]).get()
            .then(
                (docSnapshot) => {
                    if (docSnapshot.exists) {
                        //console.log(docSnapshot.data())
                        setSiteData(docSnapshot.data())

                        const coordinates = {
                            latitude: parseFloat(docSnapshot.data()["Latitude"]),
                            longitude: parseFloat(docSnapshot.data()["Longitude"]),
                            latitudeDelta: 0.005,
                            longitudeDelta: 0.005
                        }

                        setCurRegion(coordinates)
                    }
                }
            )
            .catch((e) => { console.log(e) })
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

    const removedFromFavPressed = () => {
        db.collection("users").doc(getUId).collection("favourites").doc(id).delete().then(
            () => {
                navigation.goBack()
            }
        )
    }

    const saveEditNote = () => {
        db.collection("users").doc(getUId).collection("records").doc(id).update({
            note: getNote
        })
    }

    return (

        <View style={styles.container}>
            <Text style={styles.header}>{getSiteData["title"]}</Text>
            <Text style={styles.info}>Latitude: {getSiteData["Latitude"]}</Text>
            <Text style={styles.info}>Longitude: {getSiteData["Longitude"]}</Text>
            {
                isFav === true ? (<Text></Text>) : (
                    <View style={styles.container}>
                        <TextInput style={styles.input} maxLength={100} multiline={true} numberOfLines={3} placeholder="Note"
                            value={getNote} onChangeText={(data) => { setNote(data) }} />
                        <Pressable style={({ pressed }) => [{ backgroundColor: pressed ? 'rgb(210,230,255)' : 'green' }, styles.buttons, { width: 150 }]} onPress={saveEditNote}>
                            <Text style={styles.button_text}>SAVE EDIT</Text>
                        </Pressable>
                    </View>
                )
            }
            {
                isFav === true ? (<Text></Text>) : (
                    getRecord["completed"] === true ? (<Text style={styles.info}>Completed: {String(getRecord["completed"])}</Text>) : (
                        <View style={styles.container}>
                            <Text style={styles.info}>Progress: In Progress</Text>
                            <Pressable style={({ pressed }) => [{ backgroundColor: pressed ? 'rgb(210,230,255)' : 'green' }, styles.buttons, { width: 150 }]} onPress={completePressed}>
                                <Text style={styles.button_text}>COMPLETE</Text>
                            </Pressable>
                        </View>
                    )
                )
            }

            <MapView ref={mapRef} style={{ width: Dimensions.get("window").width, height: 300, marginTop: 10 }} initialRegion={curRegion} region={curRegion} >
                <Marker coordinate={{ latitude: curRegion.latitude, longitude: curRegion.longitude }} title={getRecord.title} description="Here somewhere"></Marker>
            </MapView>
            {
                isAddSite === true ? (<Text></Text>) :
                    isFav === true ? (
                        <View>
                            <Pressable style={({ pressed }) => [{ backgroundColor: pressed ? 'rgb(210,230,255)' : 'red' }, styles.buttons, { width: 250 }]} onPress={removedFromFavPressed}>
                                <Text style={{fontSize: 16, color:'white', padding: 3}}>REMOVE FROM FAVOURITES</Text>
                            </Pressable>
                        </View>) : (<Text></Text>)
            }
        </View>
    )
}

export default SiteDetailsScreen