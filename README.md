# @bg-effects/mosaic

[English](./README.md) | [简体中文](./README_CN.md)

A high-performance mosaic background effect built with OGL and Vue.

[Live Demo](https://huangzida.github.io/mosaic/)

---

### Features

- 🚀 **High Performance**: Built with OGL (a lightweight WebGL library) for smooth rendering.
- 🎨 **Highly Customizable**: Adjustable grid size, blur intensity, grain opacity, and color options.
- 🛠️ **Debug Mode**: Built-in visual debug panel for real-time adjustments.
- 📦 **Ready to Use**: Easy-to-use Vue component with simple configuration.

### Installation

```bash
pnpm add @bg-effects/mosaic ogl
```

> **Note**: `ogl` is a peer dependency and needs to be installed manually.

### Usage

```vue
<script setup>
import { Mosaic } from '@bg-effects/mosaic'
</script>

<template>
  <div style="width: 100vw; height: 100vh; background: #000;">
    <Mosaic 
      :speed="1.0"
      :grid-size="20"
      :blur-intensity="1.5"
    />
  </div>
</template>
```

### Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `speed` | `number` | `1.0` | Animation speed |
| `gridSize` | `number` | `20` | Grid size of the mosaic |
| `blurIntensity` | `number` | `1.5` | Intensity of the blur effect |
| `grainOpacity` | `number` | `0.1` | Opacity of the grain texture |
| `textureType` | `0 \| 1 \| 2` | `0` | Type of texture used |
| `color1` | `string` | `'#ff0000'` | First color of the effect |
| `color2` | `string` | `'#00ff00'` | Second color of the effect |
| `color3` | `string` | `'#0000ff'` | Third color of the effect |
| `modernIntensity` | `number` | `1.0` | Intensity of modern effects |
| `modernFlow` | `number` | `1.0` | Flow of modern effects |
| `modernBloom` | `number` | `1.0` | Bloom intensity for modern effects |
| `debug` | `boolean` | `false` | Enable debug panel |
| `lang` | `'zh-CN' \| 'en'` | `'zh-CN'` | UI language |

### Local Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### License

MIT
