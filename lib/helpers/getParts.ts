export interface NameParts {
  baseName: string
  extension: string
}

export const getParts = (fullName: string): NameParts => {
  const parts = fullName.split('.').reverse()

  const extension = parts.shift()

  const baseName = parts.reverse().join('.')

  return { baseName, extension }
}
