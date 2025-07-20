import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mmklab.recipes',
  appName: 'Recipes',
  webDir: 'www',
  plugins: {
    Camera: {
      webUseInput: true,
    },
  },
};

export default config;
