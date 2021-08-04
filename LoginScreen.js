import React, { useEffect, useState } from "react"
import { View, TextInput, Button, SafeAreaView, Text, StyleSheet, Alert } from "react-native"
import { db } from "./FirebaseManager"
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Location from "expo-location"

const LoginScreen = ({ navigation, route }) => {


    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    useEffect(
        () => {
            Location.requestForegroundPermissionsAsync()

        }, []
    )

    const loginPressed = () => {
        let isValid = false
        if (email !== "") {
            isValid = true
        }
        if (password !== "") {
            isValid = true
        }

        if (!isValid) {
            return
        }

        db.collection("users").get().then(
            (querySnapshot) => {
                let check = false
                querySnapshot.forEach((documentFromFirestore) => {

                    if (documentFromFirestore.data().email === email && documentFromFirestore.data().password === password) {
                        //console.log(documentFromFirestore.data())
                        navigation.replace("Home")
                        AsyncStorage.setItem("uid", documentFromFirestore.id).then(() => { console.log("uid saved") })
                            .catch(
                                (error) => {
                                    console.log(`Error occured: ${error}`)
                                }
                            )
                        check = true
                    }
                    console.log(check)
                    if (!check) {
                        throw new Error("Email/Password Incorrect")
                    }

                })
            }
        )
            .catch((error) => {
                Alert.alert(
                    "Login",
                    error,
                    [
                        {
                            text: "OK"
                        }
                    ]
                )
            })

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