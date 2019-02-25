export const getExtension = (name: string): string =>
  name.split('.').reverse()[0] || ''
