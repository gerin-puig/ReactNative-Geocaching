import React, { useEffect, useState } from 'react'
import { View,SafeAreaView, Text, ActivityIndicator, Pressable, FlatList, Button } from 'react-native'
import { db } from './FirebaseManager'
import * as Location from "expo-location"
import Alert from "react-native-awesome-alerts";


const list = ({navigation}) =>{
    const [dis,setDis] = useState([])
    let coordinates = 
    {
        lat: "",
        lng:""
    }
    let locFlag = false
   
    const [isLoading, setLoading] = useState(true)

    const [showAlert,setShowAlert] = useState(false)
     const onAlert = () => {
        setShowAlert(true)
      }
      const hideAlert = () =>
      {
          setShowAlert(false)
      }
    function degreesToRadians(degrees) {
        return degrees * Math.PI / 180;
      }
      
      function distanceInKmBetweenEarthCoordinates(lat1, lon1, lat2, lon2) {
        var earthRadiusKm = 6371;
      
        var dLat = degreesToRadians(lat2-lat1);
        var dLon = degreesToRadians(lon2-lon1);
      
        lat1 = degreesToRadians(lat1);
        lat2 = degreesToRadians(lat2);
      
        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        return earthRadiusKm * c;
      }

    const itemPressed =(item)=>
    {
        navigation.replace("SiteDetail",{disItem: item})
    } 
   
    const [range,setRange] = useState(0)

    const getLocationPressed = () => {
        Location.requestForegroundPermissionsAsync().
    then(
      (result) => {
        if(result.status === "granted")
        {
            console.log("granted")
           return Location.getCurrentPositionAsync({})
        }
        else
        {
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
    .catch((err)=>{
          console.log("Error when requesting permission")
          console.log(err)
          // update the UI to let the user know what happened
        })
    }
    const disMapping = () =>
    {
        db.collection("geocachingSites").get().then((querySnapshot) => {
            let temp = []
            querySnapshot.forEach((documentFromFirestore) => {
            console.log(`${documentFromFirestore.id}, ${JSON.stringify(documentFromFirestore.data())}`)
            let result = distanceInKmBetweenEarthCoordinates(documentFromFirestore.data().Latitude,documentFromFirestore.data().Longitude,coordinates.lat,coordinates.lng)
            if(result<range)
            {
                console.log(result<range)
                temp.push(documentFromFirestore.data())

            }
            });
            console.log(temp)
            setDis(temp)
            }).finally(setLoading(false));
    }
    const loadList = ()=>
    {
        db.collection("geocachingSites").get().then((querySnapshot) => {
        let temp = []
        querySnapshot.forEach((documentFromFirestore) => {
        console.log(`${documentFromFirestore.id}, ${JSON.stringify(documentFromFirestore.data())}`)
        temp.push(documentFromFirestore.data())
        });
        setDis(temp)
        }).finally(setLoading(false));
    }
    
        useEffect(loadList,[])

        const incPress = () =>
        {
             if(range>=0)
             {
                let newDis = range + 10
                setRange(newDis)
             }
        }
        const decPress = () =>
        {
            if(range>=10)
            {
                let newDis = range - 10
                setRange(newDis)
            }
        }
        const  selPressed = () =>
        {

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
            
  return(
      <SafeAreaView>    
         <Button title = "+ " onPress = {incPress}></Button>
         <Text>Range Set for {range} Kms</Text>
         <Button title = "- " onPress = {decPress}></Button>
         <Button title = "Select" onPress = {selPressed}></Button>
         <Button title = "location" onPress = {getLocationPressed}></Button>
         {isLoading ? (<ActivityIndicator animating={true} size="large" />) : (
            <FlatList data={dis}
                keyExtractor={(item, index) => { return item["title"] }}
                renderItem={({ item, index }) => (
                    <Pressable onPress={()=>{itemPressed(item)}} onLongPress={() => { console.log(item.title + " is selected") }}>
                        <View>
                            <Text>{item.title}</Text>
                        </View>
                    </Pressable>
                )}
            />
        )}
        <Alert
        
        show = {showAlert}
        onPress = {selPressed}
        message="Need Device Location"
          
        />
      </SafeAreaView>
  )
}

export default list