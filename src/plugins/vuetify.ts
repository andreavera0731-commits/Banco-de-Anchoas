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
        dark: false,
        colors: {
          primary: '#b8860b',
          'primary-darken-1': '#9a7209',
          secondary: '#1a1a2e',
          accent: '#d4a84b',
          background: '#faf8f5',
          surface: '#ffffff',
          'surface-variant': '#f5f0e8',
          'on-surface-variant': '#49454f',
          error: '#c62828',
          'on-error': '#ffffff',
          success: '#2e7d32',
          'on-success': '#ffffff',
          warning: '#f57f17',
          'on-warning': '#ffffff',
          info: '#1565c0',
          'on-info': '#ffffff',
        },
      },
      dark: {
        dark: true,
        colors: {
          primary: '#d4a84b',
          'primary-darken-1': '#b8860b',
          secondary: '#e0e0e0',
          accent: '#f0c96e',
          background: '#121212',
          surface: '#1e1e2e',
          'surface-variant': '#2a2a3e',
          'on-surface-variant': '#cac4d0',
          error: '#ef5350',
          'on-error': '#1e1e1e',
          success: '#66bb6a',
          'on-success': '#1e1e1e',
          warning: '#ffb74d',
          'on-warning': '#1e1e1e',
          info: '#42a5f5',
          'on-info': '#1e1e1e',
        },
      },
    },
  },
  defaults: {
    VBtn: {
      rounded: 'lg',
      fontWeight: 600,
      style: 'text-transform: none; letter-spacing: 0;',
    },
    VTextField: {
      variant: 'outlined',
      density: 'comfortable',
      hideDetails: 'auto',
      rounded: 'lg',
    },
    VSelect: {
      variant: 'outlined',
      density: 'comfortable',
      hideDetails: 'auto',
      rounded: 'lg',
    },
    VCard: {
      rounded: 'xl',
      elevation: 0,
    },
    VChip: {
      rounded: 'pill',
    },
    VAlert: {
      variant: 'tonal',
      rounded: 'lg',
    },
    VNavigationDrawer: {
      elevation: 0,
    },
    VDataTable: {
      hover: true,
    },
    VSkeletonLoader: {
      boilerplate: false,
    },
  },
})
