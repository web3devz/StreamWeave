// Currency Conversion Service for TFIL/USDFC
// Handles real-time exchange rates and currency conversion

interface ExchangeRate {
  from: string
  to: string
  rate: number
  timestamp: number
  source: string
}

interface CurrencyAmount {
  amount: number
  currency: 'TFIL' | 'USDFC' | 'FIL'
  usdValue?: number
}

interface ConversionResult {
  originalAmount: CurrencyAmount
  convertedAmount: CurrencyAmount
  exchangeRate: number
  timestamp: number
}

export class CurrencyConverter {
  private exchangeRates: Map<string, ExchangeRate> = new Map()
  private lastUpdate: number = 0
  private updateInterval: number = 5000 // 5 seconds for more responsive updates
  
  constructor() {
    this.initializeRates()
    this.startRateUpdates()
    console.log('💱 Currency Converter initialized with TFIL/USDFC support')
  }

  // Initialize default exchange rates
  private initializeRates(): void {
    // Mock exchange rates for MVP (in production, would fetch from real APIs)
    const rates: ExchangeRate[] = [
      {
        from: 'TFIL',
        to: 'USDFC',
        rate: 4.25, // 1 TFIL = 4.25 USDFC
        timestamp: Date.now(),
        source: 'coinbase'
      },
      {
        from: 'USDFC',
        to: 'TFIL',
        rate: 0.235, // 1 USDFC = 0.235 TFIL
        timestamp: Date.now(),
        source: 'coinbase'
      },
      {
        from: 'FIL',
        to: 'USDFC',
        rate: 4.18, // 1 FIL = 4.18 USDFC
        timestamp: Date.now(),
        source: 'coinbase'
      },
      {
        from: 'USDFC',
        to: 'FIL',
        rate: 0.239, // 1 USDFC = 0.239 FIL
        timestamp: Date.now(),
        source: 'coinbase'
      }
    ]

    rates.forEach(rate => {
      const key = `${rate.from}_${rate.to}`
      this.exchangeRates.set(key, rate)
    })
  }

  // Start automatic rate updates
  private startRateUpdates(): void {
    setInterval(() => {
      this.updateExchangeRates()
    }, this.updateInterval)
  }

  // Update exchange rates (simulate API calls)
  private async updateExchangeRates(): Promise<void> {
    try {
      // Simulate rate fluctuations (in production, would call real APIs)
      const baseRates = {
        TFIL_USDFC: 4.25,
        USDFC_TFIL: 0.235,
        FIL_USDFC: 4.18,
        USDFC_FIL: 0.239
      }

      // Add small random fluctuations (±2%)
      Object.entries(baseRates).forEach(([pair, baseRate]) => {
        const fluctuation = (Math.random() - 0.5) * 0.04 // ±2%
        const newRate = baseRate * (1 + fluctuation)
        
        const [from, to] = pair.split('_')
        const rate: ExchangeRate = {
          from,
          to,
          rate: Number(newRate.toFixed(4)),
          timestamp: Date.now(),
          source: 'simulated_api'
        }
        
        this.exchangeRates.set(pair, rate)
      })

      this.lastUpdate = Date.now()
      console.log('💱 Exchange rates updated')
      
    } catch (error) {
      console.error('Failed to update exchange rates:', error)
    }
  }

  // Convert TFIL to USDFC
  convertTFilToUsdfc(tfilAmount: number): ConversionResult {
    const rate = this.exchangeRates.get('TFIL_USDFC')
    if (!rate) {
      throw new Error('TFIL/USDFC exchange rate not available')
    }

    const convertedAmount = tfilAmount * rate.rate

    return {
      originalAmount: {
        amount: tfilAmount,
        currency: 'TFIL'
      },
      convertedAmount: {
        amount: Number(convertedAmount.toFixed(4)),
        currency: 'USDFC'
      },
      exchangeRate: rate.rate,
      timestamp: Date.now()
    }
  }

  // Convert USDFC to TFIL
  convertUsdfcToTFil(usdfcAmount: number): ConversionResult {
    const rate = this.exchangeRates.get('USDFC_TFIL')
    if (!rate) {
      throw new Error('USDFC/TFIL exchange rate not available')
    }

    const convertedAmount = usdfcAmount * rate.rate

    return {
      originalAmount: {
        amount: usdfcAmount,
        currency: 'USDFC'
      },
      convertedAmount: {
        amount: Number(convertedAmount.toFixed(6)),
        currency: 'TFIL'
      },
      exchangeRate: rate.rate,
      timestamp: Date.now()
    }
  }

