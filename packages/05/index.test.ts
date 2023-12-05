import {describe, expect,test } from 'bun:test'

function parseFile (file: string) {
  const [seedLine, ...mapSections] = file.split('\n\n')
  const seeds = Array.from(seedLine.match(/\d+/g)!).map(s => +s)

  const maps = mapSections.map(section => {
    const [, ...lines] = section.split('\n')
    return lines.map(line => Array.from(line.match(/\d+/g)!).map(s => +s))
  })

  return [seeds, maps] as const
}

function getDestinationId(sourceId: number, map: number[][]) {
  for (const [drs, srs, rl] of map) {
    if (srs <= sourceId && (srs + rl) > sourceId) {
      return drs + (sourceId - srs)
    }
  }
  return sourceId
}

function closestLocation (seeds: number[], maps: number[][][]) {
  let closest = Infinity
  for (const seed of seeds) {
    let id = seed
    for (const map of maps) {
      id = getDestinationId(id, map)
    }
    if (id < closest) closest = id
  }
  return closest
}

function closestLocationRanges (seeds: number[], maps: number[][][]) {
  let closest = Infinity
  for (let i = 0; i < seeds.length - 1; i += 2) {
    for (let seed = seeds[i]; seed < seeds[i] + seeds[i + 1]; seed++) {
      let id = seed
      for (const map of maps) {
        id = getDestinationId(id, map)
      }
      if (id < closest) closest = id
    }
  }
  return closest
}

describe('test', async () => {
  const testFile = await Bun.file(`${import.meta.dir}/../../data/05-test.txt`).text()
  const [seeds, maps] = parseFile(testFile)
  test('pt 1 should be', () => {
    expect(maps.length).toEqual(7)
    expect(closestLocation(seeds, maps)).toBe(35)
  })

  test('p2 should be', () => {
    expect(closestLocationRanges(seeds, maps)).toBe(46)
  })
})

describe('result', async () => {
  const inputFile = await Bun.file(`${import.meta.dir}/../../data/05-input.txt`).text()
  const [seeds, maps] = parseFile(inputFile)
  console.log('pt 1', closestLocation(seeds, maps))
  console.log('pt 2', closestLocationRanges(seeds, maps))
})