import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// 🔥 Proxy sahi tarike se lagaya hai
export default defineConfig({
plugins: [react()], // ✅ Yeh `server` ke bahar hona chahiye
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // 🔥 Backend ka port
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
