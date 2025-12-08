"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Smartphone, Download, CheckCircle, Share, Home, Chrome, Apple, AlertTriangle } from "lucide-react"

export default function InstallPage() {
    const [activeTab, setActiveTab] = useState<"android" | "ios">("android")

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#003057] to-[#0066a1] p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl mb-4">
                        <Download className="w-8 h-8 text-white" />
                        <h1 className="text-3xl font-bold text-white">Installer votre Carte</h1>
                    </div>
                    <p className="text-white/90 text-lg">
                        Suivez ces étapes pour ajouter votre carte étudiante à votre écran d'accueil
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-6">
                    <button
                        onClick={() => setActiveTab("android")}
                        className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                            activeTab === "android"
                                ? "bg-white text-[#003057] shadow-2xl scale-105"
                                : "bg-white/10 text-white hover:bg-white/20"
                        }`}
                    >
                        <Smartphone className="w-5 h-5" />
                        Android
                    </button>
                    <button
                        onClick={() => setActiveTab("ios")}
                        className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                            activeTab === "ios"
                                ? "bg-white text-[#003057] shadow-2xl scale-105"
                                : "bg-white/10 text-white hover:bg-white/20"
                        }`}
                    >
                        <Apple className="w-5 h-5" />
                        iOS (iPhone/iPad)
                    </button>
                </div>

                {/* Instructions Android */}
                {activeTab === "android" && (
                    <div className="space-y-4">
                        <Card className="p-6 bg-white/95 backdrop-blur-xl shadow-2xl">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold flex-shrink-0">
                                    1
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Ouvrir avec Chrome</h3>
                                    <p className="text-gray-600 mb-4">
                                        Assurez-vous d'ouvrir le lien de votre carte avec <strong>Google Chrome</strong> (navigateur recommandé)
                                    </p>
                                    <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                                        <Chrome className="w-5 h-5 text-blue-600" />
                                        <span className="text-sm text-blue-900">Utilisez Google Chrome pour la meilleure expérience</span>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6 bg-white/95 backdrop-blur-xl shadow-2xl">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold flex-shrink-0">
                                    2
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Cliquer sur "Installer"</h3>
                                    <p className="text-gray-600 mb-4">
                                        Une bannière apparaîtra en bas de l'écran avec un bouton <strong>"Installer"</strong> ou <strong>"Ajouter à l'écran d'accueil"</strong>
                                    </p>
                                    <div className="p-4 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300">
                                        <div className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-md">
                                            <Download className="w-6 h-6 text-primary" />
                                            <div className="flex-1">
                                                <p className="text-sm font-semibold text-gray-900">Installer Carte HE2B</p>
                                                <p className="text-xs text-gray-500">Ajouter à l'écran d'accueil</p>
                                            </div>
                                            <button className="px-4 py-2 bg-primary text-white rounded-lg font-medium text-sm">
                                                Installer
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6 bg-white/95 backdrop-blur-xl shadow-2xl">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold flex-shrink-0">
                                    3
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Confirmer l'installation</h3>
                                    <p className="text-gray-600 mb-4">
                                        Validez l'installation dans la popup qui s'affiche
                                    </p>
                                    <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                        <span className="text-sm text-green-900">L'icône apparaîtra sur votre écran d'accueil !</span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}

                {/* Instructions iOS */}
                {activeTab === "ios" && (
                    <div className="space-y-4">
                        <Card className="p-6 bg-white/95 backdrop-blur-xl shadow-2xl">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold flex-shrink-0">
                                    1
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Ouvrir avec Safari</h3>
                                    <p className="text-gray-600 mb-4">
                                        ⚠️ <strong>IMPORTANT :</strong> Sur iOS, vous <strong>DEVEZ</strong> utiliser <strong>Safari</strong> (pas Chrome)
                                    </p>
                                    <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg border border-orange-200">
                                        <AlertTriangle className="w-5 h-5 text-orange-600" />
                                        <span className="text-sm text-orange-900">Chrome ne supporte pas l'installation sur iOS</span>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6 bg-white/95 backdrop-blur-xl shadow-2xl">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold flex-shrink-0">
                                    2
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Appuyer sur "Partager"</h3>
                                    <p className="text-gray-600 mb-4">
                                        Cliquez sur le bouton <strong>Partager</strong> en bas de Safari (icône carré avec flèche vers le haut)
                                    </p>
                                    <div className="p-4 bg-gray-100 rounded-xl flex justify-center">
                                        <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center shadow-xl">
                                            <Share className="w-8 h-8 text-white" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6 bg-white/95 backdrop-blur-xl shadow-2xl">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold flex-shrink-0">
                                    3
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Sélectionner "Sur l'écran d'accueil"</h3>
                                    <p className="text-gray-600 mb-4">
                                        Dans le menu qui s'affiche, faites défiler et choisissez <strong>"Sur l'écran d'accueil"</strong>
                                    </p>
                                    <div className="p-4 bg-gray-100 rounded-xl">
                                        <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-md">
                                            <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                                                <Home className="w-6 h-6 text-gray-600" />
                                            </div>
                                            <span className="font-semibold text-gray-900">Sur l'écran d'accueil</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6 bg-white/95 backdrop-blur-xl shadow-2xl">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold flex-shrink-0">
                                    4
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Confirmer avec "Ajouter"</h3>
                                    <p className="text-gray-600 mb-4">
                                        Cliquez sur <strong>"Ajouter"</strong> en haut à droite pour finaliser l'installation
                                    </p>
                                    <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                        <span className="text-sm text-green-900">Votre carte est maintenant sur votre écran d'accueil !</span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}

                {/* Footer */}
                <Card className="mt-6 p-6 bg-white/90 backdrop-blur-xl">
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-gray-900">
                        <Smartphone className="w-5 h-5 text-primary" />
                        Avantages de l'installation
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span>Accès rapide depuis votre écran d'accueil comme une vraie application</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span>Fonctionne hors ligne - consultez votre carte même sans internet</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span>QR code toujours disponible pour accéder aux services de l'école</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span>Sécurisé avec signature cryptographique anti-falsification</span>
                        </li>
                    </ul>
                </Card>
            </div>
        </div>
    )
}