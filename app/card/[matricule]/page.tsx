"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Wifi, WifiOff, Download, Shield, AlertCircle, Menu } from "lucide-react"

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
    const [showInstallPrompt, setShowInstallPrompt] = useState(false)

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
            setShowInstallPrompt(true)
        }

        window.addEventListener('beforeinstallprompt', handler)

        // Vérifier si déjà installé
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setShowInstallPrompt(false)
        }

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
        if (!installPrompt) {
            // Pour iOS Safari ou si pas de prompt
            alert("Pour installer :\n\n📱 iOS: Appuyez sur 'Partager' puis 'Sur l'écran d'accueil'\n\n🤖 Android: Utilisez le menu du navigateur et sélectionnez 'Installer l'application'")
            return
        }

        installPrompt.prompt()
        const { outcome } = await installPrompt.userChoice

        if (outcome === 'accepted') {
            setInstallPrompt(null)
            setShowInstallPrompt(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#003057] to-[#0066a1] flex items-center justify-center p-4">
                <div className="text-center text-white">
                    <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-white mx-auto mb-4"></div>
                    <p className="text-base sm:text-lg">Chargement de votre carte...</p>
                </div>
            </div>
        )
    }

    if (error || !cardData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#003057] to-[#0066a1] flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full text-center shadow-2xl">
                    <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-red-500 mx-auto mb-4" />
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Erreur</h1>
                    <p className="text-sm sm:text-base text-gray-600">{error || "Carte introuvable"}</p>
                </div>
            </div>
        )
    }

    const { student, qr_code_base64, is_expired } = cardData

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#003057] to-[#0066a1] flex items-center justify-center p-3 sm:p-4 md:p-6">
            {/* Container principal */}
            <div className="w-full max-w-2xl">
                {/* Header avec statut - Responsive */}
                <div className="mb-3 sm:mb-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-4">
                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 sm:px-4 py-2 rounded-full text-white text-xs sm:text-sm shadow-lg w-full sm:w-auto justify-center sm:justify-start">
                        {isOnline ? (
                            <>
                                <Wifi className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span>En ligne</span>
                            </>
                        ) : (
                            <>
                                <WifiOff className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span>Hors ligne</span>
                            </>
                        )}
                    </div>

                    {showInstallPrompt && (
                        <button
                            onClick={handleInstall}
                            className="flex items-center gap-2 bg-white text-[#003057] px-4 py-2.5 sm:py-2 rounded-full font-medium hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl hover:scale-105 w-full sm:w-auto justify-center text-sm sm:text-base"
                        >
                            <Download className="w-4 h-4" />
                            <span>Installer l'application</span>
                        </button>
                    )}
                </div>

                {/* Carte étudiante - Responsive */}
                <div
                    className="rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden"
                    style={{
                        background: "linear-gradient(135deg, #003057 0%, #0066a1 50%, #003057 100%)",
                        aspectRatio: "1.586 / 1",
                    }}
                >
                    <div className="h-full p-3 sm:p-4 md:p-6 text-white relative">
                        {/* HEADER - Responsive */}
                        <div className="flex justify-between items-start mb-3 sm:mb-4 md:mb-6">
                            <div className="bg-white/10 backdrop-blur-sm px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg shadow-md">
                                <img src="/Logo-esi.png" alt="HE2B ESI" className="h-8 sm:h-10 md:h-12 w-auto" />
                            </div>
                            <div className="text-right">
                                <div
                                    className="px-2 sm:px-3 md:px-5 py-1 sm:py-1.5 md:py-2 rounded-bl-2xl sm:rounded-bl-3xl rounded-tr-2xl sm:rounded-tr-3xl"
                                    style={{ background: "rgba(0,0,0,0.35)" }}
                                >
                                    <p className="text-xs sm:text-sm md:text-lg font-bold uppercase tracking-wide">Carte Étudiant</p>
                                    <p className="text-[10px] sm:text-xs md:text-sm font-semibold">{student.academic_year}</p>
                                </div>
                            </div>
                        </div>

                        {/* CORPS - Responsive */}
                        <div className="flex items-start justify-between gap-2 sm:gap-3 md:gap-4">
                            {/* Photo + Matricule */}
                            <div className="flex flex-col items-start gap-1 sm:gap-1.5 md:gap-2">
                                {student.photo_url ? (
                                    <div className="w-16 h-20 sm:w-20 sm:h-24 md:w-28 md:h-32 rounded-lg sm:rounded-xl overflow-hidden border border-white/40 sm:border-2 shadow-lg bg-white">
                                        <img
                                            src={student.photo_url}
                                            alt={`${student.first_name} ${student.last_name}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-16 h-20 sm:w-20 sm:h-24 md:w-28 md:h-32 rounded-lg sm:rounded-xl bg-white/20 border border-white/40 sm:border-2 flex items-center justify-center">
                                        <div className="text-center">
                                            <div className="text-xl sm:text-2xl md:text-4xl mb-0.5 sm:mb-1">
                                                {student.first_name[0]}{student.last_name[0]}
                                            </div>
                                            <div className="text-[8px] sm:text-[10px] md:text-xs opacity-75">Photo</div>
                                        </div>
                                    </div>
                                )}
                                <div className="text-xs sm:text-sm md:text-xl font-bold tracking-widest text-white px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 rounded-md shadow bg-black/20">
                                    {student.matricule}
                                </div>
                            </div>

                            {/* Nom - Responsive */}
                            <div className="flex-1 flex flex-col justify-center min-w-0">
                                <h3 className="text-sm sm:text-base md:text-xl lg:text-2xl font-bold leading-tight uppercase truncate">
                                    {student.last_name}
                                </h3>
                                <h3 className="text-sm sm:text-base md:text-xl lg:text-2xl font-bold leading-tight uppercase truncate">
                                    {student.first_name}
                                </h3>
                            </div>

                            {/* QR Code sécurisé - Responsive */}
                            <div className="flex-shrink-0">
                                <div className="bg-white p-1 sm:p-1.5 md:p-2 rounded-md sm:rounded-lg shadow-lg">
                                    <img src={qr_code_base64} alt="QR Code Sécurisé" className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24" />
                                </div>
                                <div className="mt-1 sm:mt-1.5 md:mt-2 flex items-center gap-0.5 sm:gap-1 justify-center bg-green-500/20 backdrop-blur-sm px-1 sm:px-1.5 md:px-2 py-0.5 sm:py-1 rounded-md">
                                    <Shield className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3" />
                                    <span className="text-[8px] sm:text-[9px] md:text-[10px] font-semibold">Sécurisé</span>
                                </div>
                            </div>
                        </div>

                        {/* PIED - Responsive */}
                        <div className="absolute left-3 right-3 sm:left-4 sm:right-4 md:left-6 md:right-6 bottom-3 sm:bottom-4 md:bottom-6 flex items-end justify-between gap-2">
                            <div className="flex-1 text-center min-w-0">
                                <p className="text-[10px] sm:text-xs md:text-sm font-semibold truncate">{student.program}</p>
                            </div>
                            <div className="flex flex-col items-end flex-shrink-0">
                                <p className="text-[8px] sm:text-[9px] md:text-[10px] opacity-75 uppercase">Expire le</p>
                                <p className="text-[10px] sm:text-xs md:text-sm font-bold whitespace-nowrap">
                                    {new Date(student.expiration_date).toLocaleDateString("fr-FR")}
                                </p>
                                {is_expired && (
                                    <div className="mt-0.5 sm:mt-1 bg-red-600 px-2 sm:px-3 py-0.5 sm:py-1 rounded-md text-[8px] sm:text-xs font-bold shadow-lg">
                                        EXPIRÉE
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Bande colorée */}
                        <div
                            className="absolute bottom-0 left-0 right-0 h-1 sm:h-1.5 md:h-2"
                            style={{
                                background:
                                    "linear-gradient(90deg, #FFD700 0%, #FF69B4 25%, #87CEEB 50%, #98FB98 75%, #FFD700 100%)",
                            }}
                        />
                    </div>
                </div>

                {/* Note en bas - Responsive */}
                {!isOnline && (
                    <div className="mt-3 sm:mt-4 bg-amber-500/20 backdrop-blur-md border border-amber-500/30 rounded-lg sm:rounded-xl p-3 sm:p-4 text-white text-xs sm:text-sm text-center">
                        <p className="font-semibold">Mode hors ligne</p>
                        <p className="text-[10px] sm:text-xs opacity-90 mt-1">Vous consultez la version en cache de votre carte</p>
                    </div>
                )}

                {/* Instructions d'installation - Responsive */}
                {showInstallPrompt && (
                    <div className="mt-3 sm:mt-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg sm:rounded-xl p-3 sm:p-4 text-white text-xs sm:text-sm">
                        <p className="font-semibold mb-2 flex items-center gap-2">
                            <Download className="w-4 h-4" />
                            Installer cette carte
                        </p>
                        <p className="opacity-90 text-[10px] sm:text-xs">
                            Ajoutez cette carte à votre écran d'accueil pour un accès rapide, même hors ligne !
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}