"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { apiCall } from "./api-client"

interface User {
    id: number
    email: string
    full_name: string
    role: "ADMIN" | "STAFF"
    is_active: boolean
}

interface AuthContextType {
    user: User | null
    token: string | null
    loading: boolean
    login: (email: string, password: string) => Promise<void>
    logout: () => void
    isAuthenticated: boolean
}

interface LoginResponse {
    access_token: string
    token_type: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const storedToken = localStorage.getItem("token")
        const storedUser = localStorage.getItem("user")
        if (storedToken && storedUser) {
            setToken(storedToken)
            setUser(JSON.parse(storedUser))
        }
        setLoading(false)
    }, [])

    const login = async (email: string, password: string) => {
        // Créer form-data au lieu de JSON
        const formData = new URLSearchParams()
        formData.append('username', email)  // OAuth2 utilise "username"
        formData.append('password', password)

        // Appel direct avec fetch au lieu de apiCall
        const response = await fetch("https://student-card-backend-production.up.railway.app/api/v1/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: formData.toString(),
        })

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.detail || "Login failed")
        }

        const data = (await response.json()) as LoginResponse

        setToken(data.access_token)
        localStorage.setItem("token", data.access_token)

        try {
            const userData = (await apiCall("/users/me", { token: data.access_token })) as User
            setUser(userData)
            localStorage.setItem("user", JSON.stringify(userData))
        } catch (error) {
            const tempUser: User = {
                id: 0,
                email: email,
                full_name: "User",
                role: "STAFF",
                is_active: true,
            }
            setUser(tempUser)
            localStorage.setItem("user", JSON.stringify(tempUser))
        }
    }

    const logout = () => {
        setUser(null)
        setToken(null)
        localStorage.removeItem("token")
        localStorage.removeItem("user")
    }

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) throw new Error("useAuth must be used within AuthProvider")
    return context
}