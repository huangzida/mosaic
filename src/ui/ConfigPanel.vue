<script setup lang="ts">
import { computed, ref } from 'vue'
import { ButtonGroup, ColorPicker, Slider, SubTabs, type ButtonOption } from '@bg-effects/shared'
import type { MosaicProps } from '../types'
import zhCN from '../locales/zh-CN.json'
import en from '../locales/en.json'

const props = defineProps<{
  lang?: 'zh-CN' | 'en'
}>()

const config = defineModel<MosaicProps>('config', { required: true })
const activeTab = ref<'basic' | 'colors' | 'texture' | 'modern'>('basic')

defineExpose({ activeTab })

const i18n = {
  'zh-CN': zhCN,
  en,
}

const t = (path: string) => {
  const dict = i18n[props.lang || 'zh-CN']
  return path.split('.').reduce((obj: any, key) => obj?.[key], dict) || path
}

const tabs = computed(() => [
  { id: 'basic', label: t('tabs.basic') },
  { id: 'colors', label: t('tabs.colors') },
  { id: 'texture', label: t('tabs.texture') },
  { id: 'modern', label: t('tabs.modern') },
])

const textureOptions = computed<ButtonOption<number>[]>(() => [
  { value: 0, label: t('textureOptions.soft') },
  { value: 1, label: t('textureOptions.pixel') },
  { value: 2, label: t('textureOptions.ripple') },
])

</script>

<template>
  <div class="flex flex-col gap-6 text-white/90">
    <SubTabs v-model="activeTab" :tabs="tabs" />

    <div class="flex flex-col gap-6 p-1 pointer-events-auto overflow-y-auto max-h-[400px] custom-scrollbar pr-2">
      <div v-if="activeTab === 'basic'" class="flex flex-col gap-4">
        <Slider v-model="config.speed" :label="t('labels.speed')" :min="0" :max="2" :step="0.05" />
        <Slider v-model="config.gridSize" :label="t('labels.gridSize')" :min="8" :max="200" :step="1" />
        <Slider v-model="config.blurIntensity" :label="t('labels.blurIntensity')" :min="0" :max="2" :step="0.05" />
        <Slider v-model="config.grainOpacity" :label="t('labels.grainOpacity')" :min="0" :max="0.4" :step="0.01" />
      </div>

      <div v-if="activeTab === 'colors'" class="flex flex-col gap-4">
        <ColorPicker v-model="config.color1" :label="t('labels.color1')" />
        <ColorPicker v-model="config.color2" :label="t('labels.color2')" />
        <ColorPicker v-model="config.color3" :label="t('labels.color3')" />
      </div>

      <div v-if="activeTab === 'texture'" class="flex flex-col gap-4">
        <ButtonGroup v-model="config.textureType" :label="t('labels.textureType')" :options="textureOptions" />
      </div>

      <div v-if="activeTab === 'modern'" class="flex flex-col gap-4">
        <Slider v-model="config.modernIntensity" :label="t('labels.modernIntensity')" :min="0" :max="1" :step="0.05" />
        <Slider v-model="config.modernFlow" :label="t('labels.modernFlow')" :min="0" :max="1" :step="0.05" />
        <Slider v-model="config.modernBloom" :label="t('labels.modernBloom')" :min="0" :max="1" :step="0.05" />
      </div>
    </div>
  </div>
</template>
