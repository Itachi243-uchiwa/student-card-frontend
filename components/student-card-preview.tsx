"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"

interface StudentData {
    id: number
    matricule: string
    first_name: string
    last_name: string
    email: string
    program: string
    academic_year: string
    expiration_date: string
    phone?: string
    photo_url?: string
}

interface StudentCardPreviewProps {
    student: StudentData
    showQRCode?: boolean
    qrCodeUrl?: string
}

export function StudentCardPreview({
                                       student,
                                       showQRCode = true,
                                       qrCodeUrl,
                                   }: StudentCardPreviewProps) {
    const [qrCode, setQrCode] = useState<string>(qrCodeUrl || "")
    const [loading, setLoading] = useState(!qrCodeUrl)

    useEffect(() => {
        if (qrCodeUrl) {
            setQrCode(qrCodeUrl)
            setLoading(false)
            return
        }

        const fetchQRCode = async () => {
            try {
                const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://student-card-backend-production.up.railway.app"
                const response = await fetch(
                    `${API_URL}/api/v1/cards/students/${student.matricule}/secure-card`
                )

                if (response.ok) {
                    const data = await response.json()
                    setQrCode(data.qr_code_base64)
                }
            } catch (error) {
                console.error("Erreur chargement QR code:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchQRCode()
    }, [student.matricule, qrCodeUrl])

    const expiryDate = new Date(student.expiration_date)
    const isExpired = expiryDate < new Date()

    return (
        <div className="w-full max-w-2xl mx-auto">
            {/* Carte style HE2B ESI - Responsive */}
            <div
                className={`rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden transition-all ${
                    isExpired ? "opacity-70" : ""
                }`}
                style={{
                    background:
                        "linear-gradient(135deg, #003057 0%, #0066a1 50%, #003057 100%)",
                    aspectRatio: "1.586 / 1",
                }}
            >
                <div className="h-full p-3 sm:p-4 md:p-5 text-white relative">
                    {/* HEADER : logo à gauche, bande "Carte étudiant" à droite - Responsive */}
                    <div className="flex justify-between items-start mb-3 sm:mb-4 relative z-10">
                        {/* Logo image */}
                        <div className="px-2 py-1 sm:px-3 sm:py-2 rounded-lg shadow-md flex items-center bg-white/10 backdrop-blur-sm">
                            <img
                                src="/Logo-esi.png"
                                alt="HE2B ESI"
                                className="h-8 sm:h-10 md:h-12 w-auto object-contain"
                            />
                        </div>

                        {/* Bande en haut à droite */}
                        <div className="relative">
                            <div
                                className="px-2 py-1 sm:px-3 sm:py-1.5 md:px-5 md:py-2 rounded-bl-2xl sm:rounded-bl-3xl rounded-tr-2xl sm:rounded-tr-3xl"
                                style={{
                                    background: "rgba(0,0,0,0.35)",
                                }}
                            >
                                <p className="text-xs sm:text-sm md:text-lg font-bold uppercase tracking-wide">
                                    Carte Étudiant
                                </p>
                                <p className="text-[10px] sm:text-xs md:text-sm font-semibold">
                                    {student.academic_year}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ZONE CENTRALE : photo à gauche, nom au centre, QR à droite - Responsive */}
                    <div className="flex items-start justify-between gap-2 sm:gap-3 md:gap-4 z-10">
                        {/* Colonne gauche : photo + matricule */}
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
                                            {student.first_name[0]}
                                            {student.last_name[0]}
                                        </div>
                                        <div className="text-[8px] sm:text-[10px] md:text-xs opacity-75">Photo</div>
                                    </div>
                                </div>
                            )}

                            {/* Matricule sous la photo */}
                            <div className="text-xs sm:text-sm md:text-xl font-bold tracking-widest text-white px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 rounded-md shadow">
                                {student.matricule}
                            </div>
                        </div>

                        {/* Colonne centrale : nom */}
                        <div className="flex-1 min-w-0 flex flex-col justify-center items-start">
                            <div className="mb-2 sm:mb-3 w-full">
                                <h3 className="text-sm sm:text-base md:text-xl font-bold leading-tight uppercase truncate">
                                    {student.last_name}
                                </h3>
                                <h3 className="text-sm sm:text-base md:text-xl font-bold leading-tight uppercase truncate">
                                    {student.first_name}
                                </h3>
                            </div>
                        </div>

                        {/* Colonne droite : QR code sécurisé */}
                        {showQRCode && (
                            <div className="flex-shrink-0 flex flex-col items-end">
                                <div className="bg-white p-1 sm:p-1.5 md:p-2 rounded-md sm:rounded-lg shadow-lg">
                                    {loading ? (
                                        <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 border-b-2 border-blue-600"></div>
                                        </div>
                                    ) : qrCode ? (
                                        <img
                                            src={qrCode}
                                            alt="QR Code Sécurisé"
                                            className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20"
                                        />
                                    ) : (
                                        <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gray-200 flex items-center justify-center text-[10px] sm:text-xs text-gray-500">
                                            QR
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* PIED DE CARTE : programme centré, date à droite - Responsive */}
                    <div className="absolute left-3 right-3 sm:left-4 sm:right-4 md:left-5 md:right-5 bottom-3 sm:bottom-4 flex items-end justify-between z-10">
                        {/* Programme en bas centré */}
                        <div className="flex-1 text-center min-w-0">
                            <p className="text-[10px] sm:text-xs font-semibold tracking-wide truncate">
                                {student.program}
                            </p>
                        </div>

                        {/* Date d'expiration à droite */}
                        <div className="flex flex-col items-end ml-2 sm:ml-4 flex-shrink-0">
                            <p className="text-[8px] sm:text-[9px] md:text-[10px] opacity-75 uppercase tracking-wide">
                                Expire le
                            </p>
                            <p className="text-[10px] sm:text-xs md:text-sm font-bold whitespace-nowrap">
                                {expiryDate.toLocaleDateString("fr-FR", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                })}
                            </p>

                            {isExpired && (
                                <div className="mt-0.5 sm:mt-1 bg-red-600 px-2 sm:px-3 py-0.5 sm:py-1 rounded-md text-[8px] sm:text-xs font-bold shadow-lg">
                                    EXPIRÉ
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Bande colorée en bas */}
                    <div
                        className="absolute bottom-0 left-0 right-0 h-1 sm:h-1.5 md:h-2"
                        style={{
                            background:
                                "linear-gradient(90deg, #FFD700 0%, #FF69B4 25%, #87CEEB 50%, #98FB98 75%, #FFD700 100%)",
                        }}
                    />
                </div>
            </div>

            {/* Infos supplémentaires sous la carte - Responsive */}
            <Card className="mt-3 sm:mt-4 p-3 sm:p-4 space-y-2 sm:space-y-3 shadow-lg bg-card/80 backdrop-blur-xl">
                <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                        <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide mb-1">
                            Email
                        </p>
                        <p className="text-xs sm:text-sm font-medium truncate text-foreground">{student.email}</p>
                    </div>
                    <div>
                        <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide mb-1">
                            Téléphone
                        </p>
                        <p className="text-xs sm:text-sm font-medium text-foreground">
                            {student.phone || "Non renseigné"}
                        </p>
                    </div>
                </div>

                <div className="pt-2 border-t border-border/40">
                    <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide mb-1">
                        Programme
                    </p>
                    <p className="text-xs sm:text-sm font-medium text-foreground break-words">{student.program}</p>
                </div>
            </Card>
        </div>
    )
}