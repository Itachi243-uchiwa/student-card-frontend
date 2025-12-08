"use client"

import { useState, useEffect, useRef } from "react"
import { apiCall } from "@/lib/api-client"
import { useAuth } from "@/lib/auth-context"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import Link from "next/link"
import { Plus, Upload, X, Camera, Save, Eye, User, Hash, Mail, BookOpen, Calendar, Search, Filter } from "lucide-react"

interface Student {
    id: number
    matricule: string
    first_name: string
    last_name: string
    email: string
    program: string
    academic_year: string
    is_active: boolean
    photo_url?: string
    expiration_date: string
}

export default function StudentsPage() {
    const { token } = useAuth()
    const [students, setStudents] = useState<Student[]>([])
    const [programs, setPrograms] = useState<string[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [filterProgram, setFilterProgram] = useState("")
    const [filterActive, setFilterActive] = useState<boolean | null>(null)

    const [showAddForm, setShowAddForm] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [photoPreview, setPhotoPreview] = useState<string | null>(null)
    const [showPreview, setShowPreview] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [formData, setFormData] = useState({
        matricule: '',
        first_name: '',
        last_name: '',
        email: '',
        program: '',
        academic_year: '',
        expiration_date: '',
        photo_url: null as string | null
    })

    useEffect(() => {
        if (!token) return

        const fetchData = async () => {
            try {
                let url = "/students/"
                const params = new URLSearchParams()
                if (search) params.append("search", search)
                if (filterProgram) params.append("program", filterProgram)
                if (filterActive !== null) params.append("is_active", filterActive.toString())
                if (params.toString()) url += `?${params.toString()}`

                const data = await apiCall<Student[]>(url, { token, method: "GET" })
                setStudents(data)

                const programsData = await apiCall<{ programs: string[] }>("/students/programs/list", { token })
                setPrograms(programsData.programs || [])
            } catch (error) {
                console.error("Failed to fetch students:", error)
            } finally {
                setLoading(false)
            }
        }

        const timer = setTimeout(() => {
            fetchData()
        }, 300)

        return () => clearTimeout(timer)
    }, [token, search, filterProgram, filterActive])

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (!file.type.startsWith('image/')) {
            alert('Veuillez sélectionner une image')
            return
        }

        const reader = new FileReader()
        reader.onloadend = () => {
            setPhotoPreview(reader.result as string)
        }
        reader.readAsDataURL(file)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    const handleSubmit = async () => {
        if (!token) return
        setIsSubmitting(true)

        try {
            const studentData = {
                ...formData,
                photo_url: photoPreview
            }

            const newStudent = await apiCall<Student>("/students/", {
                token,
                method: "POST",
                body: JSON.stringify(studentData)
            })

            alert('Étudiant créé avec succès!')

            setFormData({
                matricule: '',
                first_name: '',
                last_name: '',
                email: '',
                program: '',
                academic_year: '',
                expiration_date: '',
                photo_url: null
            })
            setPhotoPreview(null)
            setShowAddForm(false)
            setShowPreview(false)
            setStudents([...students, newStudent])

        } catch (error) {
            alert(`Erreur: ${error instanceof Error ? error.message : 'Échec de la création'}`)
        } finally {
            setIsSubmitting(false)
        }
    }

    const StudentCardPreview = () => {
        const isExpired = formData.expiration_date && new Date(formData.expiration_date) < new Date()

        return (
            <div className="w-full max-w-md mx-auto">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-primary/20"
                     style={{
                         background: 'linear-gradient(135deg, #003057 0%, #0066a1 50%, #003057 100%)',
                         aspectRatio: '1.586 / 1'
                     }}>

                    <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start">
                        <div className="bg-white px-3 py-1.5 rounded-lg shadow-lg">
                            <div className="text-[#003057] font-bold text-sm">HE2B</div>
                            <div className="text-[#0066a1] font-bold text-xs">ESI</div>
                        </div>
                        <div className="text-right">
                            <div className="text-white text-xs opacity-80">CARTE ÉTUDIANT</div>
                            <div className="text-white text-sm font-bold">{formData.academic_year || '2023-2024'}</div>
                        </div>
                    </div>

                    <div className="absolute top-20 left-0 right-0 px-4">
                        <div className="flex gap-4 items-start">
                            <div className="flex-shrink-0">
                                {photoPreview ? (
                                    <img
                                        src={photoPreview}
                                        alt="Student"
                                        className="w-24 h-28 object-cover rounded-lg border-2 border-white/30 shadow-lg"
                                    />
                                ) : (
                                    <div className="w-24 h-28 bg-white/20 rounded-lg border-2 border-white/30 flex items-center justify-center backdrop-blur-sm">
                                        <Camera className="w-8 h-8 text-white/50" />
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 pt-1">
                                <div className="text-white">
                                    <div className="text-lg font-bold leading-tight">
                                        {formData.first_name || 'PRÉNOM'} {formData.last_name || 'NOM'}
                                    </div>
                                    <div className="text-2xl font-bold mt-1 mb-2">
                                        {formData.matricule || '00000'}
                                    </div>
                                    <div className="text-xs opacity-90 leading-relaxed">
                                        {formData.program || 'FILIÈRE'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="absolute bottom-4 right-4">
                        <div className="bg-white p-2 rounded-lg shadow-lg">
                            <div className="w-16 h-16 bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                                QR
                            </div>
                        </div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 h-2"
                         style={{
                             background: 'linear-gradient(90deg, #FFD700 0%, #FF69B4 25%, #87CEEB 50%, #98FB98 75%, #FFD700 100%)'
                         }}>
                    </div>

                    {isExpired && (
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-12">
                            <div className="bg-red-600 text-white px-8 py-3 rounded-lg font-bold text-xl border-4 border-white shadow-2xl">
                                EXPIRÉ
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-4 bg-card/80 backdrop-blur-xl rounded-xl p-4 shadow-lg border border-border/60">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                            <div className="text-muted-foreground text-xs">Email</div>
                            <div className="font-medium text-foreground truncate">{formData.email || '-'}</div>
                        </div>
                        <div>
                            <div className="text-muted-foreground text-xs">Expire le</div>
                            <div className="font-medium text-foreground">
                                {formData.expiration_date
                                    ? new Date(formData.expiration_date).toLocaleDateString('fr-FR')
                                    : '-'
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent-blue bg-clip-text text-transparent">
                        Étudiants
                    </h1>
                    <p className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold">
                            {students.length}
                        </span>
                        étudiants au total
                    </p>
                </div>
                <Button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300 hover:scale-105"
                >
                    {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    {showAddForm ? 'Annuler' : 'Ajouter un étudiant'}
                </Button>
            </div>

            {showAddForm && (
                <Card className="p-6 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent-blue/5 border-2 border-primary/30 backdrop-blur-xl shadow-2xl shadow-primary/20">
                    <h2 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        Nouvel étudiant
                    </h2>

                    <div className="grid lg:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                                    <Camera className="w-4 h-4 text-primary" />
                                    Photo de l'étudiant
                                </label>
                                <div className="flex items-center gap-4">
                                    {photoPreview ? (
                                        <div className="relative group">
                                            <img src={photoPreview} alt="Preview" className="w-24 h-24 object-cover rounded-xl shadow-lg" />
                                            <button
                                                onClick={() => setPhotoPreview(null)}
                                                className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1.5 hover:bg-destructive/90 shadow-lg transition-all duration-300 hover:scale-110"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="w-24 h-24 bg-muted/50 rounded-xl flex items-center justify-center border-2 border-dashed border-border/60">
                                            <Camera className="w-8 h-8 text-muted-foreground" />
                                        </div>
                                    )}
                                    <Button
                                        onClick={() => fileInputRef.current?.click()}
                                        variant="outline"
                                        className="flex items-center gap-2 hover:border-primary/50 hover:bg-primary/10 transition-all duration-300"
                                    >
                                        <Upload className="w-4 h-4" />
                                        Télécharger
                                    </Button>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handlePhotoUpload}
                                        className="hidden"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium mb-2 flex items-center gap-1.5">
                                        <Hash className="w-3.5 h-3.5 text-primary" />
                                        Matricule *
                                    </label>
                                    <Input
                                        name="matricule"
                                        value={formData.matricule}
                                        onChange={handleInputChange}
                                        placeholder="63888"
                                        className="bg-card/50 border-border/60 focus:border-primary/60 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2 flex items-center gap-1.5">
                                        <Calendar className="w-3.5 h-3.5 text-secondary" />
                                        Année *
                                    </label>
                                    <Input
                                        name="academic_year"
                                        value={formData.academic_year}
                                        onChange={handleInputChange}
                                        placeholder="2023-2024"
                                        className="bg-card/50 border-border/60 focus:border-secondary/60 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium mb-2 flex items-center gap-1.5">
                                        <User className="w-3.5 h-3.5 text-accent-blue" />
                                        Prénom *
                                    </label>
                                    <Input
                                        name="first_name"
                                        value={formData.first_name}
                                        onChange={handleInputChange}
                                        placeholder="TSHUMBI MUZELA"
                                        className="bg-card/50 border-border/60 focus:border-accent-blue/60 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Nom *</label>
                                    <Input
                                        name="last_name"
                                        value={formData.last_name}
                                        onChange={handleInputChange}
                                        placeholder="MARTINEZ"
                                        className="bg-card/50 border-border/60 focus:border-accent-blue/60 transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 flex items-center gap-1.5">
                                    <Mail className="w-3.5 h-3.5 text-accent-green" />
                                    Email
                                </label>
                                <Input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="prenom.nom@he2b.be"
                                    className="bg-card/50 border-border/60 focus:border-accent-green/60 transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 flex items-center gap-1.5">
                                    <BookOpen className="w-3.5 h-3.5 text-accent-orange" />
                                    Filière *
                                </label>
                                <Input
                                    name="program"
                                    value={formData.program}
                                    onChange={handleInputChange}
                                    placeholder="BA INFORMATIQUE - DÉVELOPPEUR D'APPLICATIONS"
                                    className="bg-card/50 border-border/60 focus:border-accent-orange/60 transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5 text-accent-pink" />
                                    Date d'expiration *
                                </label>
                                <Input
                                    type="date"
                                    name="expiration_date"
                                    value={formData.expiration_date}
                                    onChange={handleInputChange}
                                    className="bg-card/50 border-border/60 focus:border-accent-pink/60 transition-all"
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <Button
                                    onClick={() => setShowPreview(!showPreview)}
                                    variant="outline"
                                    className="flex-1 hover:border-primary/50 hover:bg-primary/10 transition-all duration-300"
                                >
                                    <Eye className="w-4 h-4 mr-2" />
                                    {showPreview ? 'Masquer' : 'Aperçu'}
                                </Button>
                                <Button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="flex-1 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg shadow-primary/30 transition-all duration-300 hover:scale-105"
                                >
                                    {isSubmitting ? (
                                        'Création...'
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4 mr-2" />
                                            Créer
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>

                        <div className={showPreview ? 'block' : 'hidden lg:block'}>
                            <div className="sticky top-6">
                                <StudentCardPreview />
                            </div>
                        </div>
                    </div>
                </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Rechercher par nom, matricule, ou email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 bg-card/50 border-border/60 focus:border-primary/60 backdrop-blur-sm transition-all"
                    />
                </div>

                <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <select
                        value={filterProgram}
                        onChange={(e) => setFilterProgram(e.target.value)}
                        className="w-full pl-10 px-3 py-2 border border-border/60 rounded-lg bg-card/50 backdrop-blur-sm text-foreground focus:border-secondary/60 focus:ring-2 focus:ring-secondary/20 transition-all"
                    >
                        <option value="">Tous les programmes</option>
                        {programs.map((prog) => (
                            <option key={prog} value={prog}>
                                {prog}
                            </option>
                        ))}
                    </select>
                </div>

                <select
                    value={filterActive === null ? "" : filterActive.toString()}
                    onChange={(e) => setFilterActive(e.target.value === "" ? null : e.target.value === "true")}
                    className="px-3 py-2 border border-border/60 rounded-lg bg-card/50 backdrop-blur-sm text-foreground focus:border-accent-green/60 focus:ring-2 focus:ring-accent-green/20 transition-all"
                >
                    <option value="">Tous les statuts</option>
                    <option value="true">Actifs</option>
                    <option value="false">Inactifs</option>
                </select>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <Spinner />
                </div>
            ) : students.length === 0 ? (
                <Card className="p-8 text-center bg-card/50 backdrop-blur-xl border-border/60">
                    <p className="text-muted-foreground">Aucun étudiant trouvé</p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {students.map((student) => (
                        <Link key={student.id} href={`/dashboard/students/${student.id}`}>
                            <Card className="p-5 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 cursor-pointer h-full bg-card/80 backdrop-blur-xl border-border/60 hover:border-primary/50 hover:-translate-y-2 group">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <p className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                                            {student.first_name} {student.last_name}
                                        </p>
                                        <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                                            <Hash className="w-3 h-3" />
                                            {student.matricule}
                                        </p>
                                    </div>
                                    <span
                                        className={`text-xs px-3 py-1.5 rounded-full whitespace-nowrap font-medium shadow-lg ${
                                            student.is_active
                                                ? "bg-accent-green/20 text-accent-green shadow-accent-green/20"
                                                : "bg-destructive/20 text-destructive shadow-destructive/20"
                                        }`}
                                    >
                                        {student.is_active ? "Actif" : "Inactif"}
                                    </span>
                                </div>
                                <p className="text-sm text-muted-foreground mb-2 truncate flex items-center gap-1.5">
                                    <Mail className="w-3 h-3" />
                                    {student.email}
                                </p>
                                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                                    <BookOpen className="w-3 h-3" />
                                    {student.program} • {student.academic_year}
                                </p>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}