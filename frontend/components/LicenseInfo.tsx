"use client"

interface LicenseInfoProps {
  type?: "public-domain" | "cc-zero" | "cc-by"
}

export default function LicenseInfo({ type = "public-domain" }: LicenseInfoProps) {
  const getLicenseInfo = () => {
    switch (type) {
      case "cc-zero":
        return {
          name: "CC0 1.0 Universal",
          description: "Dedicado al dominio público",
          icon: (
            <div className="flex items-center space-x-1">
              <CCIcon />
              <span className="text-xs font-bold">0</span>
            </div>
          ),
          link: "https://creativecommons.org/publicdomain/zero/1.0/",
        }
      case "cc-by":
        return {
          name: "Creative Commons Attribution",
          description: "Libre uso con atribución",
          icon: (
            <div className="flex items-center space-x-1">
              <CCIcon />
              <span className="text-xs font-bold">BY</span>
            </div>
          ),
          link: "https://creativecommons.org/licenses/by/4.0/",
        }
      default:
        return {
          name: "Dominio Público",
          description: "Libre de derechos de autor",
          icon: <PublicDomainIcon />,
          link: "https://es.wikipedia.org/wiki/Dominio_p%C3%BAblico",
        }
    }
  }

  const license = getLicenseInfo()

  return (
    <div className="flex items-center space-x-3 p-4 bg-green-900/20 border border-green-700/30 rounded-lg">
      <div className="flex-shrink-0 text-green-400">{license.icon}</div>
      <div className="flex-1">
        <h4 className="text-green-300 font-medium text-sm">{license.name}</h4>
        <p className="text-green-400/80 text-xs">{license.description}</p>
      </div>
      <a
        href={license.link}
        target="_blank"
        rel="noopener noreferrer"
        className="text-green-400 hover:text-green-300 text-xs underline"
      >
        Más info
      </a>
    </div>
  )
}

// Componente del logo de Creative Commons
function CCIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-green-400">
      <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="1" fill="none" />
      <path
        d="M8.5 9.5c-1.5 0-2.5 1-2.5 2.5s1 2.5 2.5 2.5c1 0 1.8-.6 2.2-1.4M15.5 9.5c-1.5 0-2.5 1-2.5 2.5s1 2.5 2.5 2.5c1 0 1.8-.6 2.2-1.4"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  )
}

// Componente del logo de Dominio Público
function PublicDomainIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-green-400">
      <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="1" fill="none" />
      <path
        d="M8 8h3c2 0 3.5 1.5 3.5 3.5v1c0 2-1.5 3.5-3.5 3.5H8V8z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      <path d="M8 12h7" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M15 8h1.5c1.5 0 2.5 1 2.5 2.5v3c0 1.5-1 2.5-2.5 2.5H15"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
    </svg>
  )
}
