"use client"

import { useAuth } from "@/lib/auth-context"
import { useEffect, useState } from "react"
import { apiCall } from "@/lib/api-client"
import { Card } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { Settings, User, Mail, Calendar, Shield, CheckCircle2, XCircle } from "lucide-react"

interface User {
    id: number
    email: string
    full_name: string
    role: string
    is_active: boolean
    created_at: string
}

export default function UsersPage() {
    const { token, user } = useAuth()
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!token || user?.role !== "ADMIN") return

        const fetchUsers = async () => {
            try {
                const data = await apiCall<User[]>("/users/", { token })
                setUsers(data)
            } catch (error) {
                console.error("Failed to fetch users:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchUsers()
    }, [token, user])

    if (user?.role !== "ADMIN") {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Card className="p-12 text-center bg-card/80 backdrop-blur-xl border-border/60 shadow-xl max-w-md">
                    <div className="p-4 bg-gradient-to-br from-destructive/20 to-destructive/10 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                        <Shield className="w-10 h-10 text-destructive" />
                    </div>
                    <h3 className="text-2xl font-semibold text-foreground mb-2">Accès refusé</h3>
                    <p className="text-muted-foreground">
                        Vous devez être administrateur pour accéder à cette page
                    </p>
                </Card>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <Spinner />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-accent-purple via-primary to-accent-blue p-8 text-white shadow-2xl shadow-accent-purple/30">
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                            <Settings className="w-8 h-8" />
                        </div>
                        <h1 className="text-5xl font-bold drop-shadow-lg">User Management</h1>
                    </div>
                    <p className="text-white/90 text-lg">Gérez les utilisateurs et leurs permissions</p>
                </div>
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl -top-40 -right-40 animate-float"></div>
                    <div className="absolute w-96 h-96 bg-accent-cyan rounded-full mix-blend-overlay filter blur-3xl -bottom-40 -left-40 animate-float" style={{ animationDelay: '2s' }}></div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {users.map((u) => (
                    <Card
                        key={u.id}
                        className="p-6 bg-card/80 backdrop-blur-xl border-border/60 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-2 group relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                        <div className="relative z-10">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent-blue flex items-center justify-center shadow-lg shadow-primary/30">
                    <span className="text-white font-bold text-lg">
                      {u.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                    </span>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                                            {u.full_name}
                                        </p>
                                        <span
                                            className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium mt-1 ${
                                                u.role === "ADMIN"
                                                    ? "bg-accent-purple/20 text-accent-purple"
                                                    : "bg-primary/20 text-primary"
                                            }`}
                                        >
                      <Shield className="w-3 h-3" />
                                            {u.role}
                    </span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/40 hover:bg-muted/60 transition-colors">
                                    <Mail className="w-4 h-4 text-accent-blue flex-shrink-0" />
                                    <span className="text-sm text-muted-foreground truncate">{u.email}</span>
                                </div>

                                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/40 hover:bg-muted/60 transition-colors">
                                    <Calendar className="w-4 h-4 text-accent-green flex-shrink-0" />
                                    <div className="text-sm">
                                        <span className="text-muted-foreground">Créé le </span>
                                        <span className="text-foreground font-medium">
                      {new Date(u.created_at).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                      })}
                    </span>
                                    </div>
                                </div>

                                <div className="pt-3 border-t border-border/40">
                  <span
                      className={`inline-flex items-center gap-2 text-sm px-4 py-2 rounded-full font-medium shadow-lg w-full justify-center ${
                          u.is_active
                              ? "bg-accent-green/20 text-accent-green shadow-accent-green/20"
                              : "bg-destructive/20 text-destructive shadow-destructive/20"
                      }`}
                  >
                    {u.is_active ? (
                        <>
                            <CheckCircle2 className="w-4 h-4" />
                            Actif
                        </>
                    ) : (
                        <>
                            <XCircle className="w-4 h-4" />
                            Inactif
                        </>
                    )}
                  </span>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <Card className="p-6 bg-gradient-to-br from-accent-blue/5 via-primary/5 to-secondary/5 border border-border/60 backdrop-blur-xl">
                <div className="flex items-center gap-2 mb-4">
                    <User className="w-5 h-5 text-accent-blue" />
                    <h3 className="font-semibold text-foreground">Informations</h3>
                </div>
                <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-start gap-3 p-3 rounded-lg bg-card/50 hover:bg-card/70 transition-all">
                        <span className="text-accent-purple font-bold">•</span>
                        <span>Les administrateurs ont accès à toutes les fonctionnalités de la plateforme</span>
                    </li>
                    <li className="flex items-start gap-3 p-3 rounded-lg bg-card/50 hover:bg-card/70 transition-all">
                        <span className="text-primary font-bold">•</span>
                        <span>Les membres du staff peuvent gérer les étudiants et générer des passes</span>
                    </li>
                    <li className="flex items-start gap-3 p-3 rounded-lg bg-card/50 hover:bg-card/70 transition-all">
                        <span className="text-accent-green font-bold">•</span>
                        <span>Seuls les utilisateurs actifs peuvent se connecter à la plateforme</span>
                    </li>
                </ul>
            </Card>
        </div>
    )
}