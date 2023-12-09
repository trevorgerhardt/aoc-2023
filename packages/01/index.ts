const digits = {
  one: '1',
  two: '2',
  three: '3',
  four: '4',
  five: '5',
  six: '6',
  seven: '7',
  eight: '8',
  nine: '9',
}

export function calibrateValue(v: string): number {
  const values: string[] = v.split('')
  let firstDigitIndex = values.findIndex((v) => Number.isInteger(parseInt(v)))
  let firstDigit = values[firstDigitIndex]
  let lastDigitIndex = values.findLastIndex((v) =>
    Number.isInteger(parseInt(v)),
  )
  let lastDigit = values[lastDigitIndex]

  if (firstDigitIndex === -1) firstDigitIndex = Infinity
  if (lastDigitIndex === -1) lastDigitIndex = -Infinity

  for (const d of Object.entries(digits)) {
    const i = v.indexOf(d[0])
    const li = v.lastIndexOf(d[0])
    if (i !== -1 && i < firstDigitIndex) {
      firstDigitIndex = i
      firstDigit = d[1]
    }
    if (li !== -1 && li > lastDigitIndex) {
      lastDigitIndex = li
      lastDigit = d[1]
    }
  }

  return parseInt(`${firstDigit}${lastDigit}`)
}
