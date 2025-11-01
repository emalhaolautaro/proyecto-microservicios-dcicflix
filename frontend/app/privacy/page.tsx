"use client"

export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12 bg-black text-gray-200 min-h-screen">
      <h1 className="text-3xl font-semibold mb-6 text-white">Política de Privacidad</h1>

      <p className="mb-4">
        En <strong>FreeMovies</strong> respetamos tu privacidad.
      </p>

      <p className="mb-6">
        Nuestra plataforma no recopila datos personales, no requiere registro ni utiliza cookies para rastrear a los usuarios. Simplemente ofrecemos acceso libre y gratuito a películas clásicas de dominio público.
      </p>

      <p className="mb-6">
        No compartimos información con terceros ni almacenamos datos sobre tu navegación.
      </p>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Servicios de terceros</h2>
        <p>
          Para el alojamiento del sitio utilizamos <strong>Vercel</strong> y para monitoreo de rendimiento empleamos <strong>Google Search Console</strong>. Estos servicios pueden recopilar datos técnicos como direcciones IP y datos de navegación para fines de análisis y mantenimiento. 
        </p>
        <p className="mt-2">
          Tené en cuenta que las políticas de privacidad de estos servicios son independientes a las nuestras y pueden variar. Te recomendamos revisar sus términos y condiciones para más información.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Contacto</h2>
        <p>
          Si tenés preguntas o inquietudes, podés contactarnos por correo:{" "}
          <button
            onClick={() => {
              navigator.clipboard.writeText("freemoviesvercelapp@gmail.com");
              alert("Correo copiado al portapapeles");
            }}
            className="text-yellow-400 underline cursor-pointer ml-2"
          >
            freemoviesvercelapp@gmail.com
          </button>
        </p>
      </section>

      <p className="text-sm text-gray-500 mt-12">Última actualización: 10 de agosto de 2025</p>
    </main>
  )
}
