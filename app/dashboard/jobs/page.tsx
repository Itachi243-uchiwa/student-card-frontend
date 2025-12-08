"use client"

import { useAuth } from "@/lib/auth-context"
import { useEffect, useState } from "react"
import { apiCall } from "@/lib/api-client"
import { Card } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { Zap, CheckCircle2, XCircle, Clock, Calendar, Smartphone, Apple } from "lucide-react"

interface GenerationJob {
    id: number
    job_type: string
    provider: string
    status: string
    created_at: string
    completed_at?: string
    filter_criteria?: Record<string, unknown>
}

export default function JobsPage() {
    const { token } = useAuth()
    const [jobs, setJobs] = useState<GenerationJob[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!token) return

        const fetchJobs = async () => {
            try {
                const data = await apiCall<GenerationJob[]>("/jobs/", { token })
                setJobs(data)
            } catch (error) {
                console.error("Failed to fetch jobs:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchJobs()

        const interval = setInterval(() => {
            fetchJobs()
        }, 3000)

        return () => clearInterval(interval)
    }, [token])

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <Spinner />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary via-accent-purple to-secondary p-8 text-white shadow-2xl shadow-primary/30">
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl animate-pulse-glow">
                            <Zap className="w-8 h-8" />
                        </div>
                        <h1 className="text-5xl font-bold drop-shadow-lg">Generation Jobs</h1>
                    </div>
                    <p className="text-white/90 text-lg">Suivez l'état de vos tâches de génération en temps réel</p>
                </div>
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl -top-40 -right-40 animate-float"></div>
                    <div className="absolute w-96 h-96 bg-accent-cyan rounded-full mix-blend-overlay filter blur-3xl -bottom-40 -left-40 animate-float" style={{ animationDelay: '2s' }}></div>
                </div>
            </div>

            {jobs.length === 0 ? (
                <Card className="p-12 text-center bg-card/80 backdrop-blur-xl border-border/60 shadow-xl">
                    <div className="max-w-md mx-auto">
                        <div className="p-4 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                            <Zap className="w-10 h-10 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">Aucune tâche de génération</h3>
                        <p className="text-muted-foreground">
                            Les tâches de génération apparaîtront ici une fois lancées
                        </p>
                    </div>
                </Card>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {jobs.map((job) => {
                        const isCompleted = job.status === "COMPLETED"
                        const isFailed = job.status === "FAILED"
                        const isPending = !isCompleted && !isFailed

                        return (
                            <Card
                                key={job.id}
                                className="p-6 bg-card/80 backdrop-blur-xl border-border/60 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group"
                            >
                                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                                    isCompleted
                                        ? "bg-gradient-to-br from-accent-green/5 to-transparent"
                                        : isFailed
                                            ? "bg-gradient-to-br from-destructive/5 to-transparent"
                                            : "bg-gradient-to-br from-accent-orange/5 to-transparent"
                                }`}></div>

                                <div className="flex items-start justify-between relative z-10">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className={`p-2.5 rounded-xl ${
                                                job.provider === "APPLE"
                                                    ? "bg-gradient-to-br from-primary/20 to-accent-blue/20"
                                                    : "bg-gradient-to-br from-accent-green/20 to-accent-blue/20"
                                            }`}>
                                                {job.provider === "APPLE" ? (
                                                    <Apple className="w-5 h-5 text-primary" />
                                                ) : (
                                                    <Smartphone className="w-5 h-5 text-accent-green" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-lg text-foreground">
                                                    {job.job_type} - {job.provider}
                                                </p>
                                                <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3 h-3" />
                            Démarré: {new Date(job.created_at).toLocaleString('fr-FR', {
                              day: '2-digit',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                          })}
                          </span>
                                                    {job.completed_at && (
                                                        <span className="flex items-center gap-1.5">
                              <CheckCircle2 className="w-3 h-3" />
                              Terminé: {new Date(job.completed_at).toLocaleString('fr-FR', {
                                                            day: '2-digit',
                                                            month: 'short',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                            </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {job.filter_criteria && Object.keys(job.filter_criteria).length > 0 && (
                                            <div className="mt-3 p-3 rounded-lg bg-muted/40 border border-border/40">
                                                <p className="text-xs text-muted-foreground mb-1">Critères de filtrage:</p>
                                                <p className="text-sm font-medium text-foreground">
                                                    {JSON.stringify(job.filter_criteria)}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <span
                                        className={`flex items-center gap-2 text-sm px-4 py-2 rounded-full font-medium shadow-lg whitespace-nowrap ml-4 ${
                                            isCompleted
                                                ? "bg-accent-green/20 text-accent-green shadow-accent-green/20"
                                                : isFailed
                                                    ? "bg-destructive/20 text-destructive shadow-destructive/20"
                                                    : "bg-accent-orange/20 text-accent-orange shadow-accent-orange/20 animate-pulse"
                                        }`}
                                    >
                    {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4" />
                    ) : isFailed ? (
                        <XCircle className="w-4 h-4" />
                    ) : (
                        <Clock className="w-4 h-4 animate-spin" />
                    )}
                                        {job.status}
                  </span>
                                </div>
                            </Card>
                        )
                    })}
                </div>
            )}

            <Card className="p-6 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent-blue/5 border border-border/60 backdrop-blur-xl">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-lg shadow-primary/50"></div>
                    <h3 className="font-semibold text-foreground">Mise à jour automatique</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                    Cette page se rafraîchit automatiquement toutes les 3 secondes pour afficher l'état en temps réel de vos tâches de génération.
                </p>
            </Card>
        </div>
    )
}