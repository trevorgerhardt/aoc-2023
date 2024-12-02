import { describe, expect, test } from 'bun:test'
import { calcLcm, getInput, parse, print } from '../utils'

const DAY = 25

const exampleInput1 = String.raw`
jqt: rhn xhk nvd
rsh: frs pzl lsr
xhk: hfx
cmg: qnr nvd lhk bvb
rhn: xhk bvb hfx
bvb: xhk hfx
pzl: lsr hfx nvd
qnr: nvd
ntq: jqt hfx bvb xhk
nvd: lhk
lsr: lhk
rzs: qnr cmg lsr rsh
frs: qnr lhk lsr
`.trim()

type C = {
  id: string
  cs: Set<C>
}

interface Graph {
  [nodeId: string]: string[]
}
interface NodeGroup {
  [nodeId: string]: string[]
}

function parser(input: string) {
  const components: Graph = {}
  parse.lines(input, row => {
    const ids = row.split(' ').map(id => id.trim())
    for (let i = 0; i < ids.length - 1; i++) {
      const id = i === 0 ? ids[i].substring(0, 3) : ids[i]
      const ci: string[] = components[id] ?? []

      for (let j = i + 1; j < ids.length; j++) {
        const jid = ids[j]
        const cj: string[] = components[jid] ?? []

        if (ci.indexOf(jid) === -1) ci.push(jid)
        if (cj.indexOf(id) === -1) cj.push(id)
        if (!components[jid]) components[jid] = cj
      }

      if (!components[id]) components[id] = ci
    }
  })
  return components
}

function kargerMinCut(graph: Graph): {
  minCutSize: number
  cutEdges: string[][]
  groups: NodeGroup
} {
  let nodes = Object.keys(graph)
  let edges = getEdges(graph)
  const nodeGroups: NodeGroup = {}
  nodes.forEach(node => {
    nodeGroups[node] = [node]
  })
  const cutEdges: string[][] = []

  while (nodes.length > 2) {
    print(nodes.length)
    const randomEdge = edges[Math.floor(Math.random() * edges.length)]
    print(randomEdge)
    if (
      nodeGroups[randomEdge[0]].includes(randomEdge[1]) ||
      nodeGroups[randomEdge[1]].includes(randomEdge[0])
    ) {
      contract(graph, nodeGroups, randomEdge[0], randomEdge[1])
    } else {
      cutEdges.push(randomEdge)
    }

    nodes = Object.keys(graph)
    edges = getEdges(graph)
  }

  return { minCutSize: graph[nodes[0]].length, cutEdges, groups: nodeGroups }
}

function getEdges(graph: Graph): string[][] {
  const edges: string[][] = []
  for (const node in graph) {
    for (const connectedNode of graph[node]) {
      edges.push([node, connectedNode])
    }
  }
  return edges
}

function contract(
  graph: Graph,
  nodeGroups: NodeGroup,
  node1: string,
  node2: string
) {
  print('contract', node1, node2)
  graph[node1] = graph[node1]
    .concat(graph[node2])
    .filter(node => node !== node2)
  nodeGroups[node1] = nodeGroups[node1].concat(nodeGroups[node2])

  for (const node in graph) {
    graph[node] = graph[node].map(connectedNode =>
      connectedNode === node2 ? node1 : connectedNode
    )
  }

  delete graph[node2]
  delete nodeGroups[node2]
}

function calc(components: Graph): number {
  print(components)
  print(kargerMinCut(components))
  return 0
}

describe(`2023-${DAY}`, () => {
  describe('test', async () => {
    test('pt 1 should be', () => {
      expect(calc(parser(exampleInput1))).toBe(54)
    })

    test.skip('pt 2 should be', () => {
      expect(calcPushes(parse(exampleInput2))).toBe(10)
    })
  })

  test.skip('result', async () => {
    const inputFile = await getInput(DAY)
    const parsedInput = parse(inputFile)
    // console.log('result:', calcPulses(parsedInput))
    console.log('result 2:', calcPushes(parsedInput))
    expect(Bun).toBeDefined()
  })
})
