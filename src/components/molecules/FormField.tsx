import { Form } from 'antd'
import type { FormItemProps } from 'antd'

export function FormField(props: FormItemProps) {
  return <Form.Item {...props} />
}
