import React, { useEffect, useState } from 'react'
import { View,SafeAreaView, Text, ActivityIndicator, Pressable, FlatList, Button , Switch} from 'react-native'
import { db } from './FirebaseManager'
import * as Location from "expo-location"
import Alert from "react-native-awesome-alerts";
import AsyncStorage from '@react-native-async-storage/async-storage';

const list = ({navigation}) =>{
    const [dis,setDis] = useState([])
    let coordinates = 
    {
        lat: "",
        lng:""
    }
    let locFlag = false
    let userUID
    let saveFlag = false
    let recordFlag = false
    const [isLoading, setLoading] = useState(true)


    const [showAlert,setShowAlert] = useState(false)
    const [range,setRange] = useState(0)
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
                obj = {
                    site_id: documentFromFirestore.id,
                    Latitude: documentFromFirestore.data().Latitude,
                    Longitude: documentFromFirestore.data().Longitude,
                    fav: documentFromFirestore.data().fav,
                    user: documentFromFirestore.data().user,
                    title: documentFromFirestore.data().title           
                }
                temp.push(obj)
            }
            });
            console.log(temp)
            setDis(temp)
            }).finally(setLoading(false));
    }
    const loadList = ()=>
    {
        //getArray()
        getUserUID()
        db.collection("geocachingSites").get().then((querySnapshot) => {
        let temp = []
        let obj
           
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
        temp.push(obj)
        });
        setDis(temp)
        console.log(userUID)
        }).finally(setLoading(false));
    }
       
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

        const saveFav= (item)=>
        {
            let temp 
           
                db.collection('/users/7hQ318esNTiesTE3Bc0u/favourites').get().then((querySnapshot) => {
                     temp = []
                    querySnapshot.forEach((documentFromFirestore) => {
                   // console.log(`${documentFromFirestore.id}, ${JSON.stringify(documentFromFirestore.data())}`)
                   
                    temp.push(documentFromFirestore.data())
                    });
                }).then( ()=>
                    {  
                        
                        for(let itt = 0; itt < temp.length ; itt++)
                        {
                          
                            if(temp[itt].title.localeCompare(item.title) == 0)
                            {
                                    saveFlag = true
                                    console.log(saveFlag)
                                    console.log("Already exists")
                            }
                        }
                        }).then(()=>{
                            if(!saveFlag)
                            {  
                               
                                    db.collection('/users/7hQ318esNTiesTE3Bc0u/favourites').add({
                                        site_id:item.site_id,
                                        title:item.title
                                    } )
                                     .then((docRef) => {
                                    console.log("Document written with ID: ", docRef.id);                               
                                 }).catch((error) => {
                                    console.error("Error adding document: ", error);                                  
                                });                                
                            }
                            saveFlag = false
                        }
                        )              
        }
        const saveRecord = (item)=>
        {
            let temp 
                
                db.collection("/users/7hQ318esNTiesTE3Bc0u/records").get().then((querySnapshot) => {
                     temp = []
                    querySnapshot.forEach((documentFromFirestore) => {
                   console.log(`${documentFromFirestore.id}, ${JSON.stringify(documentFromFirestore.data())}`)
                   
                    temp.push(documentFromFirestore.data())
                    });
                }).then( ()=>
                    {  
                        
                        for(let itt = 0; itt < temp.length ; itt++)
                        {
                          
                            if(temp[itt].title.localeCompare(item.title) == 0)
                            {
                                    recordFlag = true
                                    console.log(recordFlag)
                                    console.log("Already exists")
                            }
                        }
                        }).then(()=>{
                            if(!recordFlag)
                            {  
                               
                                    db.collection("/users/7hQ318esNTiesTE3Bc0u/records").add({
                                        site_id:item.site_id,
                                        title:item.title,
                                        note: "",
                                        completed: false
                                    } )
                                     .then((docRef) => {
                                    console.log("Document written with ID: ", docRef.id);                               
                                 }).catch((error) => {
                                    console.error("Error adding document: ", error);                                  
                                });                                
                            }
                            recordFlag = false
                        }
                        )              
        }
        useEffect(loadList,[])            
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
                    <Pressable  onLongPress={() => { console.log(item.title + " is selected") }}>
                        <View>
                            <Text onPress={()=>{itemPressed(item)}}>{item.title}</Text>
                            <Button title = "Add to Fav" onPress = {()=>{saveFav(item)}}/>
                            <Button title = "Add to Records" onPress = {()=>{saveRecord(item)}}/>
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