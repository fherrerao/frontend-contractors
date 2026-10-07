import { LockOutlined, MailOutlined } from '@ant-design/icons'
import { Alert, Checkbox, Flex, Form, Typography } from 'antd'
import { useState } from 'react'
import { AppButton, AppInput, AppPasswordInput } from '../atoms'
import { FormField } from '../molecules'

export interface LoginValues {
  email: string
  password: string
  remember: boolean
}

interface LoginFormProps {
  onSubmit: (values: LoginValues) => Promise<void>
}

export function LoginForm({ onSubmit }: LoginFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFinish = async (values: LoginValues) => {
    setLoading(true)
    setError(null)
    try {
      await onSubmit(values)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No fue posible iniciar sesion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Flex vertical gap={24} style={{ width: '100%' }}>
      <div>
        <Typography.Title level={2} style={{ marginBottom: 4 }}>
          Bienvenido
        </Typography.Title>
        <Typography.Text type="secondary">
          Ingresa tus credenciales para acceder a la plataforma
        </Typography.Text>
      </div>

      {error && <Alert type="error" showIcon title={error} />}

      <Form<LoginValues>
        layout="vertical"
        size="large"
        requiredMark={false}
        initialValues={{ remember: true }}
        onFinish={handleFinish}
        onValuesChange={() => error && setError(null)}
      >
        <FormField
          label="Correo electronico"
          name="email"
          rules={[
            { required: true, message: 'Ingresa tu correo' },
            { type: 'email', message: 'Correo invalido' },
          ]}
        >
          <AppInput prefix={<MailOutlined />} placeholder="usuario@empresa.com" autoComplete="email" />
        </FormField>
        <FormField
          label="Contrasena"
          name="password"
          rules={[{ required: true, message: 'Ingresa tu contrasena' }]}
        >
          <AppPasswordInput
            prefix={<LockOutlined />}
            placeholder="••••••••"
            autoComplete="current-password"
          />
        </FormField>
        <FormField name="remember" valuePropName="checked">
          <Checkbox>Recordar sesion</Checkbox>
        </FormField>
        <AppButton type="primary" htmlType="submit" block loading={loading}>
          Iniciar sesion
        </AppButton>
      </Form>
    </Flex>
  )
}
