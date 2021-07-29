import React, { createContext, useState } from 'react'
import auth from '@react-native-firebase/auth'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState()
    return (
        <AuthContext.Provider value={{
            user, setUser,
            login: (email, password) => {
                
            }
        }}>

        </AuthContext.Provider>
    )
}