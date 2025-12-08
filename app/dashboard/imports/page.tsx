"use client"

import type React from "react"

import { useAuth } from "@/lib/auth-context"
import { useEffect, useState, useRef } from "react"
import { apiCall } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Upload, Download, FileText, CheckCircle2, XCircle, Clock, AlertCircle } from "lucide-react"

interface ImportJob {
    id: number
    filename: string
    status: string
    total_rows: number
    successful_rows: number
    failed_rows: number
    created_at: string
}

export default function ImportsPage() {
    const { token } = useAuth()
    const [jobs, setJobs] = useState<ImportJob[]>([])
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const [downloadingTemplate, setDownloadingTemplate] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (!token) return
        fetchJobs()
    }, [token])

    const fetchJobs = async () => {
        if (!token) return
        try {
            const data = await apiCall<ImportJob[]>("/imports/", { token })
            setJobs(data)
        } catch (error) {
            console.error("Failed to fetch imports:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleDownloadTemplate = async () => {
        if (!token) return
        setDownloadingTemplate(true)
        try {
            const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"
            const response = await fetch(`${API_BASE_URL}/imports/template/download`, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            })

            if (!response.ok) throw new Error("Download failed")

            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement("a")
            link.href = url
            link.download = "student_import_template.csv"
            link.click()
            window.URL.revokeObjectURL(url)
        } catch (error) {
            alert(`Error: ${error instanceof Error ? error.message : "Download failed"}`)
        } finally {
            setDownloadingTemplate(false)
        }
    }

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file || !token) return

        setUploading(true)
        try {
            const formData = new FormData()
            formData.append("file", file)

            const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"
            const response = await fetch(`${API_BASE_URL}/imports/upload-csv`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            })

            if (!response.ok) throw new Error("Upload failed")

            const result = await response.json()
            alert(`Import successful: ${result.successful_rows}/${result.total_rows} rows imported`)
            fetchJobs()
        } catch (error) {
            alert(`Error: ${error instanceof Error ? error.message : "Upload failed"}`)
        } finally {
            setUploading(false)
            if (fileInputRef.current) fileInputRef.current.value = ""
        }
    }

    return (
        <div className="space-y-6">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-accent-orange via-accent-pink to-accent-purple p-8 text-white shadow-2xl shadow-accent-orange/30">
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                            <Upload className="w-8 h-8" />
                        </div>
                        <h1 className="text-5xl font-bold drop-shadow-lg">CSV Import</h1>
                    </div>
                    <p className="text-white/90 text-lg">Importez vos données étudiantes en masse via fichier CSV</p>
                </div>
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl -top-40 -right-40 animate-float"></div>
                    <div className="absolute w-96 h-96 bg-accent-cyan rounded-full mix-blend-overlay filter blur-3xl -bottom-40 -left-40 animate-float" style={{ animationDelay: '2s' }}></div>
                </div>
            </div>

            <Card className="p-8 bg-card/80 backdrop-blur-xl border-border/60 shadow-xl hover:shadow-2xl hover:shadow-accent-orange/10 transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-gradient-to-br from-accent-orange/20 to-accent-pink/20 rounded-xl">
                        <FileText className="w-6 h-6 text-accent-orange" />
                    </div>
                    <h2 className="text-2xl font-semibold bg-gradient-to-r from-accent-orange to-accent-pink bg-clip-text text-transparent">
                        Télécharger des étudiants
                    </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="group p-8 rounded-xl border-2 border-dashed border-border/60 hover:border-accent-orange/50 bg-card/50 hover:bg-accent-orange/5 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center gap-4"
                    >
                        <input ref={fileInputRef} type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
                        <div className="p-4 bg-gradient-to-br from-accent-orange/20 to-accent-pink/20 rounded-2xl group-hover:from-accent-orange/30 group-hover:to-accent-pink/30 transition-all duration-300 group-hover:scale-110">
                            <Upload className="w-12 h-12 text-accent-orange" />
                        </div>
                        <div className="text-center">
                            <p className="font-semibold text-foreground mb-1">
                                {uploading ? "Téléchargement en cours..." : "Choisir un fichier CSV"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Cliquez pour sélectionner un fichier
                            </p>
                        </div>
                    </div>

                    <div
                        onClick={handleDownloadTemplate}
                        className="group p-8 rounded-xl border-2 border-border/60 bg-card/50 hover:border-accent-blue/50 hover:bg-accent-blue/5 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center gap-4"
                    >
                        <div className="p-4 bg-gradient-to-br from-accent-blue/20 to-primary/20 rounded-2xl group-hover:from-accent-blue/30 group-hover:to-primary/30 transition-all duration-300 group-hover:scale-110">
                            <Download className="w-12 h-12 text-accent-blue" />
                        </div>
                        <div className="text-center">
                            <p className="font-semibold text-foreground mb-1">
                                {downloadingTemplate ? "Téléchargement..." : "Télécharger le modèle"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Format CSV requis
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-6 p-4 rounded-xl bg-accent-blue/5 border border-accent-blue/20">
                    <p className="text-xs text-muted-foreground flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-accent-blue flex-shrink-0 mt-0.5" />
                        <span>
              Téléchargez d'abord le modèle pour voir le format CSV requis avant de télécharger vos données.
            </span>
                    </p>
                </div>
            </Card>

            <Card className="p-6 bg-card/80 backdrop-blur-xl border-border/60 shadow-xl hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl">
                        <Clock className="w-6 h-6 text-primary" />
                    </div>
                    <h2 className="text-2xl font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        Historique d'imports
                    </h2>
                </div>

                {loading ? (
                    <p className="text-center text-muted-foreground py-8">Chargement...</p>
                ) : jobs.length === 0 ? (
                    <div className="text-center py-12 bg-muted/20 rounded-xl border border-dashed border-border/60">
                        <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                        <p className="text-muted-foreground">Aucun import pour le moment</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {jobs.map((job) => (
                            <div
                                key={job.id}
                                className="p-5 bg-muted/40 rounded-xl hover:bg-muted/60 transition-all duration-300 hover:scale-105 border border-transparent hover:border-primary/20 shadow-md"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <FileText className="w-4 h-4 text-primary" />
                                            <p className="font-semibold text-foreground">{job.filename}</p>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            {new Date(job.created_at).toLocaleString('fr-FR', {
                                                day: '2-digit',
                                                month: 'long',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                    <span
                                        className={`flex items-center gap-2 text-xs px-4 py-2 rounded-full font-medium shadow-lg ${
                                            job.status === "COMPLETED"
                                                ? "bg-accent-green/20 text-accent-green shadow-accent-green/20"
                                                : job.status === "FAILED"
                                                    ? "bg-destructive/20 text-destructive shadow-destructive/20"
                                                    : "bg-accent-orange/20 text-accent-orange shadow-accent-orange/20"
                                        }`}
                                    >
                    {job.status === "COMPLETED" ? (
                        <CheckCircle2 className="w-4 h-4" />
                    ) : job.status === "FAILED" ? (
                        <XCircle className="w-4 h-4" />
                    ) : (
                        <Clock className="w-4 h-4" />
                    )}
                                        {job.status}
                  </span>
                                </div>
                                <div className="flex gap-6 text-sm pt-3 border-t border-border/40">
                  <span className="flex items-center gap-2">
                    <span className="text-muted-foreground">Total:</span>
                    <span className="font-semibold text-foreground">{job.total_rows}</span>
                  </span>
                                    <span className="flex items-center gap-2">
                    <span className="text-muted-foreground">Réussis:</span>
                    <span className="font-semibold text-accent-green">{job.successful_rows}</span>
                  </span>
                                    {job.failed_rows > 0 && (
                                        <span className="flex items-center gap-2">
                      <span className="text-muted-foreground">Échecs:</span>
                      <span className="font-semibold text-destructive">{job.failed_rows}</span>
                    </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Card>
        </div>
    )
}