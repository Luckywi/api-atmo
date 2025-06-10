import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code_insee = searchParams.get('code_insee') || '69123' // Lyon par défaut
  
  try {
    const response = await fetch(
      `https://api.atmo-aura.fr/api/v1/communes/${code_insee}/indices/atmo?api_token=0c7d0bee25f494150fa591275260e81f&date_echeance=now`,
      {
        headers: {
          'User-Agent': 'AirQualityApp/1.0'
        }
      }
    )
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Erreur API Atmo:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des données' },
      { status: 500 }
    )
  }
}