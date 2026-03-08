import type { EffectMeta } from '@bg-effects/core'
import type { MosaicProps } from './types'
import { generateRandomPalette, rand } from '@bg-effects/shared'

export const meta: EffectMeta<MosaicProps> = {
  id: 'mosaic',
  name: { en: 'Mosaic', 'zh-CN': '马赛克' },
  category: 'abstract',
  version: '0.1.0',
  defaultConfig: {
    debug: false,
    lang: 'zh-CN',
    speed: 0.5,
    gridSize: 40,
    blurIntensity: 0.8,
    grainOpacity: 0.1,
    textureType: 0,
    color1: '#7e5bef',
    color2: '#ff49db',
    color3: '#1286c4',
    modernIntensity: 0.25,
    modernFlow: 0.35,
    modernBloom: 0.2,
  },
  randomize: (current, tab?) => {
    const result = { ...current }

    if (!tab) {
      const colors = generateRandomPalette(3)
      result.color1 = colors[0]
      result.color2 = colors[1]
      result.color3 = colors[2]
      result.speed = rand(0.2, 1.5)
      result.gridSize = rand(20, 80, 0)
      result.blurIntensity = rand(0.2, 1.5)
      result.grainOpacity = rand(0.05, 0.25)
      result.textureType = rand(0, 2, 0) as 0 | 1 | 2
      result.modernIntensity = rand(0.1, 0.6)
      result.modernFlow = rand(0.1, 0.7)
      result.modernBloom = rand(0.05, 0.5)
      return result
    }

    if (tab === 'basic') {
      result.speed = rand(0.2, 1.5)
      result.gridSize = rand(20, 80, 0)
      result.blurIntensity = rand(0.2, 1.5)
      result.grainOpacity = rand(0.05, 0.25)
      return result
    }

    if (tab === 'colors') {
      const colors = generateRandomPalette(3)
      result.color1 = colors[0]
      result.color2 = colors[1]
      result.color3 = colors[2]
      return result
    }

    if (tab === 'texture') {
      result.textureType = rand(0, 2, 0) as 0 | 1 | 2
      return result
    }

    if (tab === 'modern') {
      result.modernIntensity = rand(0.1, 0.6)
      result.modernFlow = rand(0.1, 0.7)
      result.modernBloom = rand(0.05, 0.5)
      return result
    }

    return result
  },
  presets: [
    {
      id: 'mosaic_violet',
      name: { en: 'Violet Prism', 'zh-CN': '紫晶棱镜' },
      config: {
        color1: '#5b21b6',
        color2: '#a855f7',
        color3: '#22d3ee',
        textureType: 2,
        gridSize: 48,
        grainOpacity: 0.12,
      },
    },
    {
      id: 'mosaic_sunset',
      name: { en: 'Sunset Tiles', 'zh-CN': '霞光方格' },
      config: {
        color1: '#f97316',
        color2: '#fb7185',
        color3: '#fde047',
        textureType: 0,
        gridSize: 36,
        blurIntensity: 1.1,
      },
    },
    {
      id: 'mosaic_night',
      name: { en: 'Night Grid', 'zh-CN': '夜色网格' },
      config: {
        color1: '#0f172a',
        color2: '#1e293b',
        color3: '#38bdf8',
        textureType: 1,
        gridSize: 60,
        grainOpacity: 0.08,
      },
    },
  ],
}
