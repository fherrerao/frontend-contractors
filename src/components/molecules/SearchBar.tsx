import { SearchOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { AppInput } from '../atoms'

interface SearchBarProps {
  placeholder?: string
  onSearch: (value: string) => void
  delay?: number
}

export function SearchBar({ placeholder = 'Buscar...', onSearch, delay = 350 }: SearchBarProps) {
  const [value, setValue] = useState('')

  useEffect(() => {
    const id = setTimeout(() => onSearch(value.trim()), delay)
    return () => clearTimeout(id)
  }, [value, delay, onSearch])

  return (
    <AppInput
      prefix={<SearchOutlined />}
      placeholder={placeholder}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      style={{ maxWidth: 360 }}
    />
  )
}
