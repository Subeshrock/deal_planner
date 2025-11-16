import { calculateDealScenarios, calculateMonteCarlo } from '../src/lib/calculations'
import { DealFormSchema } from '../src/lib/schema'

describe('Deal Calculations', () => {
  const baseInput = {
    annualRevenue: 1000000,
    churnRate: 5,
    growthRate: 10,
    earnOutPercent: 30,
    earnOutYears: 3,
    sellerFinancingPercent: 20,
    allCashPercent: 10,
    taxRate: 25,
    interestRate: 8,
    currency: 'USD',
    inflationRate: 2,
  }

  describe('calculateDealScenarios', () => {
    it('calculates basic deal scenarios correctly', () => {
      const result = calculateDealScenarios(baseInput)

      expect(result).toHaveProperty('chartData')
      expect(result).toHaveProperty('summary')
      expect(result).toHaveProperty('metrics')

      expect(result.chartData).toHaveLength(3) // 3 years
      expect(result.summary.earnOut.total).toBeGreaterThan(0)
      expect(result.summary.sellerFinancing.total).toBeGreaterThan(0)
      expect(result.summary.allCash.total).toBeGreaterThan(0)
    })

    it('handles edge cases', () => {
      const edgeInput = {
        ...baseInput,
        annualRevenue: 1,
        churnRate: 0,
        growthRate: 0,
        earnOutPercent: 0,
        sellerFinancingPercent: 0,
        allCashPercent: 0,
      }

      const result = calculateDealScenarios(edgeInput)
      expect(result.summary.earnOut.total).toBe(0)
      expect(result.summary.sellerFinancing.total).toBe(0)
      expect(result.summary.allCash.total).toBe(0)
    })

    it('throws error for invalid inputs', () => {
      expect(() => calculateDealScenarios({ ...baseInput, annualRevenue: 0 })).toThrow()
      expect(() => calculateDealScenarios({ ...baseInput, churnRate: -1 })).toThrow()
      expect(() => calculateDealScenarios({ ...baseInput, earnOutPercent: 150 })).toThrow()
    })
  })

  describe('calculateMonteCarlo', () => {
    it('runs Monte Carlo simulation', () => {
      const result = calculateMonteCarlo(baseInput, 100)

      expect(result).toHaveProperty('npv')
      expect(result).toHaveProperty('irr')
      expect(result.npv).toHaveProperty('mean')
      expect(result.npv).toHaveProperty('std')
      expect(result.npv).toHaveProperty('min')
      expect(result.npv).toHaveProperty('max')
    })
  })
})

describe('Schema Validation', () => {
  it('validates correct input', () => {
    const validInput = {
      annualRevenue: 1000000,
      churnRate: 5,
      growthRate: 10,
      earnOutPercent: 30,
      earnOutYears: 3,
      sellerFinancingPercent: 20,
      allCashPercent: 10,
      taxRate: 25,
      interestRate: 8,
      currency: 'USD',
      inflationRate: 2,
    }

    expect(() => DealFormSchema.parse(validInput)).not.toThrow()
  })

  it('rejects invalid inputs', () => {
    const invalidInput = {
      annualRevenue: -100,
      churnRate: 150,
      growthRate: 10,
      earnOutPercent: 30,
      earnOutYears: 3,
      sellerFinancingPercent: 20,
      allCashPercent: 10,
      taxRate: 25,
      interestRate: 8,
      currency: 'USD',
      inflationRate: 2,
    }

    expect(() => DealFormSchema.parse(invalidInput)).toThrow()
  })

  it('validates percentage sum constraint', () => {
    const overLimitInput = {
      annualRevenue: 1000000,
      churnRate: 5,
      growthRate: 10,
      earnOutPercent: 50,
      earnOutYears: 3,
      sellerFinancingPercent: 30,
      allCashPercent: 30, // 50 + 30 + 30 = 110 > 100
      taxRate: 25,
      interestRate: 8,
      currency: 'USD',
      inflationRate: 2,
    }

    expect(() => DealFormSchema.parse(overLimitInput)).toThrow()
  })
})