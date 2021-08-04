import { StyleSheet } from "react-native"

const styles = StyleSheet.create({
    container: {
        alignItems: 'center'
    },
    header: {
        fontWeight: 'bold',
        fontSize: 24,
        color: 'black',
        padding: 10,
        textAlign:'center',
        marginTop: 10
    },
    input:{
        textAlign: 'center',
        fontSize: 20,
        padding: 10,
    },
    list_item: {
        margin: 10,
        padding: 10,
        paddingLeft: 50,
        paddingRight: 50,
        textAlign:'center',
        fontSize:18
    },
    separator: {
        height: 1,
        backgroundColor: 'gray',
    },
    info:{
        fontSize: 18,
        margin: 5,
    },
    noneFound:{
        fontWeight: 'bold',
        fontSize: 20,
        color: 'red',
        margin: 20
    },
    buttons:{
        margin: 10,
        alignItems:'center', 
        borderRadius:4, 
        height:38, 
        padding:5
    },
    button_text:{
        fontSize:20, 
        color:'white'
    }
})

export {styles}