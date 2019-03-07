import CyrillicToTranslit from 'cyrillic-to-translit-js'
import * as md5 from 'md5'

import { getParts } from './getParts'

export const getName = (data: Buffer, originalName: string): string => {
  const transliterator = new CyrillicToTranslit()

  const transliteratedName = transliterator.transform(originalName)

  const { baseName, extension } = getParts(transliteratedName)

  return `${md5(data)}_${baseName}.${extension}`
}
