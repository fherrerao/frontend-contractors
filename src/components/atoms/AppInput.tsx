import { Input } from 'antd'
import type { InputProps } from 'antd'
import type { PasswordProps } from 'antd/es/input'

export function AppInput(props: InputProps) {
  return <Input allowClear {...props} />
}

export function AppPasswordInput(props: PasswordProps) {
  return <Input.Password {...props} />
}
