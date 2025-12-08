"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, Lock, AlertCircle, Sparkles, GraduationCap } from "lucide-react"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const { login } = useAuth()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            await login(email, password)
            router.push("/dashboard")
        } catch (err) {
            setError(err instanceof Error ? err.message : "Login failed")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-background relative overflow-hidden">
            {/* Animated background gradients */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute w-[500px] h-[500px] bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl -top-40 -left-40 animate-float"></div>
                <div className="absolute w-[500px] h-[500px] bg-secondary/20 rounded-full mix-blend-multiply filter blur-3xl -bottom-40 -right-40 animate-float" style={{ animationDelay: '2s' }}></div>
                <div className="absolute w-[500px] h-[500px] bg-accent-blue/20 rounded-full mix-blend-multiply filter blur-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-float" style={{ animationDelay: '4s' }}></div>
            </div>

            <div className="w-full max-w-md relative z-10 px-4">
                {/* Logo and branding */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent-blue shadow-2xl shadow-primary/40 mb-6 animate-pulse-glow">
                        <GraduationCap className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent-blue bg-clip-text text-transparent mb-2 animate-gradient">
                        Student Cards
                    </h1>
                    <p className="text-muted-foreground flex items-center justify-center gap-2">
                        <Sparkles className="w-4 h-4 text-accent-blue" />
                        Gestion des cartes étudiantes numériques
                    </p>
                </div>

                {/* Login card */}
                <div className="bg-card/80 backdrop-blur-xl rounded-2xl border border-border/60 p-8 shadow-2xl shadow-primary/10 hover:shadow-primary/20 transition-all duration-300">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium mb-2 flex items-center gap-2 text-foreground">
                                <Mail className="w-4 h-4 text-primary" />
                                Email
                            </label>
                            <div className="relative">
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@university.edu"
                                    required
                                    className="bg-card/50 border-border/60 focus:border-primary/60 transition-all pl-4 py-6 text-base"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium mb-2 flex items-center gap-2 text-foreground">
                                <Lock className="w-4 h-4 text-secondary" />
                                Mot de passe
                            </label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="bg-card/50 border-border/60 focus:border-secondary/60 transition-all pl-4 py-6 text-base"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="bg-destructive/10 border border-destructive/30 text-destructive text-sm p-4 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                <span>{error}</span>
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full py-6 text-base font-semibold bg-gradient-to-r from-primary via-secondary to-accent-blue hover:from-primary/90 hover:via-secondary/90 hover:to-accent-blue/90 shadow-xl shadow-primary/30 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/40"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Connexion...
                </span>
                            ) : (
                                "Se connecter"
                            )}
                        </Button>
                    </form>

                    {/* Additional info */}
                    <div className="mt-6 pt-6 border-t border-border/40">
                        <p className="text-center text-sm text-muted-foreground">
                            Connectez-vous avec vos identifiants institutionnels
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-8 text-sm text-muted-foreground">
                    <p className="flex items-center justify-center gap-2">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse shadow-lg shadow-accent-green/50"></span>
                        Plateforme sécurisée
                    </p>
                </div>
            </div>
        </div>
    )
}