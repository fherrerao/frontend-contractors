import {
  AuditOutlined,
  CloudUploadOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons'
import { Col, Flex, Grid, Row, Typography, theme } from 'antd'
import type { ReactNode } from 'react'
import { AppLogo } from '../atoms'

const features = [
  {
    icon: <CloudUploadOutlined />,
    title: 'Carga centralizada',
    text: 'Los contratistas suben su documentacion en un solo lugar.',
  },
  {
    icon: <AuditOutlined />,
    title: 'Flujo de aprobacion',
    text: 'Revisa, aprueba o rechaza con trazabilidad completa.',
  },
  {
    icon: <SafetyCertificateOutlined />,
    title: 'Cumplimiento al dia',
    text: 'Controla vencimientos y el estado de cada contratista.',
  },
]

export function AuthTemplate({ children }: { children: ReactNode }) {
  const { token } = theme.useToken()
  const screens = Grid.useBreakpoint()

  return (
    <Row style={{ minHeight: '100vh' }}>
      <Col
        xs={0}
        lg={12}
        style={{
          background:
            'radial-gradient(circle at 20% 20%, #6366f1 0%, transparent 45%), radial-gradient(circle at 80% 80%, #0ea5e9 0%, transparent 40%), #0b1220',
          color: '#fff',
          padding: 56,
        }}
      >
        <Flex vertical justify="space-between" style={{ height: '100%' }}>
          <AppLogo inverse size="large" />
          <Flex vertical gap={32} style={{ maxWidth: 460 }}>
            <Typography.Title style={{ color: '#fff', margin: 0, fontSize: 40, lineHeight: 1.15 }}>
              Gestiona la documentacion de tus contratistas sin friccion
            </Typography.Title>
            <Flex vertical gap={20}>
              {features.map((f) => (
                <Flex key={f.title} gap={16} align="flex-start">
                  <Flex
                    align="center"
                    justify="center"
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: 'rgba(255,255,255,0.12)',
                      fontSize: 18,
                      flexShrink: 0,
                    }}
                  >
                    {f.icon}
                  </Flex>
                  <div>
                    <Typography.Text strong style={{ color: '#fff', display: 'block' }}>
                      {f.title}
                    </Typography.Text>
                    <Typography.Text style={{ color: 'rgba(255,255,255,0.7)' }}>
                      {f.text}
                    </Typography.Text>
                  </div>
                </Flex>
              ))}
            </Flex>
          </Flex>
          <Typography.Text style={{ color: 'rgba(255,255,255,0.5)' }}>
            © {new Date().getFullYear()} Contratistas
          </Typography.Text>
        </Flex>
      </Col>
      <Col xs={24} lg={12} style={{ background: token.colorBgContainer }}>
        <Flex
          vertical
          align="center"
          justify="center"
          style={{ minHeight: '100vh', padding: '40px 24px' }}
        >
          <Flex vertical gap={32} style={{ width: '100%', maxWidth: 400 }}>
            {!screens.lg && (
              <Flex justify="center">
                <AppLogo size="large" />
              </Flex>
            )}
            {children}
          </Flex>
        </Flex>
      </Col>
    </Row>
  )
}
