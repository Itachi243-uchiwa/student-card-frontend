"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Smartphone, Download, CheckCircle, Share, Home, Chrome, Apple, AlertTriangle } from "lucide-react"

export default function InstallPage() {
    const [activeTab, setActiveTab] = useState<"android" | "ios">("android")

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#003057] to-[#0066a1] p-3 sm:p-4 md:p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header - Responsive */}
                <div className="text-center mb-6 sm:mb-8">
                    <div className="inline-flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-md px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl mb-3 sm:mb-4">
                        <Download className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">Installer votre Carte</h1>
                    </div>
                    <p className="text-white/90 text-sm sm:text-base md:text-lg px-4">
                        Suivez ces étapes pour ajouter votre carte étudiante à votre écran d'accueil
                    </p>
                </div>

                {/* Tabs - Responsive */}
                <div className="flex gap-2 sm:gap-4 mb-4 sm:mb-6">
                    <button
                        onClick={() => setActiveTab("android")}
                        className={`flex-1 py-3 sm:py-4 px-3 sm:px-6 rounded-lg sm:rounded-xl font-semibold transition-all flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm md:text-base ${
                            activeTab === "android"
                                ? "bg-white text-[#003057] shadow-2xl scale-105"
                                : "bg-white/10 text-white hover:bg-white/20"
                        }`}
                    >
                        <Smartphone className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="hidden xs:inline">Android</span>
                        <span className="xs:hidden">📱</span>
                    </button>
                    <button
                        onClick={() => setActiveTab("ios")}
                        className={`flex-1 py-3 sm:py-4 px-3 sm:px-6 rounded-lg sm:rounded-xl font-semibold transition-all flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm md:text-base ${
                            activeTab === "ios"
                                ? "bg-white text-[#003057] shadow-2xl scale-105"
                                : "bg-white/10 text-white hover:bg-white/20"
                        }`}
                    >
                        <Apple className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="hidden xs:inline">iOS</span>
                        <span className="xs:hidden">🍎</span>
                    </button>
                </div>

                {/* Instructions Android - Responsive */}
                {activeTab === "android" && (
                    <div className="space-y-3 sm:space-y-4">
                        <Card className="p-4 sm:p-6 bg-white/95 backdrop-blur-xl shadow-2xl">
                            <div className="flex items-start gap-3 sm:gap-4">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold flex-shrink-0 text-sm sm:text-base">
                                    1
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2">Ouvrir avec Chrome</h3>
                                    <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-3 sm:mb-4">
                                        Assurez-vous d'ouvrir le lien de votre carte avec <strong>Google Chrome</strong> (navigateur recommandé)
                                    </p>
                                    <div className="flex items-center gap-2 p-2 sm:p-3 bg-blue-50 rounded-lg">
                                        <Chrome className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
                                        <span className="text-xs sm:text-sm text-blue-900">Utilisez Google Chrome pour la meilleure expérience</span>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-4 sm:p-6 bg-white/95 backdrop-blur-xl shadow-2xl">
                            <div className="flex items-start gap-3 sm:gap-4">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold flex-shrink-0 text-sm sm:text-base">
                                    2
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2">Cliquer sur "Installer"</h3>
                                    <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-3 sm:mb-4">
                                        Une bannière apparaîtra en bas de l'écran avec un bouton <strong>"Installer"</strong> ou <strong>"Ajouter à l'écran d'accueil"</strong>
                                    </p>
                                    <div className="p-3 sm:p-4 bg-gray-100 rounded-lg sm:rounded-xl border-2 border-dashed border-gray-300 overflow-x-auto">
                                        <div className="flex items-center gap-2 sm:gap-3 bg-white p-2 sm:p-3 rounded-lg shadow-md min-w-[280px]">
                                            <Download className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">Installer Carte HE2B</p>
                                                <p className="text-[10px] sm:text-xs text-gray-500 truncate">Ajouter à l'écran d'accueil</p>
                                            </div>
                                            <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-primary text-white rounded-lg font-medium text-xs sm:text-sm flex-shrink-0">
                                                Installer
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-4 sm:p-6 bg-white/95 backdrop-blur-xl shadow-2xl">
                            <div className="flex items-start gap-3 sm:gap-4">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold flex-shrink-0 text-sm sm:text-base">
                                    3
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2">Confirmer l'installation</h3>
                                    <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-3 sm:mb-4">
                                        Validez l'installation dans la popup qui s'affiche
                                    </p>
                                    <div className="flex items-center gap-2 p-2 sm:p-3 bg-green-50 rounded-lg">
                                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                                        <span className="text-xs sm:text-sm text-green-900">L'icône apparaîtra sur votre écran d'accueil !</span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}

                {/* Instructions iOS - Responsive */}
                {activeTab === "ios" && (
                    <div className="space-y-3 sm:space-y-4">
                        <Card className="p-4 sm:p-6 bg-white/95 backdrop-blur-xl shadow-2xl">
                            <div className="flex items-start gap-3 sm:gap-4">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold flex-shrink-0 text-sm sm:text-base">
                                    1
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2">Ouvrir avec Safari</h3>
                                    <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-3 sm:mb-4">
                                        ⚠️ <strong>IMPORTANT :</strong> Sur iOS, vous <strong>DEVEZ</strong> utiliser <strong>Safari</strong> (pas Chrome)
                                    </p>
                                    <div className="flex items-start gap-2 p-2 sm:p-3 bg-orange-50 rounded-lg border border-orange-200">
                                        <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                                        <span className="text-xs sm:text-sm text-orange-900">Chrome ne supporte pas l'installation sur iOS</span>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-4 sm:p-6 bg-white/95 backdrop-blur-xl shadow-2xl">
                            <div className="flex items-start gap-3 sm:gap-4">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold flex-shrink-0 text-sm sm:text-base">
                                    2
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2">Appuyer sur "Partager"</h3>
                                    <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-3 sm:mb-4">
                                        Cliquez sur le bouton <strong>Partager</strong> en bas de Safari (icône carré avec flèche vers le haut)
                                    </p>
                                    <div className="p-3 sm:p-4 bg-gray-100 rounded-lg sm:rounded-xl flex justify-center">
                                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl">
                                            <Share className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-4 sm:p-6 bg-white/95 backdrop-blur-xl shadow-2xl">
                            <div className="flex items-start gap-3 sm:gap-4">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold flex-shrink-0 text-sm sm:text-base">
                                    3
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2">Sélectionner "Sur l'écran d'accueil"</h3>
                                    <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-3 sm:mb-4">
                                        Dans le menu qui s'affiche, faites défiler et choisissez <strong>"Sur l'écran d'accueil"</strong>
                                    </p>
                                    <div className="p-3 sm:p-4 bg-gray-100 rounded-lg sm:rounded-xl">
                                        <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-white rounded-lg shadow-md">
                                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <Home className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                                            </div>
                                            <span className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base">Sur l'écran d'accueil</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-4 sm:p-6 bg-white/95 backdrop-blur-xl shadow-2xl">
                            <div className="flex items-start gap-3 sm:gap-4">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold flex-shrink-0 text-sm sm:text-base">
                                    4
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2">Confirmer avec "Ajouter"</h3>
                                    <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-3 sm:mb-4">
                                        Cliquez sur <strong>"Ajouter"</strong> en haut à droite pour finaliser l'installation
                                    </p>
                                    <div className="flex items-center gap-2 p-2 sm:p-3 bg-green-50 rounded-lg">
                                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                                        <span className="text-xs sm:text-sm text-green-900">Votre carte est maintenant sur votre écran d'accueil !</span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}

                {/* Footer - Responsive */}
                <Card className="mt-4 sm:mt-6 p-4 sm:p-6 bg-white/90 backdrop-blur-xl">
                    <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4 flex items-center gap-2 text-gray-900">
                        <Smartphone className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                        <span>Avantages de l'installation</span>
                    </h3>
                    <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span>Accès rapide depuis votre écran d'accueil comme une vraie application</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span>Fonctionne hors ligne - consultez votre carte même sans internet</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span>QR code toujours disponible pour accéder aux services de l'école</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span>Sécurisé avec signature cryptographique anti-falsification</span>
                        </li>
                    </ul>
                </Card>
            </div>
        </div>
    )
}