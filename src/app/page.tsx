'use client'
import { useState, useEffect } from 'react'

interface AirQualityData {
  indice: number
  qualificatif: string
  couleur_html: string
  commune_nom: string
  date_echeance: string
  sous_indices: Array<{
    polluant_nom: string
    concentration: number
    indice: number
  }>
}

// Fonction pour obtenir la couleur et le statut selon l'indice
const getStatusFromIndex = (indice: number) => {
  const statusMap = {
    0: { color: '#9CA3AF', label: 'Indisponible' },
    1: { color: '#06D6A0', label: 'Bon' },
    2: { color: '#1DD1A1', label: 'Moyen' },
    3: { color: '#FFC048', label: 'Dégradé' },
    4: { color: '#FF6B6B', label: 'Mauvais' },
    5: { color: '#8B5CF6', label: 'Très mauvais' },
    6: { color: '#6F46C5', label: 'Extrêmement mauvais' }
  }
  return statusMap[indice as keyof typeof statusMap] || statusMap[0]
}

export default function Home() {
  const [airData, setAirData] = useState<AirQualityData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAirQuality = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/air-quality?code_insee=69123')
      const data = await response.json()
      
      if (data.success && data.data.length > 0) {
        setAirData(data.data[0])
      } else {
        setError('Aucune donnée disponible')
      }
    } catch (err) {
      console.error('Erreur API:', err)
      setError('Erreur lors de la récupération des données')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAirQuality()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">
          Qualité de l&apos;air - Lyon
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          {loading && (
            <div className="text-center">Chargement...</div>
          )}
          
          {error && (
            <div className="text-red-500 text-center">{error}</div>
          )}
          
          {airData && (
            <div>
              {/* Indice général */}
              <div className="text-center mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                  {airData.commune_nom}
                </h2>
                <div 
                  className="inline-block px-8 py-4 rounded-full text-white text-2xl font-bold mb-2"
                  style={{ backgroundColor: airData.couleur_html }}
                >
                  {airData.qualificatif}
                </div>
                <p className="text-gray-600 text-lg">
                  Indice global : {airData.indice}
                </p>
                <p className="text-gray-500 text-sm">
                  {airData.date_echeance}
                </p>
              </div>
              
              {/* Polluants en ligne */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-4 text-center">
                  Détail par polluant
                </h3>
                <div className="flex justify-center flex-wrap gap-4">
                  {airData.sous_indices.map((polluant, index) => {
                    const status = getStatusFromIndex(polluant.indice)
                    return (
                      <div key={index} className="text-center">
                        <div 
                          className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg mb-2 mx-auto"
                          style={{ backgroundColor: status.color }}
                        >
                          {polluant.polluant_nom}
                        </div>
                        <div className="text-sm font-semibold text-gray-700">
                          Indice {polluant.indice}
                        </div>
                        <div className="text-xs text-gray-500">
                          {status.label}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
              
              {/* Légende */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold mb-3 text-center">Légende</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-gray-400 mr-2"></div>
                    <span>Indisponible</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full mr-2" style={{backgroundColor: '#06D6A0'}}></div>
                    <span>Bon</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full mr-2" style={{backgroundColor: '#1DD1A1'}}></div>
                    <span>Moyen</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full mr-2" style={{backgroundColor: '#FFC048'}}></div>
                    <span>Dégradé</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full mr-2" style={{backgroundColor: '#FF6B6B'}}></div>
                    <span>Mauvais</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full mr-2" style={{backgroundColor: '#8B5CF6'}}></div>
                    <span>Très mauvais</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full mr-2" style={{backgroundColor: '#6F46C5'}}></div>
                    <span>Extrêmement mauvais</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-gray-400 mr-2"></div>
                    <span>Événement</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="mt-6 text-center">
            <button 
              onClick={fetchAirQuality}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-semibold"
            >
              {loading ? 'Chargement...' : 'Actualiser'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
