import {describe, expect,test } from 'bun:test'

type Seq = ('L' | 'R')[]
type Node = {L: string, R: string}
type Nodes = Record<string, Node>

function parseFile (file: string) {
  const [sequenceLine, ...rest] = file.split('\n')
  const nodes: Nodes = {}
  rest.slice(1).forEach((row) => {
    const [label, sides] = row.split(' = ')
    const [L, R] = sides.slice(1, -1).split(', ')
    nodes[label] = {R, L}
  })

  return [
    sequenceLine.split('') as Seq,
    nodes
  ] as const
}

function calcSteps (start: string, seq: Seq, nodes: Nodes) {
  let stepsTaken = 0
  let currentNode = start
  while (!currentNode.endsWith('Z')) {
    const sequenceStep = stepsTaken % seq.length
    const lr = seq[sequenceStep]
    currentNode = nodes[currentNode][lr]
    stepsTaken++
  }
  return stepsTaken
}

const calcGcf = (a: number, b: number): number => b === 0 ? a : calcGcf(b, a % b) 
const calcLcm = (a: number, b: number): number => (a * b) / calcGcf(a, b)

function calcResults(results: ReturnType<typeof parseFile>): number {
  const [sequence, nodes] = results
  const startingNodes = Object.keys(nodes).filter(n => n.endsWith('A'))
  const minSteps = startingNodes.map(n => calcSteps(n, sequence, nodes))
  return minSteps.reduce((lcm, steps) => calcLcm(lcm, steps))
}

describe('test', async () => {
  const testFile = await Bun.file(`${import.meta.dir}/../../data/08-test.txt`).text()
  const hands = parseFile(testFile)
  test('pt 1 should be', () => {
    expect(calcResults(hands)).toBe(6)
  })
})

test('result', async () => {
  const inputFile = await Bun.file(`${import.meta.dir}/../../data/08-input.txt`).text()
  const hands = parseFile(inputFile)
  console.log('total steps', calcResults(hands))
  expect(Bun).toBeDefined()
})