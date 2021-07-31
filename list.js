import React, { useEffect, useState } from 'react'
import { View,SafeAreaView, Text, ActivityIndicator, Pressable, FlatList, Button } from 'react-native'
import { db } from './FirebaseManager'


const list = ({navigation}) =>{

    const [dis,setDis] = useState([])
    
    const [isLoading, setLoading] = useState(true)

    const itemPressed =()=>
    {
        navigation.replace("SiteDetail")
       
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

  return(
      <SafeAreaView>          
         {isLoading ? (<ActivityIndicator animating={true} size="large" />) : (
            <FlatList data={dis}
                keyExtractor={(item, index) => { return item["title"] }}
                renderItem={({ item, index }) => (
                    <Pressable onPress={()=>{itemPressed(index)}} onLongPress={() => { console.log(item.title + " is selected") }}>
                        <View>
                            <Text>{item.title}</Text>
                        </View>
                    </Pressable>
                )}
            />
        )}
      </SafeAreaView>
  )
}

export default list