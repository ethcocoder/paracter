import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.projectedai.camera',
  appName: 'Projected AI Camera',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: { cleartext: true }
};
export default config;
