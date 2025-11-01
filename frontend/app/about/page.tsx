"use client"

import DonationButton from "@/components/DonationButton"

export default function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12 bg-black text-gray-200 min-h-screen">
      <h1 className="text-3xl font-semibold mb-6 text-white">Acerca de FreeMovies</h1>

      <p className="mb-6">
        En <strong>FreeMovies</strong>, todas las películas disponibles son de <em>dominio público</em>. Nuestro objetivo es ofrecer un espacio sencillo y accesible para que cualquiera pueda disfrutar del cine público, sin complicaciones ni barreras.
      </p>

      <p className="mb-6">
        Queremos que el patrimonio cinematográfico esté al alcance de todos, preservando estas obras y facilitando su acceso desde cualquier dispositivo.
      </p>

      <p className="mb-6">
        FreeMovies es una plataforma que busca ser un punto de encuentro para amantes del cine clásico y público, ofreciendo contenido legal y gratuito.
      </p>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">¿Quién está detrás?</h2>
        <p>
          FreeMovies fue creado y es mantenido por Lautaro Emalhao, un apasionado del cine y la tecnología comprometido con la preservación cultural y el acceso libre al arte.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">¿Querés colaborar?</h2>
        <p>
          Si te interesa colaborar con sugerencias, reportes o apoyar económicamente el proyecto, podés contactarme a través del correo electrónico o donar por cafecito.app:{" "}
          <button
            onClick={() => {
              navigator.clipboard.writeText("freemoviesvercelapp@gmail.com")
              alert("Correo copiado al portapapeles")
            }}
            className="text-yellow-400 underline cursor-pointer ml-2"
          >
            freemoviesvercelapp@gmail.com
          </button>
          .
        </p>

        {/* Aquí el botón de donación */}
        <div className="mt-4">
          <DonationButton variant="inline" />
        </div>
      </section>

      <p className="text-sm text-gray-500 mt-12">FreeMovies © 2025 - Preservando el patrimonio cinematográfico mundial</p>
    </main>
  )
}
