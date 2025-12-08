"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Wifi, WifiOff, Download, AlertCircle, Share } from "lucide-react"

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
    // ✅ FIX: Meilleure gestion du matricule
    const matricule = (params?.matricule as string) || null

    const [cardData, setCardData] = useState<CardData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isOnline, setIsOnline] = useState(true)

    // PWA States
    const [installPrompt, setInstallPrompt] = useState<any>(null)
    const [isStandalone, setIsStandalone] = useState(false)
    const [isIOS, setIsIOS] = useState(false)

    // ✅ Vérification du matricule au chargement
    useEffect(() => {
        if (!matricule || matricule === 'undefined') {
            setError("Matricule invalide ou manquant dans l'URL")
            setLoading(false)
        }
    }, [matricule])

    // Détection du statut en ligne/hors ligne et environnement
    useEffect(() => {
        const handleOnline = () => setIsOnline(true)
        const handleOffline = () => setIsOnline(false)

        setIsOnline(navigator.onLine)
        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)

        // Détection iOS
        const userAgent = window.navigator.userAgent.toLowerCase()
        setIsIOS(/iphone|ipad|ipod/.test(userAgent))

        // Vérifier si déjà installé (mode standalone)
        const checkStandalone = () => {
            const isStand = window.matchMedia('(display-mode: standalone)').matches ||
                (window.navigator as any).standalone === true
            setIsStandalone(isStand)
        }

        checkStandalone()
        window.addEventListener('resize', checkStandalone)

        return () => {
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOffline)
            window.removeEventListener('resize', checkStandalone)
        }
    }, [])

    // ✅ Injection du manifest dynamique avec vérification
    useEffect(() => {
        if (!matricule || matricule === 'undefined') return

        // Supprimer l'ancien manifest s'il existe
        const existingManifest = document.querySelector('link[rel="manifest"]')
        if (existingManifest) {
            existingManifest.remove()
        }

        // Ajouter le manifest dynamique pour cette carte
        const manifestLink = document.createElement('link')
        manifestLink.rel = 'manifest'
        manifestLink.href = `/card/${matricule}/manifest.json`
        document.head.appendChild(manifestLink)

        console.log(`[PWA] Manifest chargé : /card/${matricule}/manifest.json`)

        return () => {
            manifestLink.remove()
        }
    }, [matricule])

    // Capturer l'événement d'installation PWA (Android/Desktop)
    useEffect(() => {
        const handler = (e: Event) => {
            e.preventDefault()
            setInstallPrompt(e)
            console.log('[PWA] Installation prompt capturé')
        }
        window.addEventListener('beforeinstallprompt', handler)
        return () => window.removeEventListener('beforeinstallprompt', handler)
    }, [])

    // ✅ Charger les données de la carte avec meilleure gestion d'erreur
    useEffect(() => {
        if (!matricule || matricule === 'undefined') return

        const fetchCard = async () => {
            try {
                console.log(`[API] Chargement carte pour matricule: ${matricule}`)

                const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://student-card-backend-production.up.railway.app"
                const url = `${API_URL}/api/v1/cards/students/${matricule}/secure-card`

                console.log(`[API] URL complète: ${url}`)

                const response = await fetch(url)

                if (!response.ok) {
                    const errorText = await response.text()
                    console.error(`[API] Erreur ${response.status}:`, errorText)
                    throw new Error(`Carte non trouvée (${response.status})`)
                }

                const data: CardData = await response.json()
                console.log('[API] Carte chargée avec succès:', data.student.matricule)

                setCardData(data)
                localStorage.setItem(`card_${matricule}`, JSON.stringify(data))

            } catch (err) {
                console.error("[API] Erreur chargement carte:", err)

                // Essayer le cache local
                const cached = localStorage.getItem(`card_${matricule}`)
                if (cached) {
                    console.log('[Cache] Utilisation du cache local')
                    setCardData(JSON.parse(cached))
                    setIsOnline(false)
                } else {
                    setError(`Impossible de charger la carte pour le matricule ${matricule}`)
                }
            } finally {
                setLoading(false)
            }
        }

        fetchCard()
    }, [matricule])

    // Gestion installation
    const handleInstall = async () => {
        // Cas 1 : Android/Chrome avec event
        if (installPrompt) {
            try {
                installPrompt.prompt()
                const { outcome } = await installPrompt.userChoice
                console.log(`[PWA] Installation ${outcome}`)
                if (outcome === 'accepted') {
                    setInstallPrompt(null)
                }
            } catch (err) {
                console.error('[PWA] Erreur installation:', err)
            }
            return
        }

        // Cas 2 : iOS ou Navigateur sans support auto
        if (isIOS) {
            alert("Pour installer sur iPhone :\n\n1. Appuyez sur le bouton Partager (carré avec flèche ⎋) en bas\n2. Défilez vers le bas\n3. Sélectionnez 'Sur l'écran d'accueil' ⊞\n4. Appuyez sur 'Ajouter'")
        } else {
            alert("Pour installer l'application :\n\n1. Ouvrez le menu de votre navigateur (⋮)\n2. Cherchez 'Installer l'application' ou 'Ajouter à l'écran d'accueil'\n3. Confirmez l'installation")
        }
    }

    // ✅ Affichage conditionnel selon l'état
    if (!matricule || matricule === 'undefined') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#003057] to-[#0066a1] flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center shadow-xl">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h1 className="text-xl font-bold text-gray-900 mb-2">URL Invalide</h1>
                    <p className="text-gray-600">Le lien de la carte est incorrect ou incomplet.</p>
                    <p className="text-sm text-gray-500 mt-4">Format attendu : /card/63888</p>
                </div>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#003057] to-[#0066a1] flex items-center justify-center p-4">
                <div className="text-center text-white">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                    <p className="text-lg">Chargement de votre carte...</p>
                    <p className="text-sm opacity-75 mt-2">Matricule : {matricule}</p>
                </div>
            </div>
        )
    }

    if (error || !cardData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#003057] to-[#0066a1] flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center shadow-xl">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h1 className="text-xl font-bold text-gray-900 mb-2">Erreur</h1>
                    <p className="text-gray-600 mb-4">{error || "Carte introuvable"}</p>
                    <div className="bg-gray-100 rounded-lg p-3 text-sm text-left">
                        <p className="text-gray-700"><strong>Matricule :</strong> {matricule}</p>
                        <p className="text-gray-700"><strong>Statut :</strong> {isOnline ? '✅ En ligne' : '❌ Hors ligne'}</p>
                    </div>
                </div>
            </div>
        )
    }

    const { student, qr_code_base64, is_expired } = cardData

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#003057] to-[#0066a1] flex flex-col items-center justify-center p-4 md:p-6 font-sans">

            <div className="w-full max-w-[600px] space-y-4 md:space-y-6">

                {/* Barre d'outils mobile */}
                <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
                    {/* Indicateur Statut */}
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium shadow-lg backdrop-blur-md transition-colors w-full sm:w-auto justify-center ${
                        isOnline ? "bg-white/10 text-white" : "bg-amber-500/80 text-white"
                    }`}>
                        {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                        <span>{isOnline ? "Connecté" : "Hors ligne"}</span>
                    </div>

                    {/* Bouton Installer (Visible seulement si pas installé) */}
                    {!isStandalone && (
                        <button
                            onClick={handleInstall}
                            className="flex items-center gap-2 bg-white text-[#003057] px-5 py-2 rounded-full font-bold text-xs sm:text-sm shadow-lg hover:shadow-xl active:scale-95 transition-all w-full sm:w-auto justify-center"
                        >
                            {isIOS ? <Share className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                            <span>Installer ma carte</span>
                        </button>
                    )}
                </div>

                {/* --- CARTE ÉTUDIANTE --- */}
                <div className="relative w-full aspect-[1.586/1] rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl transition-transform hover:scale-[1.01] duration-300">

                    {/* Fond de carte */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#003057] via-[#00558a] to-[#003057]" />

                    {/* Contenu de la carte */}
                    <div className="relative h-full flex flex-col p-[4%] text-white">

                        {/* En-tête */}
                        <div className="flex justify-between items-start mb-[2%]">
                            <div className="bg-white/15 backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-2 rounded-lg">
                                <img src="/Logo-esi.png" alt="HE2B ESI" className="h-6 sm:h-8 md:h-12 w-auto" />
                            </div>
                            <div className="text-right">
                                <div className="bg-black/30 backdrop-blur-sm px-3 py-1 rounded-bl-xl rounded-tr-xl">
                                    <p className="text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-wider text-gray-200">Carte Étudiant</p>
                                    <p className="text-[10px] sm:text-xs font-mono text-cyan-300">{student.academic_year}</p>
                                </div>
                            </div>
                        </div>

                        {/* Corps principal */}
                        <div className="flex-1 flex items-center gap-3 sm:gap-5">

                            {/* Photo Zone */}
                            <div className="flex flex-col gap-1 w-[24%] flex-shrink-0">
                                <div className="aspect-[3/4] rounded-lg overflow-hidden border-2 border-white/30 shadow-inner bg-black/20 relative">
                                    {student.photo_url ? (
                                        <img
                                            src={student.photo_url}
                                            alt="Student"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-white/50 text-[10px]">
                                            Sans photo
                                        </div>
                                    )}
                                </div>
                                <div className="bg-black/40 text-center rounded py-0.5 px-1">
                                    <span className="text-[10px] sm:text-xs md:text-sm font-mono font-bold tracking-widest block truncate">
                                        {student.matricule}
                                    </span>
                                </div>
                            </div>

                            {/* Info Zone */}
                            <div className="flex-1 min-w-0 flex flex-col justify-center gap-0.5 sm:gap-1">
                                <h2 className="text-sm sm:text-xl md:text-2xl font-bold uppercase leading-tight truncate">
                                    {student.last_name}
                                </h2>
                                <h2 className="text-sm sm:text-xl md:text-2xl font-normal capitalize leading-tight truncate text-gray-200">
                                    {student.first_name}
                                </h2>
                                <div className="mt-1 sm:mt-2 h-0.5 w-12 bg-cyan-400/50 rounded-full" />
                            </div>

                            {/* QR Code Zone */}
                            <div className="w-[20%] flex-shrink-0 flex flex-col items-center justify-center">
                                <div className="bg-white p-1 sm:p-1.5 rounded-lg shadow-lg w-full aspect-square">
                                    <img src={qr_code_base64} alt="QR" className="w-full h-full object-contain" />
                                </div>
                            </div>
                        </div>

                        {/* Pied de carte */}
                        <div className="mt-auto pt-2 flex items-end justify-between border-t border-white/10">
                            <div className="flex-1 mr-4">
                                <p className="text-[8px] sm:text-[10px] text-gray-300 uppercase tracking-wider">Programme</p>
                                <p className="text-[10px] sm:text-sm font-semibold truncate leading-tight">{student.program}</p>
                            </div>
                            <div className="text-right flex-shrink-0">
                                <p className="text-[8px] sm:text-[10px] text-gray-300 uppercase tracking-wider">Validité</p>
                                <div className="flex items-center gap-2 justify-end">
                                    <p className="text-[10px] sm:text-sm font-bold font-mono">
                                        {new Date(student.expiration_date).toLocaleDateString("fr-FR")}
                                    </p>
                                    {is_expired && (
                                        <span className="bg-red-500 text-white text-[8px] sm:text-[10px] px-1.5 py-0.5 rounded font-bold animate-pulse">
                                            EXP
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Bande holographique décorative bas */}
                        <div className="absolute bottom-0 left-0 right-0 h-1.5 sm:h-2 opacity-80"
                             style={{
                                 background: "linear-gradient(90deg, #fbbf24 0%, #f472b6 25%, #22d3ee 50%, #4ade80 75%, #fbbf24 100%)"
                             }}
                        />
                    </div>
                </div>

                {/* Instructions iOS (s'affiche seulement si on clique sur installer) */}
                {isIOS && !isStandalone && (
                    <div className="text-center text-white/80 text-xs sm:text-sm mt-2 px-4 bg-white/10 backdrop-blur-sm rounded-lg py-3">
                        💡 Pour un accès rapide, ajoutez cette carte à votre écran d'accueil
                    </div>
                )}
            </div>
        </div>
    )
}