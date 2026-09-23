export type ToolCategory = 'image' | 'pdf' | 'document' | 'presentation' | 'archive' | 'data' | 'utility'

export type ImageToolId = 'image-compress' | 'image-convert' | 'image-resize' | 'image-rotate' | 'image-flip'

export type FileToolId =
  | 'word-to-pdf'
  | 'pdf-to-word'
  | 'pdf-to-images'
  | 'pdf-to-text'
  | 'pdf-merge'
  | 'pdf-split'
  | 'pdf-extract-pages'
  | 'pdf-remove-pages'
  | 'pdf-rotate-pages'
  | 'pdf-reorder-pages'
  | 'pdf-watermark'
  | 'pdf-page-numbers'
  | 'images-to-pdf'
  | 'docx-to-html'
  | 'docx-to-text'
  | 'text-to-docx'
  | 'images-to-pptx'
  | 'text-to-pptx'
  | 'zip-create'
  | 'zip-extract'
  | 'json-format'
  | 'csv-to-json'
  | 'json-to-csv'
  | 'file-checksum'
  | 'file-to-base64'
  | 'base64-to-file'

export type ToolId = ImageToolId | FileToolId

export type LocalizedText = {
  en: string
  zh: string
}

export type ToolDefinition = {
  id: ToolId
  category: ToolCategory
  path: string
  badge: string
  title: LocalizedText
  description: LocalizedText
  action: LocalizedText
  accept?: string
  multiple?: boolean
  input: 'files' | 'text' | 'base64'
}

export type ToolResult = {
  blob?: Blob
  text?: string
  filename: string
  mimeType: string
}
