"use client"

import { useAuth } from "@/lib/auth-context"
import { useEffect, useState } from "react"
import { apiCall } from "@/lib/api-client"
import { Card } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { TrendingUp, Users, Zap, BarChart3, AlertTriangle, CheckCircle2, Clock } from "lucide-react"

interface DashboardStats {
    students: {
        total: number
        active: number
        inactive: number
        expired: number
        expiring_soon: number
        new_this_month: number
    }
    programs: Array<{ name: string; count: number }>
    academic_years: Array<{ year: string; count: number }>
    recent_imports: Array<{
        id: number
        filename: string
        status: string
        created_at: string
        total_rows: number
        successful_rows: number
    }>
    recent_students: Array<{
        id: number
        matricule: string
        first_name: string
        last_name: string
        program: string
    }>
}

export default function DashboardPage() {
    const { token } = useAuth()
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!token) return

        const fetchStats = async () => {
            try {
                const data = await apiCall<DashboardStats>("/statistics/dashboard", { token })
                setStats(data)
            } catch (error) {
                console.error("Failed to fetch dashboard stats:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchStats()
    }, [token])

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <Spinner />
            </div>
        )
    }

    if (!stats) {
        return <div className="text-center text-muted-foreground py-12">Failed to load dashboard</div>
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary via-secondary to-accent-blue p-8 text-white shadow-2xl shadow-primary/30">
                <div className="relative z-10">
                    <h1 className="text-5xl font-bold mb-3 drop-shadow-lg">Dashboard</h1>
                    <p className="text-white/90 text-lg">Gestion des cartes étudiantes PWA sécurisées</p>
                </div>
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl -top-40 -right-40 animate-float"></div>
                    <div className="absolute w-96 h-96 bg-accent-cyan rounded-full mix-blend-overlay filter blur-3xl -bottom-40 -left-40 animate-float" style={{ animationDelay: '2s' }}></div>
                </div>
            </div>

            {/* Statistiques principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total étudiants */}
                <Card className="group rounded-2xl border border-border/60 bg-card/80 backdrop-blur-xl transition-all duration-300 hover:border-primary/60 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2 p-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="flex items-center justify-between relative z-10">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground mb-2">Total Étudiants</p>
                            <p className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                {stats.students.total}
                            </p>
                            <p className="text-xs text-muted-foreground mt-3">
                                <span className="text-accent-green font-semibold">{stats.students.active}</span> actifs
                            </p>
                        </div>
                        <div className="p-4 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl group-hover:from-primary/30 group-hover:to-secondary/30 transition-all duration-300 group-hover:scale-110 shadow-lg shadow-primary/20">
                            <Users className="w-7 h-7 text-primary" />
                        </div>
                    </div>
                </Card>

                {/* Cartes actives */}
                <Card className="group rounded-2xl border border-border/60 bg-card/80 backdrop-blur-xl transition-all duration-300 hover:border-accent-green/60 hover:shadow-2xl hover:shadow-accent-green/20 hover:-translate-y-2 p-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-accent-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="flex items-center justify-between relative z-10">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground mb-2">Cartes Valides</p>
                            <p className="text-5xl font-bold bg-gradient-to-r from-accent-green to-accent-blue bg-clip-text text-transparent">
                                {stats.students.active}
                            </p>
                            <p className="text-xs text-muted-foreground mt-3">
                                <span className="text-accent-orange font-semibold">{stats.students.expiring_soon}</span> expirent bientôt
                            </p>
                        </div>
                        <div className="p-4 bg-gradient-to-br from-accent-green/20 to-accent-blue/20 rounded-2xl group-hover:from-accent-green/30 group-hover:to-accent-blue/30 transition-all duration-300 group-hover:scale-110 shadow-lg shadow-accent-green/20">
                            <CheckCircle2 className="w-7 h-7 text-accent-green" />
                        </div>
                    </div>
                </Card>

                {/* Cartes expirées */}
                <Card className="group rounded-2xl border border-border/60 bg-card/80 backdrop-blur-xl transition-all duration-300 hover:border-destructive/60 hover:shadow-2xl hover:shadow-destructive/20 hover:-translate-y-2 p-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-destructive/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="flex items-center justify-between relative z-10">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground mb-2">Cartes Expirées</p>
                            <p className="text-5xl font-bold bg-gradient-to-r from-destructive to-accent-pink bg-clip-text text-transparent">
                                {stats.students.expired}
                            </p>
                            <p className="text-xs text-muted-foreground mt-3">À renouveler</p>
                        </div>
                        <div className="p-4 bg-gradient-to-br from-destructive/20 to-accent-pink/20 rounded-2xl group-hover:from-destructive/30 group-hover:to-accent-pink/30 transition-all duration-300 group-hover:scale-110 shadow-lg shadow-destructive/20">
                            <AlertTriangle className="w-7 h-7 text-destructive" />
                        </div>
                    </div>
                </Card>

                {/* Nouveaux ce mois */}
                <Card className="group rounded-2xl border border-border/60 bg-card/80 backdrop-blur-xl transition-all duration-300 hover:border-accent-blue/60 hover:shadow-2xl hover:shadow-accent-blue/20 hover:-translate-y-2 p-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="flex items-center justify-between relative z-10">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground mb-2">Nouveaux ce mois</p>
                            <p className="text-5xl font-bold bg-gradient-to-r from-accent-blue to-primary bg-clip-text text-transparent">
                                {stats.students.new_this_month}
                            </p>
                            <p className="text-xs text-muted-foreground mt-3">Créés récemment</p>
                        </div>
                        <div className="p-4 bg-gradient-to-br from-accent-blue/20 to-primary/20 rounded-2xl group-hover:from-accent-blue/30 group-hover:to-primary/30 transition-all duration-300 group-hover:scale-110 shadow-lg shadow-accent-blue/20">
                            <TrendingUp className="w-7 h-7 text-accent-blue" />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Graphiques et listes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Programmes */}
                <Card className="overflow-hidden rounded-2xl border border-border/60 bg-card/80 backdrop-blur-xl">
                    <div className="p-6 border-b border-border/60 bg-gradient-to-r from-primary/10 via-secondary/10 to-transparent">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-primary" />
                            Répartition par Programme
                        </h2>
                    </div>
                    <div className="p-6 space-y-3">
                        {stats.programs.slice(0, 5).map((prog, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-muted/40 hover:bg-muted/60 transition-all">
                                <span className="font-medium text-foreground">{prog.name}</span>
                                <span className="px-3 py-1 rounded-full bg-primary/20 text-primary font-bold text-sm">
                                    {prog.count}
                                </span>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Imports récents */}
                <Card className="overflow-hidden rounded-2xl border border-border/60 bg-card/80 backdrop-blur-xl">
                    <div className="p-6 border-b border-border/60 bg-gradient-to-r from-accent-green/10 via-accent-blue/10 to-transparent">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <Clock className="w-5 h-5 text-accent-green" />
                            Imports Récents
                        </h2>
                    </div>
                    <div className="p-6 space-y-3">
                        {stats.recent_imports.length > 0 ? (
                            stats.recent_imports.map((job) => (
                                <div
                                    key={job.id}
                                    className="flex items-center justify-between p-4 rounded-xl bg-muted/40 hover:bg-muted/60 transition-all"
                                >
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-foreground">{job.filename}</p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {job.successful_rows}/{job.total_rows} réussis
                                        </p>
                                    </div>
                                    <span
                                        className={`text-xs px-3 py-1.5 rounded-full font-medium ${
                                            job.status === "COMPLETED"
                                                ? "bg-accent-green/20 text-accent-green"
                                                : "bg-destructive/20 text-destructive"
                                        }`}
                                    >
                                        {job.status}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-muted-foreground py-8">Aucun import récent</p>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    )
}