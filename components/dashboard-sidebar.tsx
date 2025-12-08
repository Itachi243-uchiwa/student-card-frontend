"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { LayoutDashboard, Users, Upload, Scan, Settings, ChevronRight } from "lucide-react"

const NAVIGATION = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, role: ["ADMIN", "STAFF"] },
    { label: "Students", href: "/dashboard/students", icon: Users, role: ["ADMIN", "STAFF"] },
    { label: "Import Data", href: "/dashboard/imports", icon: Upload, role: ["ADMIN", "STAFF"] },
    { label: "Verify Cards", href: "/verify", icon: Scan, role: ["ADMIN", "STAFF"] },  // ← NOUVEAU
    { label: "Users", href: "/dashboard/users", icon: Settings, role: ["ADMIN"] },
]

export function DashboardSidebar() {
    const pathname = usePathname()
    const { user } = useAuth()

    const filteredNav = NAVIGATION.filter((item) => item.role.includes(user?.role || ""))

    return (
        <aside className="w-72 border-r border-border/60 bg-card/80 backdrop-blur-xl sticky top-0 h-screen overflow-y-auto shadow-2xl shadow-primary/10">
            <div className="p-6 border-b border-border/60">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent-blue flex items-center justify-center shadow-lg shadow-primary/30 animate-pulse-glow">
                        <span className="text-xl font-bold text-white">SC</span>
                    </div>
                    <div>
                        <h2 className="font-bold text-foreground text-lg">Student Cards</h2>
                        <p className="text-xs text-muted-foreground">PWA Platform</p>
                    </div>
                </div>
            </div>

            <nav className="p-4 space-y-2">
                {filteredNav.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`group flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 relative overflow-hidden ${
                                isActive
                                    ? "bg-gradient-to-r from-primary/20 via-secondary/20 to-accent-blue/20 text-primary shadow-lg shadow-primary/20 border border-primary/30"
                                    : "text-muted-foreground hover:bg-primary/10 hover:text-foreground hover:shadow-md hover:border hover:border-primary/20"
                            }`}
                        >
                            {isActive && (
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent-blue/10 animate-gradient"></div>
                            )}
                            <Icon className={`w-5 h-5 transition-all duration-300 relative z-10 ${
                                isActive ? "text-primary scale-110" : "group-hover:scale-110"
                            }`} />
                            <span className="font-medium text-sm flex-1 relative z-10">{item.label}</span>
                            {isActive && <ChevronRight className="w-4 h-4 opacity-70 relative z-10 text-primary" />}
                        </Link>
                    )
                })}
            </nav>

            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border/60 bg-card/90 backdrop-blur-xl">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-primary/10 via-secondary/10 to-accent-blue/10 border border-border/40 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary via-secondary to-accent-blue shadow-lg shadow-primary/30 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                            {user?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                        </span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{user?.full_name}</p>
                        <p className="text-xs text-muted-foreground truncate">
                            <span className="inline-block px-2 py-0.5 rounded-md bg-primary/20 text-primary text-[10px] font-medium">
                                {user?.role}
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </aside>
    )
}