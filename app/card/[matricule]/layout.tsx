"use client"

import { useEffect } from "react"

export default function CardLayout({
                                       children,
                                       params,
                                   }: {
    children: React.ReactNode
    params: { matricule: string }
}) {
    // ✅ Injection dynamique du manifest avec meilleure vérification
    useEffect(() => {
        const matricule = params?.matricule

        if (!matricule || matricule === 'undefined') {
            console.warn('[PWA] Matricule invalide, manifest non chargé')
            return
        }

        console.log(`[PWA] Chargement manifest pour ${matricule}`)

        // Supprimer l'ancien manifest s'il existe
        const oldManifest = document.querySelector('link[rel="manifest"]')
        if (oldManifest) {
            oldManifest.remove()
            console.log('[PWA] Ancien manifest supprimé')
        }

        // Ajouter le nouveau manifest dynamique
        const manifestLink = document.createElement('link')
        manifestLink.rel = 'manifest'
        manifestLink.href = `/card/${matricule}/manifest.json`
        document.head.appendChild(manifestLink)
        console.log(`[PWA] Nouveau manifest ajouté : ${manifestLink.href}`)

        // Mettre à jour le titre de la page
        document.title = `Ma Carte Étudiant ${matricule}`

        // Cleanup : supprimer le manifest au démontage
        return () => {
            const currentManifest = document.querySelector(`link[rel="manifest"][href="/card/${matricule}/manifest.json"]`)
            if (currentManifest) {
                currentManifest.remove()
                console.log('[PWA] Manifest nettoyé')
            }
        }
    }, [params?.matricule])

    return <>{children}</>
}