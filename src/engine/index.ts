import { Mesh, Program, Renderer, Triangle } from 'ogl'
import vertex from './shaders/vertex.glsl?raw'
import fragment from './shaders/fragment.glsl?raw'
import type { MosaicEngineConfig } from '../types'
import { clampNumber, normalizeIntRange, normalizeHexColor, safeHexToRgbNormalized } from '@bg-effects/shared'

export class MosaicEngine {
  private renderer: Renderer
  private program: Program
  private mesh: Mesh
  private container: HTMLElement
  private rafId: number | null = null
  private isPaused = false
  private ro?: ResizeObserver
  private config: MosaicEngineConfig

  constructor(container: HTMLElement, config: MosaicEngineConfig) {
    this.container = container
    this.config = this.normalizeConfig(config)
    this.renderer = new Renderer({
      alpha: true,
      premultipliedAlpha: false,
      dpr: Math.min(window.devicePixelRatio || 1, 2),
    })
    const gl = this.renderer.gl
    gl.clearColor(0, 0, 0, 0)
    this.program = this.createProgram(gl, this.config)
    const geometry = new Triangle(gl)
    geometry.attributes.position.data = geometry.attributes.position.data.map((v) => v * 2)
    geometry.attributes.uv.data = geometry.attributes.uv.data.map((v) => v * 2)
    geometry.attributes.position.needsUpdate = true
    geometry.attributes.uv.needsUpdate = true
    this.mesh = new Mesh(gl, { geometry, program: this.program })
    this.container.appendChild(gl.canvas)
    this.updateSize()
    this.loop()
    this.ro = new ResizeObserver(this.updateSize)
    this.ro.observe(this.container)
  }

  private createProgram(gl: Renderer['gl'], config: MosaicEngineConfig) {
    return new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: [0, 0] },
        uGridSize: { value: config.gridSize },
        uBlurIntensity: { value: config.blurIntensity },
        uGrainOpacity: { value: config.grainOpacity },
        uTextureType: { value: config.textureType },
        uColor1: { value: safeHexToRgbNormalized(config.color1, config.color1) },
        uColor2: { value: safeHexToRgbNormalized(config.color2, config.color2) },
        uColor3: { value: safeHexToRgbNormalized(config.color3, config.color3) },
        uModernIntensity: { value: config.modernIntensity },
        uModernFlow: { value: config.modernFlow },
        uModernBloom: { value: config.modernBloom },
      },
    })
  }

  private loop = (time = 0) => {
    if (this.isPaused) return
    this.rafId = requestAnimationFrame(this.loop)
    this.program.uniforms.uTime.value = time * 0.001 * this.config.speed
    this.renderer.render({ scene: this.mesh })
  }

  private updateSize = () => {
    const width = Math.max(1, Math.floor(this.container.clientWidth))
    const height = Math.max(1, Math.floor(this.container.clientHeight))
    this.renderer.setSize(width, height)
    const { drawingBufferWidth, drawingBufferHeight } = this.renderer.gl
    this.program.uniforms.uResolution.value = [drawingBufferWidth, drawingBufferHeight]
  }

  updateConfig(config: Partial<MosaicEngineConfig>) {
    const next = this.normalizeConfig({ ...this.config, ...config }, this.config)
    this.config = next

    this.program.uniforms.uGridSize.value = next.gridSize
    this.program.uniforms.uBlurIntensity.value = next.blurIntensity
    this.program.uniforms.uGrainOpacity.value = next.grainOpacity
    this.program.uniforms.uTextureType.value = next.textureType
    this.program.uniforms.uColor1.value = safeHexToRgbNormalized(next.color1, next.color1)
    this.program.uniforms.uColor2.value = safeHexToRgbNormalized(next.color2, next.color2)
    this.program.uniforms.uColor3.value = safeHexToRgbNormalized(next.color3, next.color3)
    this.program.uniforms.uModernIntensity.value = next.modernIntensity
    this.program.uniforms.uModernFlow.value = next.modernFlow
    this.program.uniforms.uModernBloom.value = next.modernBloom
    this.updateSize()
  }

  private normalizeConfig(config: MosaicEngineConfig, base?: MosaicEngineConfig): MosaicEngineConfig {
    const textureType = normalizeIntRange(config.textureType, 0, 2, base?.textureType ?? config.textureType) as 0 | 1 | 2
    const fallbackColor1 = base?.color1 ?? config.color1
    const fallbackColor2 = base?.color2 ?? config.color2
    const fallbackColor3 = base?.color3 ?? config.color3
    return {
      ...config,
      speed: clampNumber(config.speed, 0, 3),
      gridSize: normalizeIntRange(config.gridSize, 8, 200, base?.gridSize ?? config.gridSize),
      blurIntensity: clampNumber(config.blurIntensity, 0, 2),
      grainOpacity: clampNumber(config.grainOpacity, 0, 0.5),
      textureType,
      color1: normalizeHexColor(config.color1, fallbackColor1),
      color2: normalizeHexColor(config.color2, fallbackColor2),
      color3: normalizeHexColor(config.color3, fallbackColor3),
      modernIntensity: clampNumber(config.modernIntensity, 0, 1),
      modernFlow: clampNumber(config.modernFlow, 0, 1),
      modernBloom: clampNumber(config.modernBloom, 0, 1),
    }
  }

  pause() {
    this.isPaused = true
    if (this.rafId) cancelAnimationFrame(this.rafId)
    this.rafId = null
  }

  resume() {
    if (!this.isPaused) return
    this.isPaused = false
    this.loop()
  }

  destroy() {
    if (this.rafId) cancelAnimationFrame(this.rafId)
    this.ro?.disconnect()
    const gl = this.renderer.gl
    gl.canvas.remove()
    this.mesh.geometry.remove()
  }
}
