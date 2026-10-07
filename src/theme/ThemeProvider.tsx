import { App as AntApp, ConfigProvider } from 'antd'
import esES from 'antd/locale/es_ES'
import dayjs from 'dayjs'
import 'dayjs/locale/es'
import { createContext, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { buildTheme } from './theme'
import type { ThemeMode } from './theme'

dayjs.locale('es')

const STORAGE_KEY = 'contractors.theme'

interface ThemeModeContextValue {
  mode: ThemeMode
  toggle: () => void
}

const ThemeModeContext = createContext<ThemeModeContextValue>({
  mode: 'light',
  toggle: () => {},
})

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(() =>
    typeof window !== 'undefined' && localStorage.getItem(STORAGE_KEY) === 'dark'
      ? 'dark'
      : 'light',
  )

  const value = useMemo(
    () => ({
      mode,
      toggle: () =>
        setMode((m) => {
          const next = m === 'light' ? 'dark' : 'light'
          localStorage.setItem(STORAGE_KEY, next)
          return next
        }),
    }),
    [mode],
  )

  return (
    <ThemeModeContext.Provider value={value}>
      <ConfigProvider locale={esES} theme={buildTheme(mode)}>
        <AntApp>{children}</AntApp>
      </ConfigProvider>
    </ThemeModeContext.Provider>
  )
}

export const useThemeMode = () => useContext(ThemeModeContext)
