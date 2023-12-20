import { describe, expect, test } from 'bun:test'
import { calcLcm, getInput } from '../utils'

const DAY = 20

const exampleInput1 = String.raw`
broadcaster -> a, b, c
%a -> b
%b -> c
%c -> inv
&inv -> a
`.trim()

const exampleInput2 = String.raw`
broadcaster -> a
%a -> inv, con
&inv -> b
%b -> con
&con -> output
`.trim()

type PulseType = 'low' | 'high' | 'rx'
type ModuleType = '&' | '%' | 'broadcaster' | 'button'
type Module = {
  d: string[]
  n: string
  t: ModuleType
  isOn: boolean
  pulses: {
    [name: string]: PulseType
  }
}
type Modules = Record<string, Module>

function parse(input: string) {
  const modules: Modules = {
    button: {
      d: ['broadcaster'],
      n: 'button',
      t: 'button',
      pulses: {},
      isOn: false,
    },
  }
  for (const row of input.split('\n')) {
    const [label, destinations] = row.split('->')
    const t = label.includes('%')
      ? '%'
      : label.includes('&')
        ? '&'
        : 'broadcaster'
    const n = t === 'broadcaster' ? label.trim() : label.trim().slice(1)
    modules[n] = {
      d: destinations.split(',').map(d => d.trim()),
      n,
      t,
      isOn: false,
      pulses: {},
    }
  }

  for (const m of Object.values(modules)) {
    if (m.t === '&') continue
    for (const d of m.d) {
      if (modules[d].t === '&') {
        modules[d].pulses[m.n] = 'low'
      }
    }
  }

  return modules
}

type PulseTracker = Record<PulseType, number>
type Pulse = { n: string; d: string; t: PulseType }

function pushButton(
  modules: Modules,
  pulseTracker: Record<string, number> = {},
  pushTracker = 0,
) {
  const pulseCount: PulseTracker = { low: 0, high: 0, rx: 0 }
  let pulses: Pulse[] = [
    {
      n: 'button',
      d: 'broadcaster',
      t: 'low',
    },
  ]
  let pulseRounds = 0
  while (pulses.length > 0) {
    pulseRounds++
    const newPulses: Pulse[] = []
    for (const pulse of pulses) {
      // print(`${pulse.n} -> ${pulse.t} --> ${pulse.d}`)
      pulseCount[pulse.t]++
      const module = modules[pulse.d]
      if (!module) {
        if (pulse.d === 'rx' && pulse.t === 'low') pulseCount.rx++
        continue
      }
      let t = pulse.t
      if (module.t === '%') {
        if (pulse.t === 'high') continue
        t = module.isOn ? 'low' : 'high'
        module.isOn = !module.isOn
      } else if (module.t === '&') {
        if (
          module.n === 'th' &&
          pulse.t === 'high' &&
          pulseTracker[pulse.n] === -1
        ) {
          pulseTracker[pulse.n] = pushTracker
        }

        module.pulses[pulse.n] = module.pulses[pulse.n] ?? []
        module.pulses[pulse.n] = pulse.t
        t = Object.values(module.pulses).every(t => t === 'high')
          ? 'low'
          : 'high'
      }
      for (const d of module.d) {
        newPulses.push({ n: module.n, d, t })
      }
    }
    pulses = newPulses
  }
  return pulseCount
}

function calcPulses(input: ReturnType<typeof parse>): number {
  const totalPulses = { low: 0, high: 0, rx: 0 }
  for (let i = 0; i < 1000; i++) {
    const pulses = pushButton(input)
    totalPulses.low += pulses.low
    totalPulses.high += pulses.high
  }
  return totalPulses.high * totalPulses.low
}

function calcPushes(input: ReturnType<typeof parse>): number {
  let buttonPushes = 0
  const pulseTracker: Record<string, number> = {
    xf: -1,
    zl: -1,
    xn: -1,
    qn: -1,
  }
  while (true) {
    pushButton(input, pulseTracker, ++buttonPushes)
    if (!Object.values(pulseTracker).includes(-1)) break
  }

  return calcLcm(...Object.values(pulseTracker))
}

describe(`2023-${DAY}`, () => {
  describe('test', async () => {
    test.skip('pt 1 should be', () => {
      expect(calcPulses(parse(exampleInput1))).toBe(32000000)
      expect(calcPulses(parse(exampleInput2))).toBe(11687500)
    })

    test.skip('pt 2 should be', () => {
      expect(calcPushes(parse(exampleInput2))).toBe(10)
    })
  })

  test('result', async () => {
    const inputFile = await getInput(DAY)
    const parsedInput = parse(inputFile)
    // console.log('result:', calcPulses(parsedInput))
    console.log('result 2:', calcPushes(parsedInput))
    expect(Bun).toBeDefined()
  })
})
