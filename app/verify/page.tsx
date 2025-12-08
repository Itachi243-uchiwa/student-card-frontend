"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import {QrCode, CheckCircle, XCircle, AlertTriangle, Camera, User, Scan} from "lucide-react"
import { Html5QrcodeScanner } from "html5-qrcode"
import {Card} from "@/components/ui/card";

interface VerifyResult {
    valid: boolean
    message: string
    student: any | null
}

export default function VerifyPage() {
    const { token, isAuthenticated } = useAuth()
    const router = useRouter()
    const [scanning, setScanning] = useState(false)
    const [result, setResult] = useState<VerifyResult | null>(null)
    const [scanner, setScanner] = useState<Html5QrcodeScanner | null>(null)

    // Protéger la route - réservée au personnel
    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/login")
        }
    }, [isAuthenticated, router])

    // Initialiser le scanner
    useEffect(() => {
        if (!scanning) return

        const config = {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            rememberLastUsedCamera: true,
        }

        const html5QrCodeScanner = new Html5QrcodeScanner(
            "qr-reader",
            config,
            false
        )

        html5QrCodeScanner.render(onScanSuccess, onScanError)
        setScanner(html5QrCodeScanner)

        return () => {
            if (html5QrCodeScanner) {
                html5QrCodeScanner.clear().catch(console.error)
            }
        }
    }, [scanning])

    const onScanSuccess = async (decodedText: string) => {
        console.log("QR scanné:", decodedText)

        // Arrêter le scanner
        if (scanner) {
            await scanner.clear()
            setScanning(false)
        }

        // Vérifier le QR code
        await verifyQRCode(decodedText)
    }

    const onScanError = (error: string) => {
        // Ignorer les erreurs de scan normales
        if (!error.includes("NotFoundException")) {
            console.warn("Erreur scan:", error)
        }
    }

    const verifyQRCode = async (qrContent: string) => {
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
            const response = await fetch(`${API_URL}/api/v1/cards/verify`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ qr_content: qrContent }),
            })

            if (!response.ok) {
                throw new Error("Erreur de vérification")
            }

            const data: VerifyResult = await response.json()
            setResult(data)

            // Log le scan
            console.log("Résultat vérification:", data)

        } catch (error) {
            console.error("Erreur vérification:", error)
            setResult({
                valid: false,
                message: "❌ Erreur lors de la vérification",
                student: null,
            })
        }
    }

    const startScanning = () => {
        setResult(null)
        setScanning(true)
    }

    const stopScanning = () => {
        if (scanner) {
            scanner.clear().catch(console.error)
        }
        setScanning(false)
    }

    if (!isAuthenticated) {
        return null
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8 text-center">
                    <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl mb-4">
                        <QrCode className="w-8 h-8 text-white" />
                        <h1 className="text-3xl font-bold text-white">Vérification de Carte</h1>
                    </div>
                    <p className="text-white/80">Scannez le QR code pour vérifier l'authenticité</p>
                </div>

                {/* Zone de scan */}
                <Card className="p-6 bg-white/95 backdrop-blur-xl shadow-2xl mb-6">
                    {!scanning && !result && (
                        <div className="text-center py-12">
                            <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl">
                                <Camera className="w-16 h-16 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Prêt à scanner</h2>
                            <p className="text-gray-600 mb-6">
                                Cliquez sur le bouton pour activer la caméra
                            </p>
                            <button
                                onClick={startScanning}
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl transition-all hover:scale-105"
                            >
                                <Scan className="w-5 h-5" />
                                Démarrer le scan
                            </button>
                        </div>
                    )}

                    {scanning && (
                        <div>
                            <div id="qr-reader" className="rounded-lg overflow-hidden"></div>
                            <button
                                onClick={stopScanning}
                                className="mt-4 w-full bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition-all"
                            >
                                Arrêter le scan
                            </button>
                        </div>
                    )}

                    {/* Résultat */}
                    {result && (
                        <div className="space-y-4">
                            {/* Message de résultat */}
                            <div
                                className={`p-6 rounded-xl flex items-center gap-4 ${
                                    result.valid
                                        ? "bg-green-50 border-2 border-green-500"
                                        : "bg-red-50 border-2 border-red-500"
                                }`}
                            >
                                {result.valid ? (
                                    <CheckCircle className="w-12 h-12 text-green-500 flex-shrink-0" />
                                ) : (
                                    <XCircle className="w-12 h-12 text-red-500 flex-shrink-0" />
                                )}
                                <div>
                                    <h3 className={`text-xl font-bold ${result.valid ? "text-green-900" : "text-red-900"}`}>
                                        {result.message}
                                    </h3>
                                </div>
                            </div>

                            {/* Infos étudiant si valide */}
                            {result.student && (
                                <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                                    <div className="flex items-start gap-4">
                                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                                            {result.student.first_name[0]}{result.student.last_name[0]}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-xl font-bold text-gray-900 mb-1">
                                                {result.student.first_name} {result.student.last_name}
                                            </h4>
                                            <div className="grid grid-cols-2 gap-3 text-sm">
                                                <div>
                                                    <p className="text-gray-500">Matricule</p>
                                                    <p className="font-semibold text-gray-900">{result.student.matricule}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500">Programme</p>
                                                    <p className="font-semibold text-gray-900">{result.student.program}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500">Email</p>
                                                    <p className="font-semibold text-gray-900">{result.student.email}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500">Année</p>
                                                    <p className="font-semibold text-gray-900">{result.student.academic_year}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Bouton nouveau scan */}
                            <button
                                onClick={startScanning}
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl transition-all hover:scale-105"
                            >
                                Scanner une autre carte
                            </button>
                        </div>
                    )}
                </Card>

                {/* Informations */}
                <Card className="p-6 bg-white/90 backdrop-blur-xl">
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-gray-900">
                        <AlertTriangle className="w-5 h-5 text-amber-500" />
                        Informations importantes
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                            <span className="text-blue-600 font-bold">•</span>
                            <span>Chaque QR code contient une signature cryptographique unique</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-600 font-bold">•</span>
                            <span>Les cartes falsifiées sont immédiatement détectées</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-600 font-bold">•</span>
                            <span>Les cartes expirées sont signalées même si authentiques</span>
                        </li>
                    </ul>
                </Card>
            </div>
        </div>
    )
}