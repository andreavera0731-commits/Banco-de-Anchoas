import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#b8860b',
          secondary: '#1a1a1a',
          accent: '#d4a84b',
          background: '#faf8f5',
          surface: '#ffffff',
          error: '#c62828',
        },
      },
    },
  },
})
