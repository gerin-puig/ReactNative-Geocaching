import React, { useEffect } from "react"
import { View, TextInput, Button, SafeAreaView, Text, StyleSheet } from "react-native"

const LoginScreen = ({navigation, route}) => {

    const loginPressed = () => {
        navigation.replace("Home")
    }

    return(
        <SafeAreaView>
            <Text>Please Sign In</Text>
            <View>
                <Button title="Login" onPress={loginPressed} />
            </View>
        </SafeAreaView>
    )
}

export default LoginScreen