import * as md5 from 'md5'

import { getExtension } from './getExtension'

export const getName = (data: Buffer, originalName: string): string =>
  `${md5(data)}.${getExtension(originalName)}`
