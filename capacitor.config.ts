import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'br.edu.utfpr.mindcheck',
  appName: 'Mindcheck',
  webDir: 'dist',
  server: { androidScheme: 'https', cleartext: false },
}

export default config
