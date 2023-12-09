import {describe, expect,test } from 'bun:test'

function parseFile (file: string) {
  const [timeLine, distanceLine] = file.split('\n')
  const ts = Array.from(timeLine.match(/\d+/g)!).map(s => +s)
  const ds = Array.from(distanceLine.match(/\d+/g)!).map(s => +s)
  return [ts, ds]
}

function waysToBeat (raceLengthMs: number, record: number) {
  const holdTimes: number[] = []
  for (let holdTimeMs = 0; holdTimeMs < raceLengthMs; holdTimeMs++) {
    const d = (raceLengthMs - holdTimeMs) * holdTimeMs
    if (d > record) holdTimes.push(holdTimeMs)
  }
  return holdTimes
}

function chancesToBeat (raceLengthTimes: number[], recordDistances: number[]) {
  return raceLengthTimes.reduce((c, t, i) => c * waysToBeat(t, recordDistances[i]).length, 1)
}

describe('2023-06', () => {
  describe('test', async () => {
    const testFile = await Bun.file(`${import.meta.dir}/../../data/06-test.txt`).text()
    const [ts, ds] = parseFile(testFile)
    test('pt 1 should be', () => {
      expect(ts.length).toEqual(3)
      expect(ds.length).toBe(3)
      expect(chancesToBeat(ts, ds)).toBe(288)
    })

    test('p2 should be', () => {
      expect(chancesToBeat(
        [+ts.map(n => `${n}`).join('')],
        [+ds.map(n => `${n}`).join('')],
      )).toBe(71503)
    })
  })

  test('result', async () => {
    const inputFile = await Bun.file(`${import.meta.dir}/../../data/06-input.txt`).text()
    const [ts, ds] = parseFile(inputFile)
    console.log('pt 1', chancesToBeat(ts, ds))
    console.log('pt 2', chancesToBeat(
      [+ts.map(n => `${n}`).join('')],
      [+ds.map(n => `${n}`).join('')],
    ))
    expect(Bun).toBeDefined()
  })
})