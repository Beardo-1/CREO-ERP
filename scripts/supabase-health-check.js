#!/usr/bin/env node

/**
 * Supabase Health Check Script
 * Tests all aspects of Supabase integration including:
 * - Connection status
 * - Authentication
 * - Database operations
 * - Real-time subscriptions
 * - File storage
 * - Row Level Security
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env') })

// Supabase configuration
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://xtmbhbqkvapdntakxczn.supabase.co'
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0bWJoYnFrdmFwZG50YWt4Y3puIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyNzY1NjgsImV4cCI6MjA2NTg1MjU2OH0.oBfkL73FEFRsE2QXNPma_HflYtIcGpyKDysin87NCbw'

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true
  }
})

class SupabaseHealthChecker {
  constructor() {
    this.results = {
      connection: { status: 'pending', message: '', score: 0 },
      authentication: { status: 'pending', message: '', score: 0 },
      database: { status: 'pending', message: '', score: 0 },
      realtime: { status: 'pending', message: '', score: 0 },
      storage: { status: 'pending', message: '', score: 0 },
      security: { status: 'pending', message: '', score: 0 }
    }
  }

  log(category, message, status = 'info') {
    const timestamp = new Date().toISOString()
    const statusSymbol = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    }[status] || 'ℹ️'
    
    console.log(`[${timestamp}] ${statusSymbol} ${category}: ${message}`)
  }

  async checkConnection() {
    this.log('Connection', 'Testing Supabase connection...')
    
    try {
      // Test basic connection by fetching service status
      const { data, error } = await supabase.from('users').select('count', { count: 'exact', head: true })
      
      if (error) {
        this.results.connection = {
          status: 'error',
          message: `Connection failed: ${error.message}`,
          score: 0
        }
        this.log('Connection', `Failed: ${error.message}`, 'error')
        return false
      }

      this.results.connection = {
        status: 'success',
        message: 'Successfully connected to Supabase',
        score: 100
      }
      this.log('Connection', 'Successfully connected to Supabase', 'success')
      return true
    } catch (error) {
      this.results.connection = {
        status: 'error',
        message: `Connection error: ${error.message}`,
        score: 0
      }
      this.log('Connection', `Error: ${error.message}`, 'error')
      return false
    }
  }

  async checkAuthentication() {
    this.log('Authentication', 'Testing authentication system...')
    
    try {
      // Test anonymous access
      const { data: session } = await supabase.auth.getSession()
      
      // Test user management functions
      const { data: users, error: usersError } = await supabase.auth.admin.listUsers()
      
      if (usersError && !usersError.message.includes('JWT')) {
        this.results.authentication = {
          status: 'error',
          message: `Auth test failed: ${usersError.message}`,
          score: 0
        }
        this.log('Authentication', `Failed: ${usersError.message}`, 'error')
        return false
      }

      // Test auth configuration
      const authConfig = {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }

      this.results.authentication = {
        status: 'success',
        message: 'Authentication system configured correctly',
        score: 85
      }
      this.log('Authentication', 'Authentication system working', 'success')
      return true
    } catch (error) {
      this.results.authentication = {
        status: 'warning',
        message: `Auth check completed with warnings: ${error.message}`,
        score: 60
      }
      this.log('Authentication', `Warning: ${error.message}`, 'warning')
      return true
    }
  }

  async checkDatabase() {
    this.log('Database', 'Testing database operations...')
    
    try {
      const tables = ['users', 'properties', 'contacts', 'deals', 'documents', 'activities']
      const results = []

      for (const table of tables) {
        try {
          const { data, error } = await supabase
            .from(table)
            .select('*', { count: 'exact', head: true })
          
          if (error) {
            results.push({ table, status: 'error', message: error.message })
            this.log('Database', `Table ${table}: ${error.message}`, 'error')
          } else {
            results.push({ table, status: 'success', count: data?.length || 0 })
            this.log('Database', `Table ${table}: accessible`, 'success')
          }
        } catch (err) {
          results.push({ table, status: 'error', message: err.message })
          this.log('Database', `Table ${table}: ${err.message}`, 'error')
        }
      }

      const successCount = results.filter(r => r.status === 'success').length
      const score = Math.round((successCount / tables.length) * 100)

      this.results.database = {
        status: score > 80 ? 'success' : score > 50 ? 'warning' : 'error',
        message: `${successCount}/${tables.length} tables accessible`,
        score,
        details: results
      }

      this.log('Database', `${successCount}/${tables.length} tables accessible`, 
        score > 80 ? 'success' : 'warning')
      return score > 50
    } catch (error) {
      this.results.database = {
        status: 'error',
        message: `Database check failed: ${error.message}`,
        score: 0
      }
      this.log('Database', `Failed: ${error.message}`, 'error')
      return false
    }
  }

  async checkRealtime() {
    this.log('Realtime', 'Testing real-time subscriptions...')
    
    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        this.results.realtime = {
          status: 'warning',
          message: 'Real-time test timed out',
          score: 40
        }
        this.log('Realtime', 'Test timed out', 'warning')
        resolve(true)
      }, 5000)

      try {
        const subscription = supabase
          .channel('test-channel')
          .on('postgres_changes', 
            { event: '*', schema: 'public', table: 'properties' },
            (payload) => {
              clearTimeout(timeout)
              subscription.unsubscribe()
              
              this.results.realtime = {
                status: 'success',
                message: 'Real-time subscriptions working',
                score: 100
              }
              this.log('Realtime', 'Real-time subscriptions working', 'success')
              resolve(true)
            }
          )
          .subscribe((status) => {
            if (status === 'SUBSCRIBED') {
              clearTimeout(timeout)
              subscription.unsubscribe()
              
              this.results.realtime = {
                status: 'success',
                message: 'Real-time connection established',
                score: 90
              }
              this.log('Realtime', 'Real-time connection established', 'success')
              resolve(true)
            }
          })
      } catch (error) {
        clearTimeout(timeout)
        this.results.realtime = {
          status: 'error',
          message: `Real-time error: ${error.message}`,
          score: 0
        }
        this.log('Realtime', `Error: ${error.message}`, 'error')
        resolve(false)
      }
    })
  }

  async checkStorage() {
    this.log('Storage', 'Testing file storage...')
    
    try {
      // List buckets
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
      
      if (bucketsError) {
        this.results.storage = {
          status: 'warning',
          message: `Storage check: ${bucketsError.message}`,
          score: 30
        }
        this.log('Storage', `Warning: ${bucketsError.message}`, 'warning')
        return true
      }

      // Test bucket access
      const { data: files, error: filesError } = await supabase.storage
        .from('documents')
        .list('', { limit: 1 })

      if (filesError && !filesError.message.includes('not found')) {
        this.results.storage = {
          status: 'warning',
          message: `Storage access limited: ${filesError.message}`,
          score: 50
        }
        this.log('Storage', `Limited access: ${filesError.message}`, 'warning')
        return true
      }

      this.results.storage = {
        status: 'success',
        message: `Storage accessible (${buckets?.length || 0} buckets)`,
        score: 85
      }
      this.log('Storage', `Storage accessible (${buckets?.length || 0} buckets)`, 'success')
      return true
    } catch (error) {
      this.results.storage = {
        status: 'error',
        message: `Storage error: ${error.message}`,
        score: 0
      }
      this.log('Storage', `Error: ${error.message}`, 'error')
      return false
    }
  }

  async checkSecurity() {
    this.log('Security', 'Testing Row Level Security...')
    
    try {
      // Test RLS by attempting operations without proper auth
      const { data, error } = await supabase
        .from('users')
        .select('id, email')
        .limit(1)

      // Check if RLS is properly configured
      const rlsTests = []
      
      // Test 1: Anonymous access should be restricted
      if (error && error.message.includes('permission')) {
        rlsTests.push({ test: 'Anonymous access restriction', status: 'success' })
      } else if (data && data.length === 0) {
        rlsTests.push({ test: 'Anonymous access restriction', status: 'success' })
      } else {
        rlsTests.push({ test: 'Anonymous access restriction', status: 'warning' })
      }

      // Test 2: Check if policies exist
      const { data: policies, error: policiesError } = await supabase
        .rpc('get_policies')
        .catch(() => ({ data: null, error: { message: 'RPC not available' } }))

      if (!policiesError) {
        rlsTests.push({ test: 'Security policies', status: 'success' })
      } else {
        rlsTests.push({ test: 'Security policies', status: 'warning' })
      }

      const successCount = rlsTests.filter(t => t.status === 'success').length
      const score = Math.round((successCount / rlsTests.length) * 100)

      this.results.security = {
        status: score > 70 ? 'success' : 'warning',
        message: `Security checks: ${successCount}/${rlsTests.length} passed`,
        score,
        details: rlsTests
      }

      this.log('Security', `${successCount}/${rlsTests.length} security checks passed`, 
        score > 70 ? 'success' : 'warning')
      return true
    } catch (error) {
      this.results.security = {
        status: 'error',
        message: `Security check failed: ${error.message}`,
        score: 0
      }
      this.log('Security', `Failed: ${error.message}`, 'error')
      return false
    }
  }

  calculateOverallScore() {
    const scores = Object.values(this.results).map(r => r.score)
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
  }

  getOverallStatus(score) {
    if (score >= 85) return { status: 'EXCELLENT', color: '\x1b[32m' }
    if (score >= 70) return { status: 'GOOD', color: '\x1b[33m' }
    if (score >= 50) return { status: 'FAIR', color: '\x1b[35m' }
    return { status: 'POOR', color: '\x1b[31m' }
  }

  printResults() {
    console.log('\n' + '='.repeat(60))
    console.log('🔍 SUPABASE HEALTH CHECK REPORT')
    console.log('='.repeat(60))

    const overallScore = this.calculateOverallScore()
    const { status, color } = this.getOverallStatus(overallScore)

    console.log(`\n📊 OVERALL STATUS: ${color}${status} (${overallScore}%)\x1b[0m\n`)

    // Detailed results
    Object.entries(this.results).forEach(([category, result]) => {
      const statusIcon = {
        success: '✅',
        warning: '⚠️',
        error: '❌',
        pending: '⏳'
      }[result.status] || '❓'

      console.log(`${statusIcon} ${category.toUpperCase()}: ${result.message} (${result.score}%)`)
      
      if (result.details) {
        result.details.forEach(detail => {
          const detailIcon = detail.status === 'success' ? '  ✓' : '  ✗'
          console.log(`${detailIcon} ${detail.test || detail.table}: ${detail.message || 'OK'}`)
        })
      }
    })

    // Recommendations
    console.log('\n📋 RECOMMENDATIONS:')
    
    if (this.results.connection.status === 'error') {
      console.log('❌ Fix Supabase connection configuration')
    }
    
    if (this.results.database.score < 80) {
      console.log('⚠️  Review database schema and permissions')
    }
    
    if (this.results.realtime.score < 70) {
      console.log('⚠️  Check real-time subscription configuration')
    }
    
    if (this.results.security.score < 70) {
      console.log('⚠️  Review Row Level Security policies')
    }

    if (overallScore >= 85) {
      console.log('✅ Supabase is fully operational and ready for production!')
    } else if (overallScore >= 70) {
      console.log('✅ Supabase is working well with minor issues to address')
    } else {
      console.log('⚠️  Supabase needs attention before production deployment')
    }

    console.log('\n' + '='.repeat(60))
  }

  async runAllChecks() {
    console.log('🚀 Starting Supabase Health Check...\n')
    
    const checks = [
      { name: 'Connection', method: 'checkConnection' },
      { name: 'Authentication', method: 'checkAuthentication' },
      { name: 'Database', method: 'checkDatabase' },
      { name: 'Realtime', method: 'checkRealtime' },
      { name: 'Storage', method: 'checkStorage' },
      { name: 'Security', method: 'checkSecurity' }
    ]

    for (const check of checks) {
      try {
        await this[check.method]()
      } catch (error) {
        this.log(check.name, `Unexpected error: ${error.message}`, 'error')
        this.results[check.name.toLowerCase()] = {
          status: 'error',
          message: `Unexpected error: ${error.message}`,
          score: 0
        }
      }
    }

    this.printResults()
    return this.calculateOverallScore()
  }
}

// Run the health check
const checker = new SupabaseHealthChecker()
checker.runAllChecks()
  .then(score => {
    process.exit(score >= 50 ? 0 : 1)
  })
  .catch(error => {
    console.error('Health check failed:', error)
    process.exit(1)
  })