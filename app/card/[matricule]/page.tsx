"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Wifi, WifiOff, Download, Shield, AlertCircle } from "lucide-react"

interface StudentData {
    id: number
    matricule: string
    first_name: string
    last_name: string
    email: string
    program: string
    academic_year: string
    expiration_date: string
    photo_url?: string
    is_active: boolean
    is_expired: boolean
}

interface CardData {
    student: StudentData
    qr_code_base64: string
    signature: string
    card_url: string
    is_expired: boolean
    message: string
}

export default function StudentCardPage() {
    const params = useParams()
    const matricule = params.matricule as string

    const [cardData, setCardData] = useState<CardData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isOnline, setIsOnline] = useState(true)
    const [installPrompt, setInstallPrompt] = useState<any>(null)

    // Détecter le statut en ligne/hors ligne
    useEffect(() => {
        const handleOnline = () => setIsOnline(true)
        const handleOffline = () => setIsOnline(false)

        setIsOnline(navigator.onLine)
        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)

        return () => {
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOffline)
        }
    }, [])

    // Capturer l'événement d'installation PWA
    useEffect(() => {
        const handler = (e: Event) => {
            e.preventDefault()
            setInstallPrompt(e)
        }

        window.addEventListener('beforeinstallprompt', handler)

        return () => window.removeEventListener('beforeinstallprompt', handler)
    }, [])

    // Charger les données de la carte
    useEffect(() => {
        if (!matricule) return

        const fetchCard = async () => {
            try {
                const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://student-card-backend-production.up.railway.app"
                const response = await fetch(`${API_URL}/api/v1/cards/students/${matricule}/secure-card`)

                if (!response.ok) {
                    throw new Error("Carte non trouvée")
                }

                const data: CardData = await response.json()
                setCardData(data)

                // Mettre en cache pour le mode offline
                localStorage.setItem(`card_${matricule}`, JSON.stringify(data))

            } catch (err) {
                console.error("Erreur chargement carte:", err)

                // Essayer de charger depuis le cache
                const cached = localStorage.getItem(`card_${matricule}`)
                if (cached) {
                    setCardData(JSON.parse(cached))
                    setIsOnline(false)
                } else {
                    setError("Impossible de charger la carte")
                }
            } finally {
                setLoading(false)
            }
        }

        fetchCard()
    }, [matricule])

    // Fonction d'installation PWA
    const handleInstall = async () => {
        if (!installPrompt) return

        installPrompt.prompt()
        const { outcome } = await installPrompt.userChoice

        if (outcome === 'accepted') {
            setInstallPrompt(null)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#003057] to-[#0066a1] flex items-center justify-center p-4">
                <div className="text-center text-white">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
                    <p className="text-lg">Chargement de votre carte...</p>
                </div>
            </div>
        )
    }

    if (error || !cardData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#003057] to-[#0066a1] flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl p-8 max-w-md text-center shadow-2xl">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Erreur</h1>
                    <p className="text-gray-600">{error || "Carte introuvable"}</p>
                </div>
            </div>
        )
    }

    const { student, qr_code_base64, is_expired } = cardData

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#003057] to-[#0066a1] flex items-center justify-center p-4">
            {/* Container principal */}
            <div className="w-full max-w-2xl">
                {/* Header avec statut */}
                <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-white text-sm shadow-lg">
                        {isOnline ? (
                            <>
                                <Wifi className="w-4 h-4" />
                                <span>En ligne</span>
                            </>
                        ) : (
                            <>
                                <WifiOff className="w-4 h-4" />
                                <span>Hors ligne</span>
                            </>
                        )}
                    </div>

                    {installPrompt && (
                        <button
                            onClick={handleInstall}
                            className="flex items-center gap-2 bg-white text-[#003057] px-4 py-2 rounded-full font-medium hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl hover:scale-105"
                        >
                            <Download className="w-4 h-4" />
                            <span>Installer</span>
                        </button>
                    )}
                </div>

                {/* Carte étudiante */}
                <div
                    className="rounded-2xl shadow-2xl overflow-hidden"
                    style={{
                        background: "linear-gradient(135deg, #003057 0%, #0066a1 50%, #003057 100%)",
                        aspectRatio: "1.586 / 1",
                    }}
                >
                    <div className="h-full p-6 text-white relative">
                        {/* HEADER */}
                        <div className="flex justify-between items-start mb-6">
                            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg shadow-md">
                                <img src="/Logo-esi.png" alt="HE2B ESI" className="h-12 w-auto" />
                            </div>
                            <div className="text-right">
                                <div
                                    className="px-5 py-2 rounded-bl-3xl rounded-tr-3xl"
                                    style={{ background: "rgba(0,0,0,0.35)" }}
                                >
                                    <p className="text-lg font-bold uppercase tracking-wide">Carte Étudiant</p>
                                    <p className="text-sm font-semibold">{student.academic_year}</p>
                                </div>
                            </div>
                        </div>

                        {/* CORPS */}
                        <div className="flex items-start justify-between gap-4">
                            {/* Photo + Matricule */}
                            <div className="flex flex-col items-start gap-2">
                                {student.photo_url ? (
                                    <div className="w-28 h-32 rounded-xl overflow-hidden border-2 border-white/40 shadow-lg bg-white">
                                        <img
                                            src={student.photo_url}
                                            alt={`${student.first_name} ${student.last_name}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-28 h-32 rounded-xl bg-white/20 border-2 border-white/40 flex items-center justify-center">
                                        <div className="text-center">
                                            <div className="text-4xl mb-1">
                                                {student.first_name[0]}{student.last_name[0]}
                                            </div>
                                            <div className="text-xs opacity-75">Photo</div>
                                        </div>
                                    </div>
                                )}
                                <div className="text-xl font-bold tracking-widest text-white px-3 py-1 rounded-md shadow bg-black/20">
                                    {student.matricule}
                                </div>
                            </div>

                            {/* Nom */}
                            <div className="flex-1 flex flex-col justify-center">
                                <h3 className="text-2xl font-bold leading-tight uppercase">
                                    {student.last_name}
                                </h3>
                                <h3 className="text-2xl font-bold leading-tight uppercase">
                                    {student.first_name}
                                </h3>
                            </div>

                            {/* QR Code sécurisé */}
                            <div className="flex-shrink-0">
                                <div className="bg-white p-2 rounded-lg shadow-lg">
                                    <img src={qr_code_base64} alt="QR Code Sécurisé" className="w-24 h-24" />
                                </div>
                                <div className="mt-2 flex items-center gap-1 justify-center bg-green-500/20 backdrop-blur-sm px-2 py-1 rounded-md">
                                    <Shield className="w-3 h-3" />
                                    <span className="text-[10px] font-semibold">Sécurisé</span>
                                </div>
                            </div>
                        </div>

                        {/* PIED */}
                        <div className="absolute left-6 right-6 bottom-6 flex items-end justify-between">
                            <div className="flex-1 text-center">
                                <p className="text-sm font-semibold">{student.program}</p>
                            </div>
                            <div className="flex flex-col items-end ml-4">
                                <p className="text-[10px] opacity-75 uppercase">Expire le</p>
                                <p className="text-sm font-bold">
                                    {new Date(student.expiration_date).toLocaleDateString("fr-FR")}
                                </p>
                                {is_expired && (
                                    <div className="mt-1 bg-red-600 px-3 py-1 rounded-md text-xs font-bold shadow-lg">
                                        EXPIRÉE
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Bande colorée */}
                        <div
                            className="absolute bottom-0 left-0 right-0 h-2"
                            style={{
                                background:
                                    "linear-gradient(90deg, #FFD700 0%, #FF69B4 25%, #87CEEB 50%, #98FB98 75%, #FFD700 100%)",
                            }}
                        />
                    </div>
                </div>

                {/* Note en bas */}
                {!isOnline && (
                    <div className="mt-4 bg-amber-500/20 backdrop-blur-md border border-amber-500/30 rounded-xl p-4 text-white text-sm text-center">
                        <p className="font-semibold">Mode hors ligne</p>
                        <p className="text-xs opacity-90 mt-1">Vous consultez la version en cache de votre carte</p>
                    </div>
                )}
            </div>
        </div>
    )
}