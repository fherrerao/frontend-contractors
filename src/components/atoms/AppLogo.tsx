import { SafetyCertificateFilled } from '@ant-design/icons'
import { Flex, Typography } from 'antd'

interface AppLogoProps {
  collapsed?: boolean
  inverse?: boolean
  size?: 'default' | 'large'
}

export function AppLogo({ collapsed, inverse, size = 'default' }: AppLogoProps) {
  const iconSize = size === 'large' ? 40 : 32
  return (
    <Flex align="center" gap={10}>
      <Flex
        align="center"
        justify="center"
        style={{
          width: iconSize,
          height: iconSize,
          borderRadius: 10,
          background: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)',
          color: '#fff',
          fontSize: iconSize * 0.55,
          flexShrink: 0,
        }}
      >
        <SafetyCertificateFilled />
      </Flex>
      {!collapsed && (
        <Typography.Text
          strong
          style={{
            fontSize: size === 'large' ? 20 : 16,
            color: inverse ? '#fff' : undefined,
            whiteSpace: 'nowrap',
          }}
        >
          ContratistasPro
        </Typography.Text>
      )}
    </Flex>
  )
}
