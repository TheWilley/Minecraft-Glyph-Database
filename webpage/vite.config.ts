import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default {
  plugins: [react(), tailwindcss()],
  base: '/Minecraft-Glyph-Database/'
};
