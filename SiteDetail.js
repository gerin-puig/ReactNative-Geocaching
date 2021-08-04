import React, { useEffect, useState,useRef } from 'react'
import { StyleSheet,View,SafeAreaView, Text, ActivityIndicator, Pressable, FlatList, Button, TextInput } from 'react-native'
import MapView, { Marker } from 'react-native-maps';

import { Dimensions } from 'react-native';


const SiteDetail = ({navigation,route}) =>{
  
  const disItem = route.params.disItem

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
  const [lat1, setLat1] = React.useState(null);
  const [lon1, setLon1] = React.useState(null);
  const [lat2, setLat2] = React.useState(null);
  const [lon2, setLon2] = React.useState(null);
  const [result, setResult] = React.useState(null);
  const mapRef = useRef(null)
  const [currRegion, setCurrRegion] = useState({
    latitude:disItem.Latitude,
    longitude: disItem.Longitude,
    latitudeDelta: 0.01,
    longitudeDelta:0.01
  })
  const mapMoved = (data) => {
    console.log(data)
    // OPTIONAL: you can update the state variable and do something with the updated region info later
    setCurrRegion(data)
  }
  
  
  return(
      <SafeAreaView>   
     
     <View style={{  justifyContent: 'center', alignItems: 'center' }}>
  
     <MapView ref={mapRef}  style={{ width: Dimensions.get("window").width, height: 300 }} initialRegion={currRegion} region={currRegion} >
              
     <Marker coordinate= {{latitude: parseFloat(disItem.Latitude), longitude: parseFloat(disItem.Longitude)}} title={disItem.title} description={disItem.user} ></Marker>    
             
    </MapView>   
      </View>
      <Text style = {styles.head}>Site Details</Text>
      <View style = {styles.title}>
      <Text style ={styles.ques} >Title</Text>
      <Text style ={styles.ques}>{disItem.title}</Text>
      </View>   
      <View style = {styles.title}>
      <Text style ={styles.ques} >User</Text>
      <Text style ={styles.ques}>{disItem.user}</Text>
      </View> 
      <View style = {styles.title}>
      <Text style ={styles.ques}>Latitude</Text>
      <Text style ={styles.ques}>{disItem.Latitude}</Text>
      </View> 
      <View style = {styles.title}>
      <Text style ={styles.ques}>Longitude</Text>
      <Text style ={styles.ques}>{disItem.Longitude}</Text>
      </View>  
     
    
     
     
  
   <View style = {styles.calculator}>
   <Text style = {styles.head2}>Enter the Location Coordinates to Calculate Distance</Text>
   <TextInput
        onChangeText={setLat1}
        value={lat1}
        placeholder="latitude 1"
        keyboardType="numeric"
        
      />
      <TextInput
        onChangeText={setLon1}
        value={lon1}
        placeholder="longitude 1"
        keyboardType="numeric"
      />
        <TextInput
        onChangeText={setLat2}
        value={lat2}
        placeholder="latitude 2"
        keyboardType="numeric"
        
      />
      <TextInput
        onChangeText={setLon2}
        value={lon2}
        placeholder="longitude 2"
        keyboardType="numeric"
      />
      <Text style= {styles.result}>Distance is {result} Kms </Text>
    <Button title = "CALULATE DIS" onPress = {()=>{
       let result = distanceInKmBetweenEarthCoordinates(lat1,lon1,lat2,lon2)
      
       setResult(result)
       }}></Button>
   </View>
   

      </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calculator:{
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center'
  },
  head:
  {
    color: '#8B0000',
    fontWeight: 'bold',
    fontSize: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginStart:125
  },
  head2:
  {
    color: '#8B0000',
    fontWeight: 'bold',
    fontSize: 15,
    justifyContent: 'center',
    alignItems: 'center'
    
  },
  title:
  {
    flexDirection: 'row'  ,
    marginStart:10,
    alignItems:'center',
    justifyContent:'center'
  },
  ques:{
    color: 'black',
    fontWeight: 'bold',
    padding:5,
    
  },
  
  ans:{
    marginStart:"30",
    color: 'blue',
    fontWeight: 'bold',
  },
  result:{
    color: '#8B0000',
    fontWeight: 'bold',
    fontSize: 15,
   
  }
});


export default SiteDetail