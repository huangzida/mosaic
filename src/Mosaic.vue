<script setup lang="ts">
import { computed, defineAsyncComponent, onMounted, onUnmounted, ref, watch } from 'vue'
import { DebugShell } from '@bg-effects/debug-ui'
import { defu } from 'defu'
import { meta } from './meta'
import { MosaicEngine } from './engine'
import type { MosaicEngineConfig, MosaicProps } from './types'

const props = defineProps<MosaicProps & { debug?: boolean, lang?: 'zh-CN' | 'en' }>()

const ConfigPanel = defineAsyncComponent(() => import('./ui/ConfigPanel.vue'))
const configPanelRef = ref<any>(null)

const resolveConfig = () => defu(props, meta.defaultConfig) as MosaicProps

const config = ref<MosaicProps>(resolveConfig())
const internalLang = ref<'zh-CN' | 'en'>(config.value.lang as any)

watch(() => props, (newProps) => {
  if (!props.debug) {
    config.value = defu(newProps, meta.defaultConfig) as MosaicProps
  }
}, { deep: true })

const handleRandomize = () => {
  if (meta.randomize) {
    const currentTab = configPanelRef.value?.activeTab as any
    const tabValue = typeof currentTab === 'object' && currentTab?.value ? currentTab.value : currentTab
    const randomized = meta.randomize(config.value, tabValue)
    config.value = {
      ...config.value,
      ...randomized,
    }
  }
}

const effectiveConfig = computed(() => props.debug ? config.value : props)

const containerRef = ref<HTMLElement | null>(null)
let engine: MosaicEngine | null = null

const resolveEngineConfig = (source: MosaicProps): MosaicEngineConfig => {
  const resolved = defu(source, meta.defaultConfig) as MosaicProps
  return {
    speed: resolved.speed ?? meta.defaultConfig.speed,
    gridSize: resolved.gridSize ?? meta.defaultConfig.gridSize,
    blurIntensity: resolved.blurIntensity ?? meta.defaultConfig.blurIntensity,
    grainOpacity: resolved.grainOpacity ?? meta.defaultConfig.grainOpacity,
    textureType: resolved.textureType ?? meta.defaultConfig.textureType,
    color1: resolved.color1 ?? meta.defaultConfig.color1,
    color2: resolved.color2 ?? meta.defaultConfig.color2,
    color3: resolved.color3 ?? meta.defaultConfig.color3,
    modernIntensity: resolved.modernIntensity ?? meta.defaultConfig.modernIntensity,
    modernFlow: resolved.modernFlow ?? meta.defaultConfig.modernFlow,
    modernBloom: resolved.modernBloom ?? meta.defaultConfig.modernBloom,
  }
}

const engineInterface = computed(() => ({
  pause: () => {
    engine?.pause()
  },
  resume: () => {
    engine?.resume()
  },
  restart: () => {
    if (!containerRef.value) return
    const resolved = defu(effectiveConfig.value, meta.defaultConfig) as MosaicProps
    engine?.destroy()
    engine = new MosaicEngine(containerRef.value, resolveEngineConfig(resolved))
  },
}))

watch(effectiveConfig, (newConfig) => {
  if (!engine) return
  const resolved = defu(newConfig, meta.defaultConfig) as MosaicProps
  engine.updateConfig(resolveEngineConfig(resolved))
}, { deep: true })

onMounted(() => {
  if (!containerRef.value) return
  const resolved = defu(effectiveConfig.value, meta.defaultConfig) as MosaicProps
  engine = new MosaicEngine(containerRef.value, resolveEngineConfig(resolved))
})

onUnmounted(() => {
  engine?.destroy()
  engine = null
})
</script>

<template>
  <div :class="['relative w-full h-full overflow-hidden', className]">
    <div ref="containerRef" class="absolute inset-0" />
    <DebugShell
      v-if="effectiveConfig && effectiveConfig.debug"
      v-model:config="config"
      v-model:lang="internalLang"
      :meta="meta"
      :engine="engineInterface"
      @randomize="handleRandomize"
    >
      <template #settings>
        <ConfigPanel ref="configPanelRef" v-model:config="config" :lang="internalLang" />
      </template>
    </DebugShell>
  </div>
</template>
