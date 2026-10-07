import { InboxOutlined } from '@ant-design/icons'
import { App, Upload } from 'antd'
import type { UploadFile } from 'antd'

const ACCEPTED = ['application/pdf', 'image/jpeg', 'image/png']
const MAX_MB = 10

interface FileUploadFieldProps {
  value?: File | null
  onChange?: (file: File | null) => void
}

export function FileUploadField({ value, onChange }: FileUploadFieldProps) {
  const { message } = App.useApp()
  const fileList: Array<UploadFile> = value
    ? [{ uid: '1', name: value.name, status: 'done', size: value.size }]
    : []

  return (
    <Upload.Dragger
      accept=".pdf,.jpg,.jpeg,.png"
      maxCount={1}
      fileList={fileList}
      beforeUpload={(file) => {
        if (!ACCEPTED.includes(file.type)) {
          message.error('Formato no permitido. Usa PDF, JPG o PNG')
          return Upload.LIST_IGNORE
        }
        if (file.size > MAX_MB * 1024 * 1024) {
          message.error(`El archivo supera ${MAX_MB} MB`)
          return Upload.LIST_IGNORE
        }
        onChange?.(file)
        return false
      }}
      onRemove={() => {
        onChange?.(null)
        return true
      }}
    >
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">Haz clic o arrastra el archivo aqui</p>
      <p className="ant-upload-hint">PDF, JPG o PNG. Maximo {MAX_MB} MB.</p>
    </Upload.Dragger>
  )
}
