import { describe, expect, test } from "bun:test"
import { calculateValue } from "."
import { getInput } from "../utils"

describe("2024-", () => {
	test("calculateValue", () => {
		expect(calculateValue()).toBe(0)
	})
})
