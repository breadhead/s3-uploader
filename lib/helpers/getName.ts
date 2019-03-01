import * as md5 from 'md5'

import { getParts } from './getParts'

export const getName = (data: Buffer, originalName: string): string => {
  const { baseName, extension } = getParts(originalName)

  return `${md5(data)}_${baseName}.${extension}`
}
