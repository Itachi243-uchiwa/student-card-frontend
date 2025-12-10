"use client"

import { useEffect } from "react"
import { useParams } from "next/navigation"

export default function CardLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    // 1. On utilise le hook useParams qui est plus fiable dans les Client Components
    const params = useParams()
    const matricule = params?.matricule as string

    useEffect(() => {
        // 2. Sécurité stricte : Si pas de matricule ou s'il vaut littéralement "undefined", on arrête tout.
        if (!matricule || matricule === 'undefined' || matricule === 'null') {
            return
        }

        console.log(`[PWA] Chargement manifest pour ${matricule}`)

        // Supprimer l'ancien manifest s'il existe pour éviter les conflits
        const oldManifest = document.querySelector('link[rel="manifest"]')
        if (oldManifest) {
            oldManifest.remove()
        }

        // Ajouter le nouveau manifest
        const manifestLink = document.createElement('link')
        manifestLink.rel = 'manifest'
        manifestLink.href = `/card/${matricule}/manifest.json`
        document.head.appendChild(manifestLink)

        // Mettre à jour le titre
        document.title = `Ma Carte Étudiant ${matricule}`

        return () => {
            // Nettoyage au démontage
            if (document.head.contains(manifestLink)) {
                document.head.removeChild(manifestLink)
            }
        }
    }, [matricule]) // Dépendance sur la variable récupérée par le hook

    return <>{children}</>
}