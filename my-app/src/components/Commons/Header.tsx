import Link from "next/link";

export default function Header() {
    return (
        <header className="flex items-center px-6 py-3 border-b border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-700 relative z-10 shadow-sm">
            
            <h1 className="cursor-pointer text-2xl font-bold text-gray-800 dark:text-gray-100 hover:text-blue-600 transition-colors">
                Visualisation des données fiscales
            </h1>

            <nav className="ml-auto flex gap-8">
                <Link
                    href="/temporelle"
                    className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
                >
                    Série Temporelle
                </Link>

                <Link
                    href="/nuage"
                    className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
                >
                    Nuage de point
                </Link>

                <Link
                    href="/diagramme"
                    className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
                >
                    Diagramme Circulaire
                </Link>
            </nav>
        </header>
    );
}
