import CyrillicToTranslit from 'cyrillic-to-translit-js'
import md5 from 'md5'

import { getParts } from './getParts'

export const getName = (data: Buffer, originalName: string): string => {
  const transliterator = new CyrillicToTranslit()

  const transliteratedName = transliterator
    .transform(originalName)
    .replace(/\s/g, '_')

  const { baseName, extension } = getParts(transliteratedName)

  return `${md5(data)}_${baseName}.${extension}`
}
