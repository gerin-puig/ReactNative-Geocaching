import React, { useEffect, useState } from "react"
import { View, TextInput, Button, SafeAreaView, Text, StyleSheet, Alert } from "react-native"
import { db } from "./FirebaseManager"

const LoginScreen = ({ navigation, route }) => {
    const [user, setUser] = useState();

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isfound, setFound] = useState(false)

    const loginPressed = () => {
        db.collection("users").get().then(
            (querySnapshot) => {
              querySnapshot.forEach((documentFromFirestore) => {
                if(documentFromFirestore.data().email === email && documentFromFirestore.data().password === password){
                    navigation.replace("Home")
                }
              })
            }
          )
    }

    const signUpPressed = () =>{
        navigation.navigate("Signup")
    }

    return (
        <SafeAreaView>
            <Text>Please Sign In</Text>
            <View>
                <TextInput placeholder="Enter Email" value={email} onChangeText={(data) => { setEmail(data) }} />
                <TextInput placeholder="Enter Password" value={password} onChangeText={(data) => { setPassword(data) }} />
                <Button title="Login" onPress={loginPressed} />
                <Button title="Sign Up" onPress={signUpPressed} />
            </View>
        </SafeAreaView>
    )
}

export default LoginScreen