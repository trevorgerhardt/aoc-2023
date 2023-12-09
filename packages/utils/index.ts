export const sum = (n: number[]) => n.reduce((sum, num) => sum + num, 0)
export const uniq = <T>(a: T[]): T[] => a.filter((v, i) => a.indexOf(v) === i)