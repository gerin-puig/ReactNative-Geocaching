import React, { useEffect, useState } from "react"
import { View, TextInput, Button, SafeAreaView, Text, StyleSheet, Alert, Pressable } from "react-native"
import { db } from "./FirebaseManager"
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Location from "expo-location"
import { styles } from "./Style"

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

        db.collection("users").get()
            .then(
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

                    })
                    //console.log(check)
                    if (!check) {
                        throw new Error("")
                    }
                }
            )
            .catch((e) => {
                //console.log(e)
                Alert.alert(
                    "Login",
                    "Email/Password Incorrect.",
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
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>GEOCACHING TROVE</Text>
            <Text style={styles.header}>PLEASE SIGN IN</Text>
            <View style={{marginTop: '30%'}}>
                <TextInput style={styles.input} placeholder="Enter Email" keyboardType='email-address' value={email} onChangeText={(data) => { setEmail(data) }} />
                <View style={{margin: 20}}/>
                <TextInput style={styles.input} placeholder="Enter Password" secureTextEntry={true} value={password} onChangeText={(data) => { setPassword(data) }} />
                <View style={{marginTop:'30%'}}>
                    <Pressable style={({ pressed }) => [{ backgroundColor: pressed ? 'rgb(210,230,255)' : 'green' }, styles.buttons]} onPress={loginPressed}>
                        <Text style={styles.button_text}>LOGIN</Text></Pressable>
                    <Pressable style={({ pressed }) => [{ backgroundColor: pressed ? 'rgb(210,230,255)' : 'green' }, styles.buttons]} onPress={signUpPressed}>
                        <Text style={styles.button_text}>SIGN UP</Text></Pressable>
                </View>

            </View>
        </SafeAreaView>
    )
}

export default LoginScreen