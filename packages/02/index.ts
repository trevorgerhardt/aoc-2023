import { removeAtIndex } from "../utils"

export function parseInput(input: string) {
	const reports = input.trim().split("\n")
	return reports.map((r) => r.split(/\s+/).map(Number))
}

function isValid(report: number[]) {
	if (report[0] === report[1]) return false
	const increasing = report[0] < report[1]
	for (let i = 0; i < report.length - 1; i++) {
		const diff = report[i + 1] - report[i]
		if (Math.abs(diff) < 1 || Math.abs(diff) > 3) return false
		if (increasing && diff < 0) return false
		if (!increasing && diff > 0) return false
	}
	return true
}

function isValidWithOneDrop(report: number[]) {
	if (isValid(report)) return true
	return report.some((_, i) => isValid(removeAtIndex(report, i)))
}

export function calculateValue(input: string) {
	const reports = parseInput(input)
	return reports.filter((r) => isValidWithOneDrop(r)).length
}
