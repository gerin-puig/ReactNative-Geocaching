import React, { useEffect, useState, useRef } from 'react'
import { StyleSheet, View, SafeAreaView, Text, ActivityIndicator, Pressable, FlatList, Button, Switch } from 'react-native'
import { db } from './FirebaseManager'
import * as Location from "expo-location"
import Alert from "react-native-awesome-alerts";
import { Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';

const list = ({ navigation }) => {
    const [dis, setDis] = useState([])
    const [markers, setMarkers] = useState([])
    let marklist = []
    let coordinates =
    {
        lat: 43.651070,
        lng: -79.347015
    }
    let locFlag = false
    let userUID
    let saveFlag = false
    let recordFlag = false

    const [isLoading, setLoading] = useState(true)

    const [uid, setuid] = useState("")

    const [showAlert, setShowAlert] = useState(false)
    const [range, setRange] = useState(0)
    //***************** Async Storage Section Begins*************************************/
    //*********************************************************************************** 

    // ASYNC STORAGE FOR FAV SELECTED
    // Use keyword "favArray" to GET Asyn Storage in "favourites.js"

    //*********************************************************************************** 
    const getUserUID = () => {
        AsyncStorage.getItem("uid")
            .then(
                (dataFromStorage) => {
                    if (dataFromStorage === null) {
                        console.log("Could not find data for key = uid")
                    }
                    else {
                        console.log("We found user' email = uid")
                        console.log(dataFromStorage)
                        userUID = dataFromStorage
                    }
                }
            )
            .catch(
                (error) => {
                    console.log("Error when fetching primitive from key-value storage")
                    console.log(error)
                }
            )
    }

    // const getArray = () => {
    //     AsyncStorage.getItem("favArray")
    //       .then(
    //         (dataFromStorage) => {
    //           if (dataFromStorage === null) {
    //             console.log("Could not find data for key = favArray")   
    //             return null       
    //           }
    //           else {
    //             console.log("We found a value under key = favArray")
    //             console.log(dataFromStorage)
    //             const convertedData = JSON.parse(dataFromStorage)
    //             let favList = []
    //             favList.push(convertedData)
    //             console.log(favList)
    //             return favList
    //           }
    //         }
    //       )
    //       .catch(
    //         (error) => {
    //           console.log("Error when fetching primitive from key-value storage")
    //           console.log(error)
    //         }
    //       )
    //   }

    //   const saveArray = (store) => {
    //     let tempList = []
    //     let flag = false

    //     let check = null
    //     check = getArray()

    //     if(check == null)
    //     {
    //         console.log("Check is undefined")

    //     }
    //     else
    //     {
    //         for(let index = 0; index <check.length();index++)
    //         {
    //             if(check[index]==store)
    //             {
    //                 flag =true
    //                 console.log("Already existed")
    //             }

    //         }
    //     }

    //     if(!flag)
    //     {
    //         tempList.push({store})

    //       AsyncStorage.setItem("favArray",JSON.stringify(tempList))
    //       .then(
    //        () => {
    //          console.log("Saved in tempList.")
    //             console.log({tempList})
    //       }
    //       ).catch(
    //      (error) => {
    //        console.log(`Error occured when saving a primitive`)
    //        console.log(error)
    //      }
    //    )
    //     }
    //     flag =false
    //   }

    // //***************** Async Storage Section Ends*************************************/


    useEffect(
        ()=>{
            loadList()
            AsyncStorage.getItem("uid")
            .then(
                (dataFromStorage) => {
                    if (dataFromStorage === null) {
                        console.log("Could not find data for key = uid")
                    }
                    else {
                        console.log("We found user' email = uid")
                        console.log(dataFromStorage)
                        setuid(dataFromStorage)
                    }
                }
            )
            .catch(
                (error) => {
                    console.log("Error when fetching primitive from key-value storage")
                }
            )
        }, []
    )

    const onAlert = () => {
        setShowAlert(true)
    }
    const hideAlert = () => {
        setShowAlert(false)
    }
    function degreesToRadians(degrees) {
        return degrees * Math.PI / 180;
    }

    function distanceInKmBetweenEarthCoordinates(lat1, lon1, lat2, lon2) {
        var earthRadiusKm = 6371;

        var dLat = degreesToRadians(lat2 - lat1);
        var dLon = degreesToRadians(lon2 - lon1);

        lat1 = degreesToRadians(lat1);
        lat2 = degreesToRadians(lat2);

        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return earthRadiusKm * c;
    }

    const itemPressed = (item) => {
        navigation.replace("SiteDetail", { disItem: item })
    }



    const getLocationPressed = () => {
        Location.requestForegroundPermissionsAsync().
            then(
                (result) => {
                    if (result.status === "granted") {
                        console.log("granted")
                        return Location.getCurrentPositionAsync({})
                    }
                    else {
                        console.log("blocked")
                    }
                }
            ).
            then(
                (location) => {
                    console.log(`Got the location`)
                    console.log(JSON.stringify(location))
                    locFlag = true
                    console.log("locFlag set true")
                    coordinates.lat = location.coords.latitude
                    coordinates.lng = location.coords.longitude
                    console.log(coordinates)
                }
            )
            .catch((err) => {
                console.log("Error when requesting permission")
                console.log(err)
                // update the UI to let the user know what happened
            })
    }
    const disMapping = () => {
        db.collection("geocachingSites").get().then((querySnapshot) => {
            let temp = []
            let obj
            let marker
            querySnapshot.forEach((documentFromFirestore) => {
                console.log(`${documentFromFirestore.id}, ${JSON.stringify(documentFromFirestore.data())}`)
                let result = distanceInKmBetweenEarthCoordinates(documentFromFirestore.data().Latitude, documentFromFirestore.data().Longitude, coordinates.lat, coordinates.lng)
                if (result < range) {
                    console.log(result < range)
                    obj = {
                        site_id: documentFromFirestore.id,
                        Latitude: documentFromFirestore.data().Latitude,
                        Longitude: documentFromFirestore.data().Longitude,
                        fav: documentFromFirestore.data().fav,
                        user: documentFromFirestore.data().user,
                        title: documentFromFirestore.data().title
                    }
                    marker =
                    {
                        coordinate: {
                            latitude: documentFromFirestore.data().Latitude,
                            longitude: documentFromFirestore.data().Longitude,
                        },
                        title: documentFromFirestore.data().title,
                        user: documentFromFirestore.data().user
                    }
                    temp.push(obj)
                    marklist.push(marker)
                }
            });
            console.log(temp)
            setDis(temp)
            //setMarkers(temp)

        }).finally(setLoading(false));
    }
    const loadList = () => {
        db.collection("geocachingSites").get().then((querySnapshot) => {
            let temp = []
            let obj
            let marker

            querySnapshot.forEach((documentFromFirestore) => {
                //console.log(`${documentFromFirestore.id}, ${JSON.stringify(documentFromFirestore.data())}`)
                obj = {
                    site_id: documentFromFirestore.id,
                    Latitude: documentFromFirestore.data().Latitude,
                    Longitude: documentFromFirestore.data().Longitude,
                    fav: documentFromFirestore.data().fav,
                    user: documentFromFirestore.data().user,
                    title: documentFromFirestore.data().title
                }
                marker =
                {
                    coordinate: {
                        latitude: documentFromFirestore.data().Latitude,
                        longitude: documentFromFirestore.data().Longitude,
                    },
                    title: documentFromFirestore.data().title,
                    user: documentFromFirestore.data().user
                }
                temp.push(obj)
                marklist.push(marker)
                console.log("this is Marklist")
                console.log(marklist)
            });
            setDis(temp)
            //setMarkers(temp)

        }).finally(setLoading(false));
    }

    const incPress = () => {
        if (range >= 0) {
            let newDis = range + 10
            setRange(newDis)
        }
    }
    const decPress = () => {
        if (range >= 10) {
            let newDis = range - 10
            setRange(newDis)
        }
    }
    const selPressed = () => {

        console.log("Sel pressed")
        console.log(range)
        setLoading(true)
        disMapping()
        // if(locFlag)
        // {

        // }
        // else
        // {
        //     onAlert()
        // }
    }

    const saveFav = (item) => {
        console.log(item)
        const info = {
            title:item.title,
            site_id:item.site_id
        }

        db.collection("users").doc(uid).collection("favourites").where("site_id", "==", item.site_id).get()
        .then(
            (qSnapshot) => {
                qSnapshot.forEach((doc) => {
                  if (doc.data().site_id === item.site_id) {
                    throw new Error("")
                  }
                })
                return db.collection("users").doc(uid).collection("favourites").add(info).then()
              }
        )
        .then(

        )
        

        // let temp

        // db.collection("users").doc(uid).collection("favourites").get().then((querySnapshot) => {
        //     temp = []
        //     querySnapshot.forEach((documentFromFirestore) => {
        //         // console.log(`${documentFromFirestore.id}, ${JSON.stringify(documentFromFirestore.data())}`)

        //         temp.push(documentFromFirestore.data())
        //     });
        // }).then(() => {

        //     for (let itt = 0; itt < temp.length; itt++) {

        //         if (temp[itt].title.localeCompare(item.title) == 0) {
        //             saveFlag = true
        //             console.log(saveFlag)
        //             console.log("Already exists")
        //         }
        //     }
        // }).then(() => {
        //     if (!saveFlag) {

        //         db.collection("users").doc(userUID).collection("favourites").add({
        //             site_id: item.site_id,
        //             title: item.title
        //         })
        //             .then((docRef) => {
        //                 console.log("Document written with ID: ", docRef.id);
        //             }).catch((error) => {
        //                 console.error("Error adding document: ", error);
        //             });
        //     }
        //     saveFlag = false
        // }
        // )
    }
    const saveRecord = (item) => {
        const info = {
            title:item.title,
            site_id:item.site_id
        }

        db.collection("users").doc(uid).collection("records").where("site_id", "==", item.site_id).get()
        .then(
            (qSnapshot) => {
                qSnapshot.forEach((doc) => {
                  if (doc.data().site_id === item.site_id) {
                    throw new Error("")
                  }
                })
                return db.collection("users").doc(uid).collection("favourites").add(info).then()
              }
        )
        .then(

        )
        // let temp

        // db.collection("users").doc(userUID).collection("records").get().then((querySnapshot) => {
        //     temp = []
        //     querySnapshot.forEach((documentFromFirestore) => {
        //         console.log(`${documentFromFirestore.id}, ${JSON.stringify(documentFromFirestore.data())}`)

        //         temp.push(documentFromFirestore.data())
        //     });
        // }).then(() => {

        //     for (let itt = 0; itt < temp.length; itt++) {

        //         if (temp[itt].title.localeCompare(item.title) == 0) {
        //             recordFlag = true
        //             console.log(recordFlag)
        //             console.log("Already exists")
        //         }
        //     }
        // }).then(() => {
        //     if (!recordFlag) {

        //         db.collection("users").doc(userUID).collection("records").add({
        //             site_id: item.site_id,
        //             title: item.title,
        //             note: "",
        //             completed: false
        //         })
        //             .then((docRef) => {
        //                 console.log("Document written with ID: ", docRef.id);
        //             }).catch((error) => {
        //                 console.error("Error adding document: ", error);
        //             });
        //     }
        //     recordFlag = false
        // }
        // )
    }
    const mapRef = useRef(null)
    const [currRegion, setCurrRegion] = useState({
        latitude: coordinates.lat,
        longitude: coordinates.lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01
    })
    const mapMoved = (data) => {
        console.log(data)
        // OPTIONAL: you can update the state variable and do something with the updated region info later
        setCurrRegion(data)
    }
    
    return (
        <SafeAreaView>

            {isLoading ? (<ActivityIndicator animating={false} size="large" />) : (


                <MapView ref={mapRef} style={{ width: Dimensions.get("window").width, height: 300 }} initialRegion={currRegion} region={currRegion} >

                    {
                        marklist.map((item, index) => {
                            console.log(item)
                            return (<Marker coordinate={item.coordinate} title={item.title} description="Here somewhere" key={index}></Marker>)

                        })

                    }
                </MapView>
            )}



            <View style={styles.Button}>
                <Button style={styles.item} title="+ " onPress={incPress}></Button>
                <Text style={styles.item} >Range Set for {range} Kms</Text>
                <Button style={styles.item} title="- " onPress={decPress}></Button>
                <Button style={styles.item} title="Select" onPress={selPressed}></Button>
                <Button style={styles.item} title="location" onPress={getLocationPressed}></Button>
            </View>

            {isLoading ? (<ActivityIndicator animating={true} size="large" />) : (

                <FlatList data={dis}
                    keyExtractor={(item, index) => { return item["title"] }}
                    renderItem={({ item, index }) => (
                        <Pressable onLongPress={() => { console.log(item.title + " is selected") }}>
                            <View style={styles.main}  >

                                <Text></Text>
                                <View style={styles.list}>
                                    <Button title="Add to Fav" onPress={() => { saveFav(item) }} />
                                    <Text onPress={() => { itemPressed(item) }}>{item.title}</Text>
                                    <Button title="Add to Records" onPress={() => { saveRecord(item) }} />
                                </View>

                            </View>
                        </Pressable>
                    )}
                />
            )}




            <Alert

                show={showAlert}
                onPress={selPressed}
                message="Need Device Location"

            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({

    Button: {

        flexDirection: 'row',

        alignItems: 'center',
        justifyContent: 'space-between'

    },
    item:
    {
        marginLeft: 10,
        marginStart: 10
    },
    list: {
        flexDirection: 'row',
        justifyContent: 'space-between'

    },
    main: {
        flexDirection: 'column',


    }

});

export default list


// {
//     currRegion.dis.map( (item, index)=> {
//     return <Marker coordinate={{ latitude: item.Latitude, longitude: item.Longitude }} title={item.title} description="Here somewhere" key={index}></Marker>
// })
// }


{/* <Marker coordinate={{latitude:currRegion.latitude, longitude:currRegion.longitude}}
title="Schwartz's Deli"
description="We make a really good sandwich"></Marker>
<Marker coordinate={{latitude:45.5163539, longitude:-73.5775142}}
title="Schwartz's Deli"
description="We make a really good sandwich"></Marker>
<Marker coordinate={{latitude:42.515940, longitude:-73.577550}}
title="Main Street Deli"
description="We also make a really good sandwich"></Marker> */}
