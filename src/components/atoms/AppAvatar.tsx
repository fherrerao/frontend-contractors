import { Avatar } from 'antd'
import type { AvatarProps } from 'antd'

const palette = ['#4f46e5', '#0891b2', '#16a34a', '#d97706', '#db2777', '#7c3aed']

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
}

export function AppAvatar({ name, ...props }: AvatarProps & { name: string }) {
  const color = palette[name.length % palette.length]
  return (
    <Avatar style={{ backgroundColor: color, fontWeight: 600, flexShrink: 0 }} {...props}>
      {initials(name)}
    </Avatar>
  )
}
