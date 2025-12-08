"use client"

import type { Metadata } from "next"
import { useEffect } from "react"

// Note: Le metadata ne fonctionne pas dans les composants client
// Il faudra utiliser next/head ou une approche différente

export default function CardLayout({
                                       children,
                                       params,
                                   }: {
    children: React.ReactNode
    params: { matricule: string }
}) {
    // Injection dynamique du manifest spécifique à cette carte
    useEffect(() => {
        const matricule = params.matricule

        // Supprimer l'ancien manifest s'il existe
        const oldManifest = document.querySelector('link[rel="manifest"]')
        if (oldManifest) {
            oldManifest.remove()
        }

        // Ajouter le nouveau manifest dynamique
        const manifestLink = document.createElement('link')
        manifestLink.rel = 'manifest'
        manifestLink.href = `/card/${matricule}/manifest.json`
        document.head.appendChild(manifestLink)

        // Mettre à jour le titre de la page
        document.title = `Ma Carte Étudiant ${matricule}`

        // Cleanup : supprimer le manifest au démontage
        return () => {
            const currentManifest = document.querySelector(`link[rel="manifest"][href="/card/${matricule}/manifest.json"]`)
            if (currentManifest) {
                currentManifest.remove()
            }
        }
    }, [params.matricule])

    // Pas de header, pas de sidebar, juste la carte
    return <>{children}</>
}