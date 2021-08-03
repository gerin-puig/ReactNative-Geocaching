import React, { useEffect, useState } from 'react'
import { View,SafeAreaView, Text, ActivityIndicator, Pressable, FlatList, Button, TextInput } from 'react-native'
import MapView, { Marker } from 'react-native-maps';

import { Dimensions } from 'react-native';


const SiteDetail = ({navigation,route}) =>{
  
  const disItem = route.params.disItem

  const [currRegion, setCurrRegion] = useState({
    latitude:disItem.Latitude,
    longitude: disItem.Longitude,
    latitudeDelta: 0.005,
    longitudeDelta:0.005
  })

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

  
  return(
      <SafeAreaView>   
         <TextInput
        onChangeText={setLat1}
        value={lat1}
        placeholder="latitude"
        keyboardType="numeric"
        
      />
      <TextInput
        onChangeText={setLon1}
        value={lon1}
        placeholder="longitude"
        keyboardType="numeric"
      />
        <TextInput
        onChangeText={setLat2}
        value={lat2}
        placeholder="latitude"
        keyboardType="numeric"
        
      />
      <TextInput
        onChangeText={setLon2}
        value={lon2}
        placeholder="longitude"
        keyboardType="numeric"
      />
    <Button title = "CALULATE DIS" onPress = {()=>{
       let result = distanceInKmBetweenEarthCoordinates(lat1,lon1,lat2,lon2)
      
       setResult(result)
       }}></Button>

    <Text>RESULT {result} </Text>
           
     <Text>{disItem.title}</Text>
     <Text>{disItem.user}</Text>
     <Text>{disItem.Latitude}</Text>
     <Text>{disItem.Longitude}</Text>
     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
     <Text>Map Screen</Text>
     <MapView
       style={{width:Dimensions.get("window").width, height:500}}
       initialRegion={currRegion}
       
     ></MapView>
   </View>

      </SafeAreaView>
  )
}

export default SiteDetail