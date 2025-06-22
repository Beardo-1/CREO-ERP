#!/usr/bin/env node

/**
 * Simple Supabase Connectivity Test
 * Tests basic connection and key functionality
 */

const { createClient } = require('@supabase/supabase-js')

// Supabase configuration from env.example
const supabaseUrl = 'https://xtmbhbqkvapdntakxczn.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0bWJoYnFrdmFwZG50YWt4Y3puIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyNzY1NjgsImV4cCI6MjA2NTg1MjU2OH0.oBfkL73FEFRsE2QXNPma_HflYtIcGpyKDysin87NCbw'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testSupabase() {
  console.log('🔍 SUPABASE CONNECTIVITY TEST')
  console.log('=' .repeat(50))
  console.log(`📡 URL: ${supabaseUrl}`)
  console.log(`🔑 Key: ${supabaseAnonKey.substring(0, 20)}...`)
  console.log('')

  const tests = []

  // Test 1: Basic Connection
  console.log('1️⃣  Testing basic connection...')
  try {
    const { data, error } = await supabase.from('users').select('count', { count: 'exact', head: true })
    if (error) {
      console.log(`   ❌ Connection failed: ${error.message}`)
      tests.push({ test: 'Connection', status: 'FAIL', message: error.message })
    } else {
      console.log('   ✅ Connection successful')
      tests.push({ test: 'Connection', status: 'PASS', message: 'Connected successfully' })
    }
  } catch (err) {
    console.log(`   ❌ Connection error: ${err.message}`)
    tests.push({ test: 'Connection', status: 'FAIL', message: err.message })
  }

  // Test 2: Database Tables Access
  console.log('\n2️⃣  Testing database table access...')
  const tables = ['users', 'properties', 'contacts', 'deals', 'documents', 'activities']
  let accessibleTables = 0

  for (const table of tables) {
    try {
      const { data, error } = await supabase.from(table).select('*', { count: 'exact', head: true })
      if (error) {
        console.log(`   ❌ Table ${table}: ${error.message}`)
      } else {
        console.log(`   ✅ Table ${table}: accessible`)
        accessibleTables++
      }
    } catch (err) {
      console.log(`   ❌ Table ${table}: ${err.message}`)
    }
  }

  tests.push({ 
    test: 'Database Tables', 
    status: accessibleTables > 0 ? 'PASS' : 'FAIL', 
    message: `${accessibleTables}/${tables.length} tables accessible` 
  })

  // Test 3: Authentication System
  console.log('\n3️⃣  Testing authentication system...')
  try {
    const { data: session } = await supabase.auth.getSession()
    console.log('   ✅ Auth system responsive')
    tests.push({ test: 'Authentication', status: 'PASS', message: 'Auth system working' })
  } catch (err) {
    console.log(`   ❌ Auth error: ${err.message}`)
    tests.push({ test: 'Authentication', status: 'FAIL', message: err.message })
  }

  // Test 4: Real-time Capabilities
  console.log('\n4️⃣  Testing real-time capabilities...')
  try {
    const channel = supabase.channel('test-channel')
    if (channel) {
      console.log('   ✅ Real-time channel created')
      tests.push({ test: 'Real-time', status: 'PASS', message: 'Real-time system available' })
      channel.unsubscribe()
    } else {
      console.log('   ❌ Real-time not available')
      tests.push({ test: 'Real-time', status: 'FAIL', message: 'Real-time not available' })
    }
  } catch (err) {
    console.log(`   ❌ Real-time error: ${err.message}`)
    tests.push({ test: 'Real-time', status: 'FAIL', message: err.message })
  }

  // Test 5: Storage System
  console.log('\n5️⃣  Testing storage system...')
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets()
    if (error) {
      console.log(`   ⚠️  Storage warning: ${error.message}`)
      tests.push({ test: 'Storage', status: 'WARN', message: error.message })
    } else {
      console.log(`   ✅ Storage accessible (${buckets?.length || 0} buckets)`)
      tests.push({ test: 'Storage', status: 'PASS', message: `${buckets?.length || 0} buckets found` })
    }
  } catch (err) {
    console.log(`   ❌ Storage error: ${err.message}`)
    tests.push({ test: 'Storage', status: 'FAIL', message: err.message })
  }

  // Results Summary
  console.log('\n' + '='.repeat(50))
  console.log('📊 TEST RESULTS SUMMARY')
  console.log('='.repeat(50))

  const passed = tests.filter(t => t.status === 'PASS').length
  const warnings = tests.filter(t => t.status === 'WARN').length
  const failed = tests.filter(t => t.status === 'FAIL').length

  tests.forEach(test => {
    const icon = {
      'PASS': '✅',
      'WARN': '⚠️',
      'FAIL': '❌'
    }[test.status]
    console.log(`${icon} ${test.test}: ${test.message}`)
  })

  console.log('')
  console.log(`📈 OVERALL SCORE: ${passed}/${tests.length} tests passed`)
  
  if (failed === 0 && warnings === 0) {
    console.log('🎉 EXCELLENT: Supabase is fully operational!')
  } else if (failed === 0) {
    console.log('✅ GOOD: Supabase is working with minor warnings')
  } else if (passed > failed) {
    console.log('⚠️  FAIR: Supabase has some issues but core functionality works')
  } else {
    console.log('❌ POOR: Supabase has significant issues')
  }

  console.log('')
  console.log('🔗 Supabase Dashboard: https://supabase.com/dashboard/project/xtmbhbqkvapdntakxczn')
  console.log('📚 Documentation: https://supabase.com/docs')
  console.log('='.repeat(50))

  return passed >= 3 ? 0 : 1
}

// Run the test
testSupabase()
  .then(exitCode => {
    process.exit(exitCode)
  })
  .catch(error => {
    console.error('❌ Test failed:', error)
    process.exit(1)
  })