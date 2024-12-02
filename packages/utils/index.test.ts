import { describe, expect, test } from "bun:test"

describe("aoc utils test setup", () => {
	test("env", () => {
		expect(process.env.COOKIE).toBeDefined()
	})
})
