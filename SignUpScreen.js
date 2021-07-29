import React, { useEffect, useState } from "react"
import { View, TextInput, Button, SafeAreaView, Text, StyleSheet, Alert } from "react-native"
import { db } from "./FirebaseManager"

const Signup = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [fname, setFName] = useState("")
    const [lname, setLName] = useState("")

    const signUpPressed = () => {

        let user = {
            email: email,
            password: password,
            firstname: fname,
            lastname: lname
          }

        db.collection("users").add(user)
        .then(
          (doc) => {
            console.log("Document created with id:" + doc.id)
          }
        )
        .catch(
          (error) => { console.log(error) }
        )
    }

    return (
        <View>
            <TextInput placeholder="Enter Email" value={email} onChangeText={(data) => { setEmail(data) }} />
            <TextInput placeholder="Enter Password" value={password} onChangeText={(data) => { setPassword(data) }} />
            <TextInput placeholder="Enter First Name" value={fname} onChangeText={(data) => { setFName(data) }} />
            <TextInput placeholder="Enter Last Name" value={lname} onChangeText={(data) => { setLName(data) }} />
            <Button title="Sign Up" onPress={signUpPressed}/>
        </View>
    )
}

export default Signup