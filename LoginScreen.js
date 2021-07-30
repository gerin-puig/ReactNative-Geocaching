import React, { useEffect, useState } from "react"
import { View, TextInput, Button, SafeAreaView, Text, StyleSheet, Alert } from "react-native"
import { db } from "./FirebaseManager"
import AsyncStorage from '@react-native-async-storage/async-storage'
import auth from '@react-native-firebase/auth'

const LoginScreen = ({ navigation, route }) => {


    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const loginPressed = () => {
        let isFound = false
        if (email === "") {
            return
        }
        if (password === "") {
            return
        }

        db.collection("users").get().then(
            (querySnapshot) => {
                querySnapshot.forEach((documentFromFirestore) => {

                    if (documentFromFirestore.data().email === email && documentFromFirestore.data().password === password) {
                        //console.log(documentFromFirestore.data())
                        isFound = true
                        navigation.replace("Home")
                        AsyncStorage.setItem("uid", documentFromFirestore.id)
                            .then({})
                            .catch(
                                (error) => {
                                    console.log(`Error occured: ${error}`)
                                }
                            )
                        return
                    }
                })
            }
        ).then(() => {
            console.log("Save was successful!")
        })

        // if(isFound === false){
        //     Alert.alert(
        //         "Login",
        //         "Email/Password Incorrect",
        //         [
        //             {
        //                 text: "OK", onPress: () => console.log("OK Pressed")
        //             }
        //         ]
        //     )
        // }



    }

    const signUpPressed = () => {
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