  // Convert FIL to USDFC
  convertFilToUsdfc(filAmount: number): ConversionResult {
    const rate = this.exchangeRates.get('FIL_USDFC')
    if (!rate) {
      throw new Error('FIL/USDFC exchange rate not available')
    }

    const convertedAmount = filAmount * rate.rate

    return {
      originalAmount: {
        amount: filAmount,
        currency: 'FIL'
      },
      convertedAmount: {
        amount: Number(convertedAmount.toFixed(4)),
        currency: 'USDFC'
      },
      exchangeRate: rate.rate,
      timestamp: Date.now()
    }
  }

  // Get current exchange rate
  getExchangeRate(from: string, to: string): ExchangeRate | null {
    const key = `${from}_${to}`
    return this.exchangeRates.get(key) || null
  }

  // Get all supported currency pairs
  getSupportedPairs(): string[] {
    return Array.from(this.exchangeRates.keys())
  }

  // Format currency amount with proper decimals
  formatCurrency(amount: number, currency: 'TFIL' | 'USDFC' | 'FIL'): string {
    switch (currency) {
      case 'TFIL':
      case 'FIL':
        return `${amount.toFixed(6)} ${currency}`
      case 'USDFC':
        return `${amount.toFixed(4)} ${currency}`
      default:
        return `${amount.toFixed(4)} ${currency}`
    }
  }

  // Get dual currency display (shows both TFIL and USDFC values)
  getDualCurrencyDisplay(amount: number, baseCurrency: 'TFIL' | 'USDFC' | 'FIL'): string {
    try {
      if (baseCurrency === 'TFIL') {
        const conversion = this.convertTFilToUsdfc(amount)
        return `${this.formatCurrency(amount, 'TFIL')} (${this.formatCurrency(conversion.convertedAmount.amount, 'USDFC')})`
      } else if (baseCurrency === 'USDFC') {
        const conversion = this.convertUsdfcToTFil(amount)
        return `${this.formatCurrency(amount, 'USDFC')} (${this.formatCurrency(conversion.convertedAmount.amount, 'TFIL')})`
      } else if (baseCurrency === 'FIL') {
        const conversion = this.convertFilToUsdfc(amount)
        return `${this.formatCurrency(amount, 'FIL')} (${this.formatCurrency(conversion.convertedAmount.amount, 'USDFC')})`
      }
      
      return this.formatCurrency(amount, baseCurrency)
    } catch (error) {
      console.error('Currency conversion error:', error)
      return this.formatCurrency(amount, baseCurrency)
    }
  }

  // Calculate payment in preferred currency
  calculatePayment(baseAmount: number, baseCurrency: 'TFIL' | 'USDFC' | 'FIL', targetCurrency: 'TFIL' | 'USDFC' | 'FIL'): ConversionResult {
    if (baseCurrency === targetCurrency) {
      return {
        originalAmount: { amount: baseAmount, currency: baseCurrency },
        convertedAmount: { amount: baseAmount, currency: targetCurrency },
        exchangeRate: 1,
        timestamp: Date.now()
      }
    }

    if (baseCurrency === 'TFIL' && targetCurrency === 'USDFC') {
      return this.convertTFilToUsdfc(baseAmount)
    } else if (baseCurrency === 'USDFC' && targetCurrency === 'TFIL') {
      return this.convertUsdfcToTFil(baseAmount)
    } else if (baseCurrency === 'FIL' && targetCurrency === 'USDFC') {
      return this.convertFilToUsdfc(baseAmount)
    }

    throw new Error(`Conversion from ${baseCurrency} to ${targetCurrency} not supported`)
  }

  // Get market data summary
  getMarketSummary() {
    const tfilRate = this.exchangeRates.get('TFIL_USDFC')
    const filRate = this.exchangeRates.get('FIL_USDFC')
    
    return {
      tfilToUsdfc: tfilRate?.rate || 0,
      filToUsdfc: filRate?.rate || 0,
      lastUpdate: this.lastUpdate,
      supportedPairs: this.getSupportedPairs().length,
      status: 'active'
    }
  }

  // Check if rates are stale
  areRatesStale(): boolean {
    const staleThreshold = 5 * 60 * 1000 // 5 minutes
    return Date.now() - this.lastUpdate > staleThreshold
  }

  // Force rate refresh
  async refreshRates(): Promise<void> {
    await this.updateExchangeRates()
  }
}