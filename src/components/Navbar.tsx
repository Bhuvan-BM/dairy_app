import Link from "next/link"

export default function Navbar() {
    return (
        <nav className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <Link href="/" className="text-2xl font-bold hover:text-blue-100 transition-colors">
                        🥛 Dairy App
                    </Link>
                    <div className="flex gap-6">
                        <Link
                            href="/"
                            className="px-4 py-2 rounded-lg hover:bg-blue-500 transition-all duration-200 font-medium"
                        >
                            Dashboard
                        </Link>
                        <Link
                            href="/farmers"
                            className="px-4 py-2 rounded-lg hover:bg-blue-500 transition-all duration-200 font-medium"
                        >
                            Farmers
                        </Link>
                        <Link
                            href="/collection"
                            className="px-4 py-2 rounded-lg hover:bg-blue-500 transition-all duration-200 font-medium"
                        >
                            Collection
                        </Link>
                        <Link
                            href="/rates"
                            className="px-4 py-2 rounded-lg hover:bg-blue-500 transition-all duration-200 font-medium"
                        >
                            Rates
                        </Link>
                        <Link
                            href="/billing"
                            className="px-4 py-2 rounded-lg hover:bg-blue-500 transition-all duration-200 font-medium"
                        >
                            Billing
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    )
}
