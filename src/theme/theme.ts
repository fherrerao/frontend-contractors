import { theme } from 'antd'
import type { ThemeConfig } from 'antd'

export type ThemeMode = 'light' | 'dark'

export const SIDER_BG = '#0b1220'

export function buildTheme(mode: ThemeMode): ThemeConfig {
  const isDark = mode === 'dark'
  return {
    algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      colorPrimary: '#4f46e5',
      colorSuccess: '#16a34a',
      colorWarning: '#d97706',
      colorError: '#dc2626',
      colorInfo: '#2563eb',
      borderRadius: 10,
      fontFamily:
        "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      colorBgLayout: isDark ? '#0a0f1a' : '#f4f6fb',
      boxShadowTertiary: '0 1px 2px rgba(16, 24, 40, 0.06), 0 1px 3px rgba(16, 24, 40, 0.08)',
    },
    components: {
      Layout: {
        siderBg: SIDER_BG,
        headerBg: isDark ? '#111827' : '#ffffff',
        headerPadding: '0 24px',
        headerHeight: 64,
      },
      Menu: {
        darkItemBg: SIDER_BG,
        darkSubMenuItemBg: SIDER_BG,
        darkItemSelectedBg: '#4f46e5',
        itemBorderRadius: 8,
        itemMarginInline: 12,
      },
      Card: {
        borderRadiusLG: 14,
      },
      Table: {
        headerBg: isDark ? '#1f2937' : '#f8fafc',
      },
      Button: {
        fontWeight: 500,
      },
    },
  }
}
