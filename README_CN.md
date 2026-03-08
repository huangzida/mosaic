# @bg-effects/mosaic

[English](./README.md) | [简体中文](./README_CN.md)

基于 OGL 和 Vue 构建的高性能马赛克背景特效。

[在线演示](https://huangzida.github.io/mosaic/)

---

### 特性

- 🚀 **高性能**: 基于 OGL (轻量级 WebGL 库) 构建，运行流畅。
- 🎨 **高度可定制**: 提供网格大小、模糊强度、颗粒透明度及多种颜色选项。
- 🛠️ **调试模式**: 内置可视化调试面板，方便实时调整效果。
- 📦 **开箱即用**: 作为 Vue 组件，简单配置即可使用。

### 安装

```bash
pnpm add @bg-effects/mosaic ogl
```

> **注意**: `ogl` 是 peer dependency，需要手动安装。

### 使用

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

### 属性 (Props)

| 属性名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| `speed` | `number` | `1.0` | 动画速度 |
| `gridSize` | `number` | `20` | 马赛克网格大小 |
| `blurIntensity` | `number` | `1.5` | 模糊效果强度 |
| `grainOpacity` | `number` | `0.1` | 颗粒纹理透明度 |
| `textureType` | `0 \| 1 \| 2` | `0` | 纹理类型 |
| `color1` | `string` | `'#ff0000'` | 第一种颜色 |
| `color2` | `string` | `'#00ff00'` | 第二种颜色 |
| `color3` | `string` | `'#0000ff'` | 第三种颜色 |
| `modernIntensity` | `number` | `1.0` | 现代效果强度 |
| `modernFlow` | `number` | `1.0` | 现代效果流速 |
| `modernBloom` | `number` | `1.0` | 现代效果辉光强度 |
| `debug` | `boolean` | `false` | 是否开启调试面板 |
| `lang` | `'zh-CN' \| 'en'` | `'zh-CN'` | 界面语言 |

### 本地开发

```bash
# 安装依赖
pnpm install

# 启动开发环境
pnpm dev
```

### 许可

MIT
