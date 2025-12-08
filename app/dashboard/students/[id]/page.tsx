"use client"

import { useAuth } from "@/lib/auth-context"
import { useEffect, useState } from "react"
import { apiCall } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useParams, useRouter } from "next/navigation"
import { Spinner } from "@/components/ui/spinner"
import { StudentCardPreview } from "@/components/student-card-preview"
import { ArrowLeft, Link2, Copy, QrCode, ExternalLink, Calendar, Mail, Hash, BookOpen, Phone, CheckCircle } from "lucide-react"

interface Student {
    id: number
    matricule: string
    first_name: string
    last_name: string
    email: string
    program: string
    academic_year: string
    phone?: string
    is_active: boolean
    expiration_date: string
    photo_url?: string
}

export default function StudentDetailPage() {
    const { token } = useAuth()
    const params = useParams()
    const router = useRouter()
    const studentId = params.id as string
    const [student, setStudent] = useState<Student | null>(null)
    const [loading, setLoading] = useState(true)
    const [cardLink, setCardLink] = useState<string>("")
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        if (!token || !studentId) return

        const fetchData = async () => {
            try {
                const studentData = await apiCall<Student>(`/students/${studentId}`, { token })
                setStudent(studentData)

                // Générer le lien de la carte PWA
                const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000"
                const link = `${FRONTEND_URL}/card/${studentData.matricule}`
                setCardLink(link)
            } catch (error) {
                console.error("Failed to fetch student:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [token, studentId])

    const copyLink = () => {
        navigator.clipboard.writeText(cardLink)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const openCard = () => {
        window.open(cardLink, '_blank')
    }

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <Spinner />
            </div>
        )
    }

    if (!student) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">Student not found</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <Button
                onClick={() => router.back()}
                variant="outline"
                className="flex items-center gap-2 hover:border-primary/50 hover:bg-primary/10 transition-all duration-300 hover:scale-105"
            >
                <ArrowLeft className="w-4 h-4" />
                Retour aux étudiants
            </Button>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Preview de la carte */}
                <Card className="p-6 bg-card/80 backdrop-blur-xl border-border/60 shadow-xl hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300">
                    <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-foreground">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-lg shadow-primary/50"></div>
                        Aperçu de la carte
                    </h2>
                    <StudentCardPreview student={student} showQRCode={true} />
                </Card>

                {/* Informations + Lien PWA */}
                <div className="space-y-6">
                    {/* Infos de l'étudiant */}
                    <Card className="p-6 bg-card/80 backdrop-blur-xl border-border/60 shadow-xl hover:shadow-2xl hover:shadow-secondary/10 transition-all duration-300">
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent-blue bg-clip-text text-transparent mb-2">
                                    {student.first_name} {student.last_name}
                                </h1>
                                <span
                                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium shadow-lg ${
                                        student.is_active
                                            ? "bg-accent-green/20 text-accent-green shadow-accent-green/20"
                                            : "bg-destructive/20 text-destructive shadow-destructive/20"
                                    }`}
                                >
                  {student.is_active ? "Actif" : "Inactif"}
                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 hover:bg-primary/10 transition-all duration-300">
                                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1.5">
                                    <Hash className="w-3 h-3" />
                                    Matricule
                                </p>
                                <p className="font-semibold text-foreground text-lg">{student.matricule}</p>
                            </div>
                            <div className="p-4 rounded-xl bg-secondary/5 border border-secondary/20 hover:bg-secondary/10 transition-all duration-300">
                                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1.5">
                                    <Calendar className="w-3 h-3" />
                                    Année
                                </p>
                                <p className="font-semibold text-foreground text-lg">{student.academic_year}</p>
                            </div>
                            <div className="p-4 rounded-xl bg-accent-green/5 border border-accent-green/20 hover:bg-accent-green/10 transition-all duration-300">
                                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1.5">
                                    <Mail className="w-3 h-3" />
                                    Email
                                </p>
                                <p className="font-semibold text-foreground text-sm truncate">{student.email}</p>
                            </div>
                            <div className="p-4 rounded-xl bg-accent-orange/5 border border-accent-orange/20 hover:bg-accent-orange/10 transition-all duration-300">
                                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1.5">
                                    <Phone className="w-3 h-3" />
                                    Téléphone
                                </p>
                                <p className="font-semibold text-foreground">{student.phone || "Non renseigné"}</p>
                            </div>
                        </div>

                        <div className="mt-4 p-4 rounded-xl bg-accent-blue/5 border border-accent-blue/20 hover:bg-accent-blue/10 transition-all duration-300">
                            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1.5">
                                <BookOpen className="w-3 h-3" />
                                Programme
                            </p>
                            <p className="font-semibold text-foreground">{student.program}</p>
                        </div>

                        <div className="mt-4 p-4 rounded-xl bg-accent-pink/5 border border-accent-pink/20 hover:bg-accent-pink/10 transition-all duration-300">
                            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1.5">
                                <Calendar className="w-3 h-3" />
                                Date d'expiration
                            </p>
                            <p className="font-semibold text-foreground">
                                {new Date(student.expiration_date).toLocaleDateString('fr-FR', {
                                    day: '2-digit',
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </p>
                        </div>
                    </Card>

                    {/* Lien de la carte PWA */}
                    <Card className="p-6 bg-gradient-to-br from-accent-green/10 via-accent-blue/10 to-primary/10 border border-accent-green/30 backdrop-blur-xl shadow-xl hover:shadow-2xl hover:shadow-accent-green/20 transition-all duration-300">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-foreground">
                            <div className="w-2 h-2 rounded-full bg-accent-green animate-pulse shadow-lg shadow-accent-green/50"></div>
                            Carte Numérique PWA
                        </h2>

                        <div className="space-y-4">
                            {/* Lien de la carte */}
                            <div className="p-4 bg-white/80 rounded-xl border border-accent-blue/30">
                                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1.5">
                                    <Link2 className="w-3 h-3" />
                                    Lien de la carte
                                </p>
                                <div className="flex items-center gap-2">
                                    <code className="flex-1 text-sm text-foreground font-mono bg-muted/50 px-3 py-2 rounded-lg truncate">
                                        {cardLink}
                                    </code>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={copyLink}
                                        className="hover:border-primary/50 hover:bg-primary/10 transition-all duration-300"
                                    >
                                        {copied ? (
                                            <>
                                                <CheckCircle className="w-4 h-4 mr-1 text-accent-green" />
                                                Copié
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="w-4 h-4 mr-1" />
                                                Copier
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>

                            {/* Boutons d'action */}
                            <div className="flex gap-3">
                                <Button
                                    onClick={openCard}
                                    className="flex-1 bg-gradient-to-r from-accent-green to-accent-blue hover:from-accent-green/90 hover:to-accent-blue/90 shadow-lg shadow-accent-green/30 transition-all duration-300 hover:scale-105"
                                >
                                    <ExternalLink className="w-4 h-4 mr-2" />
                                    Ouvrir la carte
                                </Button>
                            </div>

                            {/* Instructions */}
                            <div className="p-4 bg-accent-blue/10 rounded-xl border border-accent-blue/20">
                                <p className="text-xs text-muted-foreground flex items-start gap-2">
                                    <QrCode className="w-4 h-4 text-accent-blue flex-shrink-0 mt-0.5" />
                                    <span>
                                        Envoyez ce lien à l'étudiant par email ou SMS. Il pourra installer la carte comme une application sur son téléphone.
                                    </span>
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}