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
                const API_URL =
                    process.env.NEXT_PUBLIC_API_URL ||
                    "https://student-card-backend-production.up.railway.app"

                const response = await fetch(
                    `${API_URL}/api/v1/cards/students/${student.matricule}/secure-card`
                )

                if (response.ok) {
                    const data = await response.json()
                    setQrCode(data.qr_code_base64)
                }
            } catch (error) {
                console.error("Erreur QR code:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchQRCode()
    }, [student.matricule, qrCodeUrl])

    const expiryDate = new Date(student.expiration_date)
    const isExpired = expiryDate < new Date()

    return (
        <div className="w-full max-w-md mx-auto px-2 sm:px-0">

            {/* ---- CARTE ---- */}
            <div
                className={`rounded-xl shadow-xl overflow-hidden transition-all relative ${
                    isExpired ? "opacity-70" : ""
                }`}
                style={{
                    background:
                        "linear-gradient(135deg, #003057 0%, #0066a1 50%, #003057 100%)",
                    aspectRatio: "1 / 1.65",
                }}
            >
                <div className="h-full p-3 text-white relative flex flex-col">

                    {/* HEADER */}
                    <div className="flex items-start justify-between mb-2">
                        <img
                            src="/Logo-esi.png"
                            alt="HE2B ESI"
                            className="h-8 w-auto sm:h-10 md:h-12"
                        />

                        <div className="px-3 py-1 rounded-xl bg-black/30 text-right">
                            <p className="text-xs font-bold uppercase leading-tight">
                                Carte Étudiant
                            </p>
                            <p className="text-[10px] font-semibold">
                                {student.academic_year}
                            </p>
                        </div>
                    </div>

                    {/* ZONE CENTRALE */}
                    <div className="flex flex-1 items-start justify-between gap-2">

                        {/* PHOTO */}
                        <div className="flex flex-col items-start gap-1">
                            {student.photo_url ? (
                                <div className="w-16 h-20 sm:w-20 sm:h-24 md:w-24 md:h-28 rounded-lg overflow-hidden border border-white/40 bg-white shadow">
                                    <img
                                        src={student.photo_url}
                                        className="w-full h-full object-cover"
                                        alt={`${student.first_name} ${student.last_name}`}
                                    />
                                </div>
                            ) : (
                                <div className="w-16 h-20 sm:w-20 sm:h-24 rounded-lg bg-white/20 border border-white/40 flex items-center justify-center">
                                    <span className="text-xl font-bold">
                                        {student.first_name[0]}
                                        {student.last_name[0]}
                                    </span>
                                </div>
                            )}

                            <span className="text-xs sm:text-sm font-bold tracking-widest bg-white/20 px-2 py-1 rounded">
                                {student.matricule}
                            </span>
                        </div>

                        {/* NOM */}
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                            <p className="text-base sm:text-lg font-bold uppercase truncate">
                                {student.last_name}
                            </p>
                            <p className="text-base sm:text-lg font-bold uppercase truncate">
                                {student.first_name}
                            </p>
                        </div>

                        {/* QR CODE */}
                        {showQRCode && (
                            <div className="bg-white p-1 rounded-md shadow">
                                {loading ? (
                                    <div className="w-16 h-16 flex items-center justify-center">
                                        <div className="animate-spin h-6 w-6 rounded-full border-b-2 border-blue-600"></div>
                                    </div>
                                ) : qrCode ? (
                                    <img
                                        src={qrCode}
                                        alt="QR Code"
                                        className="w-16 h-16 object-contain"
                                    />
                                ) : (
                                    <div className="w-16 h-16 bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                                        QR
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* BAS DE CARTE */}
                    <div className="mt-auto pt-3 flex justify-between items-end">
                        <p className="text-[10px] sm:text-xs font-semibold truncate text-center flex-1">
                            {student.program}
                        </p>

                        <div className="text-right ml-2">
                            <p className="text-[9px] opacity-80 uppercase">
                                Expire le
                            </p>
                            <p className="text-xs font-bold">
                                {expiryDate.toLocaleDateString("fr-FR")}
                            </p>

                            {isExpired && (
                                <span className="mt-1 inline-block bg-red-600 px-2 py-0.5 rounded text-[10px] font-bold">
                                    EXPIRÉ
                                </span>
                            )}
                        </div>
                    </div>

                    {/* BARRE COLORÉE */}
                    <div
                        className="absolute bottom-0 left-0 right-0 h-1"
                        style={{
                            background:
                                "linear-gradient(90deg, #FFD700, #FF69B4, #87CEEB, #98FB98, #FFD700)",
                        }}
                    />
                </div>
            </div>

            {/* ---- INFOS ---- */}
            <Card className="mt-4 p-4 space-y-3 shadow bg-card/70 backdrop-blur">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <p className="text-[10px] uppercase opacity-60 mb-1">
                            Email
                        </p>
                        <p className="text-sm font-medium truncate">
                            {student.email}
                        </p>
                    </div>

                    <div>
                        <p className="text-[10px] uppercase opacity-60 mb-1">
                            Téléphone
                        </p>
                        <p className="text-sm font-medium">
                            {student.phone || "Non renseigné"}
                        </p>
                    </div>
                </div>

                <div className="pt-2 border-t border-border/40">
                    <p className="text-[10px] uppercase opacity-60 mb-1">
                        Programme
                    </p>
                    <p className="text-sm font-medium break-words">
                        {student.program}
                    </p>
                </div>
            </Card>
        </div>
    )
}
