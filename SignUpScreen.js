import React, { useEffect, useState } from "react"
import { View, TextInput, Button, SafeAreaView, Text, StyleSheet, Alert, SectionList } from "react-native"
import { db } from "./FirebaseManager"

const Signup = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fname, setFName] = useState("")
  const [lname, setLName] = useState("")
  // const [isValid, setValid] = useState(true)

  const signUpPressed = () => {
    let isValid = true
    if (email === "") {
      // setValid(false)
      isValid = false
      console.log("email empty")
    }
    if (password.length < 6) {
      // setValid(false)
      isValid = false
      console.log("password too short")
    }

    if (fname === "" || lname ==="") {
      isValid = false
    }

    if (isValid === false) {
      Alert.alert(
        "Sign up",
        "Please fill-in all fields & make sure password is more than 6 characters.",
        [
          {
            text:"OK"
          }
        ]
      )
      return
    }

    let user = {
      email: email,
      password: password,
      firstname: fname,
      lastname: lname
    }

    db.collection("users").where("email", "==", email).get()
      .then(
        (qSnapshot) => {
          qSnapshot.forEach((doc) => {
            if (doc.data().email === email) {
              throw new Error("Email is used.")
            }
          })
          return db.collection("users").add(user).then()
        }
      )
      .then(
        (doc) => {
          Alert.alert(
            "Sign up",
            "Account Created!",
            [
              {
                text:"OK"
              }
            ]
          )
          console.log("document created with id: " + doc.id)
        }
      )
      .catch((e) => {
        Alert.alert(
          "Sign up",
          e,
          [
            {
              text:"OK"
            }
          ]
        )
      })


    //console.log(isValid)



    // db.collection("users").add(user)
    //   .then(
    //     (doc) => {
    //       console.log("Document created with id:" + doc.id)
    //     }
    //   )
    //   .catch(
    //     (error) => { console.log(error) }
    //   )
  }


  return (
    <View>
      <TextInput placeholder="Enter Email" value={email} onChangeText={(data) => { setEmail(data) }} />
      <TextInput placeholder="Enter Password" value={password} onChangeText={(data) => { setPassword(data) }} />
      <TextInput placeholder="Enter First Name" value={fname} onChangeText={(data) => { setFName(data) }} />
      <TextInput placeholder="Enter Last Name" value={lname} onChangeText={(data) => { setLName(data) }} />
      <Button title="Sign Up" onPress={signUpPressed} />
    </View>
  )
}

export default Signup