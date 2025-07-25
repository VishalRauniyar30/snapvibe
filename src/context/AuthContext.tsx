import { createContext, useContext, useEffect, useState } from "react"

import type { IContextType, IUser } from "@/types"
import { useNavigate } from "react-router-dom"
import { getCurentuser } from "@/lib/appwrite/api"

export const INITIAL_USER = {
    id: "",
    name: "",
    username: "",
    email: "",
    imageUrl: "",
    bio: "",
}

const INITIAL_STATE = {
    user: INITIAL_USER,
    isLoading: false,
    isAuthenticated: false,
    setUser: () => {},
    setIsAuthenticated: () => {},
    checkAuthUser: async () => false as boolean,
}

const AuthContext = createContext<IContextType>(INITIAL_STATE)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const navigate = useNavigate()
    const [user, setUser] = useState<IUser>(INITIAL_USER)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const checkAuthUser = async () => {
        setIsLoading(true)
        try {
           const currentAccount = await getCurentuser()
           
           if(currentAccount) {
                setUser({
                    id: currentAccount.$id,
                    name: currentAccount.name,
                    username: currentAccount.username,
                    email: currentAccount.email,
                    imageUrl: currentAccount.imageUrl,
                    bio: currentAccount.bio
                })
                setIsAuthenticated(true)
                return true
           }
           return false
        } catch (error) {
            console.error(error)
            return false
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        const cookieFallback = localStorage.getItem('cookieFallback')
        if(
            cookieFallback === "[]" ||
            cookieFallback === null ||
            cookieFallback === undefined
        ) {
            navigate('/sign-in')
        }
        checkAuthUser()

    }, [])
    
    const value = {
        user, setUser,
        isLoading, checkAuthUser,
        isAuthenticated, setIsAuthenticated
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export const useUserContext = () => useContext(AuthContext)
