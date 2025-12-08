"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { Button } from "./ui/button"
import { LogOut, Bell } from "lucide-react"

export function DashboardHeader() {
    const { user, logout } = useAuth()
    const router = useRouter()

    const handleLogout = () => {
        logout()
        router.push("/login")
    }

    return (
        <header className="border-b border-border/60 bg-card/80 backdrop-blur-xl sticky top-0 z-40 shadow-lg shadow-primary/5">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent-blue bg-clip-text text-transparent animate-gradient">
                        Student Cards Platform
                    </h1>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        Bienvenue, <span className="text-foreground font-medium">{user?.full_name}</span>
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="relative p-2.5 hover:bg-primary/10 rounded-xl transition-all duration-300 hover:scale-110 group">
                        <Bell className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-gradient-to-r from-accent-orange to-accent-pink rounded-full animate-pulse shadow-lg shadow-accent-orange/50"></span>
                    </button>
                    <Button
                        onClick={handleLogout}
                        variant="outline"
                        className="gap-2 hover:scale-105 transition-all duration-300 bg-card/50 border-border/60 hover:border-primary/50 hover:bg-primary/10 hover:text-primary hover:shadow-lg hover:shadow-primary/20"
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
                    </Button>
                </div>
            </div>
        </header>
    )
}