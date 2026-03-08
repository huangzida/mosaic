export interface MosaicProps {
  className?: string
  debug?: boolean
  lang?: 'zh-CN' | 'en'
  speed?: number
  gridSize?: number
  blurIntensity?: number
  grainOpacity?: number
  textureType?: 0 | 1 | 2
  color1?: string
  color2?: string
  color3?: string
  modernIntensity?: number
  modernFlow?: number
  modernBloom?: number
}

export interface MosaicEngineConfig {
  speed: number
  gridSize: number
  blurIntensity: number
  grainOpacity: number
  textureType: 0 | 1 | 2
  color1: string
  color2: string
  color3: string
  modernIntensity: number
  modernFlow: number
  modernBloom: number
}
