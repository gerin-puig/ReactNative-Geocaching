import React, { useEffect, useState } from "react"
import { View, TextInput, Button, Pressable, Text, StyleSheet, Alert, SectionList } from "react-native"
import { db } from "./FirebaseManager"
import { styles } from "./Style"

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

    if (fname === "" || lname === "") {
      isValid = false
    }

    if (isValid === false) {
      Alert.alert(
        "Sign up",
        "Please fill-in all fields & make sure password is more than 6 characters.",
        [
          {
            text: "OK"
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
                text: "OK"
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
              text: "OK"
            }
          ]
        )
      })

  }


  return (
    <View style={styles.container}>
      <Text style={styles.header}>Please fill in the fields:</Text>
      <TextInput style={styles.input} placeholder="Enter Email" value={email} onChangeText={(data) => { setEmail(data) }} />
      <TextInput style={styles.input} placeholder="Enter Password" value={password} onChangeText={(data) => { setPassword(data) }} />
      <TextInput style={styles.input} placeholder="Enter First Name" value={fname} onChangeText={(data) => { setFName(data) }} />
      <TextInput style={styles.input} placeholder="Enter Last Name" value={lname} onChangeText={(data) => { setLName(data) }} />

      <Pressable style={({ pressed }) => [{ backgroundColor: pressed ? 'rgb(210,230,255)' : 'green' }, styles.buttons, { width: 150 }]} onPress={signUpPressed}>
        <Text style={styles.button_text}>SIGN UP</Text>
      </Pressable>
    </View>
  )
}

export default Signup