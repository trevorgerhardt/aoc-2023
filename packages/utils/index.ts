export type Coord = { x: number; y: number }
export type CoordZ = { x: number; y: number; z: number }
export type Dir = "n" | "s" | "w" | "e"

export const coordToStr = (c: Coord) => `${c.y},${c.x}`

export function mod(a: number, b: number) {
	return ((a % b) + b) % b
}

export function range(len: number) {
	return [...Array(len).keys()]
}

export function filterIndex<T>(array: T[], index: number): T[] {
	return array.filter((_, i) => i !== index)
}

function hasIterator(value: unknown): boolean {
	return typeof value === "object" && value != null && Symbol.iterator in value
}

export function key(...items: unknown[]) {
	return JSON.stringify(items)
}

export function isSubsetOf<T>(a: Set<T>, b: Set<T>) {
	if (a.size > b.size) return false
	for (const a0 of a) {
		if (!b.has(a0)) return false
	}
	return true
}

export const sum = (n: number[]) => n.reduce((total, num) => total + num, 0)
export const sumValues = <T extends number>(
	o: { [s: string]: T } | ArrayLike<T>,
) => sum(Object.values(o))
export const sumWith = <T>(a: T[], fn: (v: T, i: number, a: T[]) => number) =>
	a.reduce((total, v, i) => total + fn(v, i, a), 0)
export const uniq = <T>(a: T[]): T[] => a.filter((v, i) => a.indexOf(v) === i)

const calcGcf = (a: number, b: number): number =>
	b === 0 ? a : calcGcf(b, a % b)
export const calcLcm = (...nums: number[]): number =>
	nums.reduce((a, b) => (a * b) / calcGcf(a, b))

export function transpose<T>(matrix: T[][]) {
	return matrix[0].map((_, c) => matrix.map((_, r) => matrix[r][c]))
}

export function matrixToString<T>(m: T[][]) {
	return m.map((r) => r.join(" ")).join("\n")
}

export function timestamp(ns = Bun.nanoseconds()) {
	const ms = ns / 1_000_000
	if (ms < 1) return `${ms.toFixed(3)}ms`
	if (ms < 1_000) return `${ms.toFixed(1)}ms`
	const s = ms / 1_000
	if (s < 60) return `${s.toFixed(1)}s`
	const m = s / 60
	if (m < 60) return `${m.toFixed(0)}m${(s % 60).toFixed(0)}s`
	const h = m / 60
	if (h < 24) return `${h.toFixed(0)}h${(m % 60).toFixed(0)}}`
	const d = h / 24
	if (d < 365) return `${d.toFixed(0)}d${(h % 24).toFixed(0)}`
	const y = d / 365
	return `${y.toLocaleString()} years`
}

export function print(...data: unknown[]) {
	return console.log(`${timestamp()} $`, ...data)
}

export function estimatedFinishTime(
	iterations: number,
	last: number,
	now = Bun.nanoseconds(),
) {
	return timestamp((now - last) * iterations)
}

export function createPrintEstimatedFinishTime() {
	let prev = Bun.nanoseconds()
	return function printEstimate(left: number) {
		const now = Bun.nanoseconds()
		print(`estimated finish time: ${estimatedFinishTime(left, prev, now)}`)
		prev = now
	}
}

type MapFn<U = string> = (i: string) => U

export const parse = {
	lines: <U = string>(i: string, m?: MapFn<U>, s = "\n") =>
		parse.split(i, m, s),
	chars: <U = string>(i: string, m?: MapFn<U>, s = "") =>
		parse.lines(i, (r) => parse.split(r, m, s)),
	nums: (i: string, s = " ") => parse.split(i, (x) => Number(x), s),
	split<U = string>(i: string, m?: MapFn<U>, s = ""): U[] {
		const c = i.split(s)
		return m ? c.map(m) : (c as U[])
	},
}

/**
 * Parse groups of numbers from a string and return an array of those numbers.
 * @param s
 * @returns
 */
export const nums = (s: string, splitWith = " ") =>
	s.split(splitWith).map(Number)

const baseUrl = "https://adventofcode.com"
export async function getInput(day: number, year = 2024) {
	const filename = `${year}-${day}.txt`
	const filePath = `${import.meta.dir}/../../data/${filename}`
	const file = Bun.file(filePath)
	const exists = await file.exists()
	if (!exists) {
		console.log(`File ${filename} not found, fetching from ${baseUrl}.`)
		const Cookie = process.env.COOKIE
		if (!Cookie) throw new Error("process.env.COOKIE must be set")
		const headers = new Headers({ Cookie })
		const res = await fetch(`${baseUrl}/${year}/day/${day}/input`, { headers })
		if (!res.ok) throw new Error(`Failed to fetch input: ${res.statusText}`)
		const text = await res.text()
		await Bun.write(file, text.trim())
	}
	return Bun.file(filePath).text()
}
