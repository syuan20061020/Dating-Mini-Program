import path from 'path'
import { defineConfig } from '@lark-apas/coding-preset-vite-react'

export default defineConfig({
  base: "/Dating-Mini-Program/dateProgramHTML/",
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@shared': path.resolve(__dirname, 'shared'),
    },
  },
})
