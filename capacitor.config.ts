import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.nrkopnin.pettracker',
  appName: 'pet-tracker-app',
  webDir: 'dist/spa',
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#ffffff',
      iosScaleType: 'CENTER'
    },
  },
};

export default config;
