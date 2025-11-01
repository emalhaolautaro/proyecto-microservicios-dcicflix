"use client"

import React, { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Globe, Facebook, MessageCircle } from "lucide-react"

interface ShareButtonProps {}

export default function ShareButton({}: ShareButtonProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)
  const url = typeof window !== "undefined" ? window.location.href : ""

  // Cerrar modal si clickeás fuera
  useEffect(() => {
    function onClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setModalOpen(false)
        setCopied(false)
      }
    }
    if (modalOpen) {
      window.addEventListener("mousedown", onClickOutside)
    }
    return () => window.removeEventListener("mousedown", onClickOutside)
  }, [modalOpen])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  // URLs para compartir en redes
  const socialUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    x: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`, // URL compatible con X
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(url)}`,
  }

  return (
    <>
      <button
        onClick={() => setModalOpen(true)}
        className="flex items-center space-x-2 bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-full border border-gray-700 transition-colors"
        aria-label="Compartir enlace"
      >
        <Globe className="h-4 w-4 text-gray-300" />
        <span className="text-sm font-medium">Compartir</span>
      </button>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center p-4">
          <div
            ref={modalRef}
            className="bg-gray-900 rounded-xl p-6 w-full max-w-sm text-white shadow-lg"
          >
            <h3 className="text-lg font-semibold mb-4">Compartir enlace</h3>
            <div className="flex items-center space-x-2 mb-4">
              <input
                type="text"
                readOnly
                value={url}
                className="flex-1 rounded bg-gray-800 text-sm px-3 py-2 select-all focus:outline-none"
                onFocus={e => e.target.select()}
              />
              <button
                onClick={copyToClipboard}
                className="bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded text-xs font-medium transition"
                aria-label="Copiar enlace"
              >
                {copied ? "Copiado" : "Copiar"}
              </button>
            </div>

            <div className="flex space-x-4 justify-center">
              <a
                href={socialUrls.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Compartir en Facebook"
                className="hover:text-blue-500 transition"
              >
                <Facebook className="w-6 h-6" />
              </a>
              <a
                href={socialUrls.x}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Compartir en X"
                className="hover:text-sky-400 transition flex items-center"
              >
                <Image src="/x-logo.svg" alt="X logo" width={24} height={24} className="invert-white"/>
              </a>
              <a
                href={socialUrls.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Compartir en WhatsApp"
                className="hover:text-green-500 transition"
              >
                <MessageCircle className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
