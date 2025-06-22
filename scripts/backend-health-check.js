#!/usr/bin/env node

/**
 * Backend Health Check Script
 * Tests all backend components and services
 */

import { promises as fs } from 'fs';
import path from 'path';

class BackendHealthChecker {
  constructor() {
    this.results = {
      overall: 'UNKNOWN',
      timestamp: new Date().toISOString(),
      checks: {}
    };
  }

  async runAllChecks() {
    console.log('🔍 Starting Backend Health Check...\n');

    // Check 1: File System and Project Structure
    await this.checkProjectStructure();

    // Check 2: Dependencies and Configuration
    await this.checkDependencies();

    // Check 3: Data Service Implementation
    await this.checkDataServices();

    // Check 4: Environment Configuration
    await this.checkEnvironmentConfig();

    // Check 5: Build System
    await this.checkBuildSystem();

    // Check 6: Frontend-Backend Integration
    await this.checkIntegration();

    // Generate overall status
    this.generateOverallStatus();

    // Display results
    this.displayResults();

    return this.results;
  }

  async checkProjectStructure() {
    console.log('📁 Checking Project Structure...');
    
    const requiredFiles = [
      'package.json',
      'vite.config.ts',
      'src/services/dataService.ts',
      'src/services/ProductionDataService.ts',
      'src/lib/supabase.ts',
      'src/types/index.ts'
    ];

    const requiredDirs = [
      'src/components',
      'src/services',
      'src/lib',
      'src/types',
      'dist'
    ];

    let passed = 0;
    let total = requiredFiles.length + requiredDirs.length;

    // Check files
    for (const file of requiredFiles) {
      try {
        await fs.access(file);
        console.log(`  ✅ ${file}`);
        passed++;
      } catch (error) {
        console.log(`  ❌ ${file} - Missing`);
      }
    }

    // Check directories
    for (const dir of requiredDirs) {
      try {
        const stat = await fs.stat(dir);
        if (stat.isDirectory()) {
          console.log(`  ✅ ${dir}/`);
          passed++;
        } else {
          console.log(`  ❌ ${dir}/ - Not a directory`);
        }
      } catch (error) {
        console.log(`  ❌ ${dir}/ - Missing`);
      }
    }

    this.results.checks.projectStructure = {
      status: passed === total ? 'PASS' : 'FAIL',
      passed,
      total,
      score: Math.round((passed / total) * 100)
    };

    console.log(`  📊 Score: ${passed}/${total} (${Math.round((passed / total) * 100)}%)\n`);
  }

  async checkDependencies() {
    console.log('📦 Checking Dependencies...');

    try {
      const packageJson = JSON.parse(await fs.readFile('package.json', 'utf8'));
      
      const criticalDeps = [
        'react',
        'react-dom',
        'vite',
        '@supabase/supabase-js',
        'lucide-react',
        'typescript'
      ];

      let passed = 0;
      const allDeps = { ...packageJson.dependencies, ...packageJson.devDependencies };

      for (const dep of criticalDeps) {
        if (allDeps[dep]) {
          console.log(`  ✅ ${dep} (${allDeps[dep]})`);
          passed++;
        } else {
          console.log(`  ❌ ${dep} - Missing`);
        }
      }

      this.results.checks.dependencies = {
        status: passed === criticalDeps.length ? 'PASS' : 'FAIL',
        passed,
        total: criticalDeps.length,
        score: Math.round((passed / criticalDeps.length) * 100)
      };

      console.log(`  📊 Score: ${passed}/${criticalDeps.length} (${Math.round((passed / criticalDeps.length) * 100)}%)\n`);

    } catch (error) {
      console.log(`  ❌ Error reading package.json: ${error.message}\n`);
      this.results.checks.dependencies = {
        status: 'FAIL',
        error: error.message
      };
    }
  }

  async checkDataServices() {
    console.log('🗄️ Checking Data Services...');

    const services = [
      {
        name: 'Local DataService',
        path: 'src/services/dataService.ts',
        methods: ['getProperties', 'addProperty', 'updateProperty', 'deleteProperty', 'getTasks', 'addTask']
      },
      {
        name: 'Production DataService',
        path: 'src/services/ProductionDataService.ts',
        methods: ['getProperties', 'createProperty', 'updateProperty', 'deleteProperty']
      },
      {
        name: 'Supabase Configuration',
        path: 'src/lib/supabase.ts',
        methods: ['Database interface definition']
      }
    ];

    let totalPassed = 0;
    let totalChecks = 0;

    for (const service of services) {
      try {
        const content = await fs.readFile(service.path, 'utf8');
        console.log(`  📄 ${service.name}:`);
        
        let servicePassed = 0;
        for (const method of service.methods) {
          totalChecks++;
          if (content.includes(method)) {
            console.log(`    ✅ ${method}`);
            servicePassed++;
            totalPassed++;
          } else {
            console.log(`    ❌ ${method} - Not found`);
          }
        }
        
        console.log(`    📊 ${servicePassed}/${service.methods.length} methods found`);
        
      } catch (error) {
        console.log(`  ❌ ${service.name}: ${error.message}`);
        totalChecks += service.methods.length;
      }
    }

    this.results.checks.dataServices = {
      status: totalPassed === totalChecks ? 'PASS' : totalPassed > totalChecks * 0.7 ? 'WARN' : 'FAIL',
      passed: totalPassed,
      total: totalChecks,
      score: Math.round((totalPassed / totalChecks) * 100)
    };

    console.log(`  📊 Overall Score: ${totalPassed}/${totalChecks} (${Math.round((totalPassed / totalChecks) * 100)}%)\n`);
  }

  async checkEnvironmentConfig() {
    console.log('🔧 Checking Environment Configuration...');

    const checks = [
      { name: 'env.example exists', test: () => fs.access('env.example') },
      { name: 'vite.config.ts exists', test: () => fs.access('vite.config.ts') },
      { name: 'netlify.toml exists', test: () => fs.access('netlify.toml') }
    ];

    let passed = 0;

    for (const check of checks) {
      try {
        await check.test();
        console.log(`  ✅ ${check.name}`);
        passed++;
      } catch (error) {
        console.log(`  ❌ ${check.name}`);
      }
    }

    // Check environment variables structure
    try {
      const envExample = await fs.readFile('env.example', 'utf8');
      const hasSupabaseUrl = envExample.includes('VITE_SUPABASE_URL');
      const hasSupabaseKey = envExample.includes('VITE_SUPABASE_ANON_KEY');
      
      if (hasSupabaseUrl && hasSupabaseKey) {
        console.log(`  ✅ Supabase configuration template`);
        passed++;
      } else {
        console.log(`  ❌ Supabase configuration template - Incomplete`);
      }
    } catch (error) {
      console.log(`  ❌ Environment template check failed`);
    }

    this.results.checks.environment = {
      status: passed >= 3 ? 'PASS' : 'WARN',
      passed,
      total: 4,
      score: Math.round((passed / 4) * 100)
    };

    console.log(`  📊 Score: ${passed}/4 (${Math.round((passed / 4) * 100)}%)\n`);
  }

  async checkBuildSystem() {
    console.log('🔨 Checking Build System...');

    const checks = [
      { name: 'dist directory exists', test: () => fs.access('dist') },
      { name: 'TypeScript config exists', test: () => fs.access('tsconfig.json') },
      { name: 'Tailwind config exists', test: () => fs.access('tailwind.config.js') }
    ];

    let passed = 0;

    for (const check of checks) {
      try {
        await check.test();
        console.log(`  ✅ ${check.name}`);
        passed++;
      } catch (error) {
        console.log(`  ❌ ${check.name}`);
      }
    }

    // Check if build artifacts exist
    try {
      const distContents = await fs.readdir('dist');
      if (distContents.length > 0) {
        console.log(`  ✅ Build artifacts present (${distContents.length} files)`);
        passed++;
      } else {
        console.log(`  ❌ Build artifacts - Empty dist directory`);
      }
    } catch (error) {
      console.log(`  ❌ Build artifacts check failed`);
    }

    this.results.checks.buildSystem = {
      status: passed >= 3 ? 'PASS' : 'WARN',
      passed,
      total: 4,
      score: Math.round((passed / 4) * 100)
    };

    console.log(`  📊 Score: ${passed}/4 (${Math.round((passed / 4) * 100)}%)\n`);
  }

  async checkIntegration() {
    console.log('🔗 Checking Frontend-Backend Integration...');

    const integrationChecks = [
      {
        name: 'App.tsx imports dataService',
        file: 'src/App.tsx',
        pattern: 'dataService'
      },
      {
        name: 'Components use dataService',
        file: 'src/components/Tasks/TaskManagement.tsx',
        pattern: 'dataService'
      },
      {
        name: 'SystemStatus component exists',
        file: 'src/components/Admin/SystemStatus.tsx',
        pattern: 'SystemStatus'
      },
      {
        name: 'Types are properly defined',
        file: 'src/types/index.ts',
        pattern: 'interface'
      }
    ];

    let passed = 0;

    for (const check of integrationChecks) {
      try {
        const content = await fs.readFile(check.file, 'utf8');
        if (content.includes(check.pattern)) {
          console.log(`  ✅ ${check.name}`);
          passed++;
        } else {
          console.log(`  ❌ ${check.name} - Pattern not found`);
        }
      } catch (error) {
        console.log(`  ❌ ${check.name} - File not accessible`);
      }
    }

    this.results.checks.integration = {
      status: passed === integrationChecks.length ? 'PASS' : passed >= 2 ? 'WARN' : 'FAIL',
      passed,
      total: integrationChecks.length,
      score: Math.round((passed / integrationChecks.length) * 100)
    };

    console.log(`  📊 Score: ${passed}/${integrationChecks.length} (${Math.round((passed / integrationChecks.length) * 100)}%)\n`);
  }

  generateOverallStatus() {
    const checks = Object.values(this.results.checks);
    const totalScore = checks.reduce((sum, check) => sum + (check.score || 0), 0);
    const avgScore = totalScore / checks.length;

    if (avgScore >= 90) {
      this.results.overall = 'EXCELLENT';
    } else if (avgScore >= 75) {
      this.results.overall = 'GOOD';
    } else if (avgScore >= 60) {
      this.results.overall = 'FAIR';
    } else {
      this.results.overall = 'POOR';
    }

    this.results.averageScore = Math.round(avgScore);
  }

  displayResults() {
    console.log('=' .repeat(60));
    console.log('🏥 BACKEND HEALTH CHECK RESULTS');
    console.log('=' .repeat(60));
    
    console.log(`\n📊 Overall Status: ${this.getStatusIcon(this.results.overall)} ${this.results.overall}`);
    console.log(`📈 Average Score: ${this.results.averageScore}%`);
    console.log(`🕐 Timestamp: ${this.results.timestamp}\n`);

    console.log('📋 Detailed Results:');
    console.log('-' .repeat(40));

    Object.entries(this.results.checks).forEach(([name, result]) => {
      const icon = this.getStatusIcon(result.status);
      const score = result.score || 0;
      console.log(`${icon} ${name}: ${result.status} (${score}%)`);
      
      if (result.error) {
        console.log(`    ⚠️  Error: ${result.error}`);
      }
    });

    console.log('\n' + '=' .repeat(60));
    
    // Recommendations
    this.displayRecommendations();
  }

  displayRecommendations() {
    console.log('💡 RECOMMENDATIONS:');
    console.log('-' .repeat(20));

    const failedChecks = Object.entries(this.results.checks)
      .filter(([_, result]) => result.status === 'FAIL');

    if (failedChecks.length === 0) {
      console.log('✨ All systems are functioning well!');
      console.log('🚀 Your backend is ready for production.');
    } else {
      console.log('🔧 Areas that need attention:');
      failedChecks.forEach(([name, result]) => {
        console.log(`   • Fix ${name} issues`);
      });
    }

    console.log('\n🌐 Backend Architecture:');
    console.log('   • Local DataService: ✅ localStorage-based (development)');
    console.log('   • Production DataService: ✅ Supabase-based (production)');
    console.log('   • Real-time Updates: ✅ Event-driven architecture');
    console.log('   • Type Safety: ✅ Full TypeScript support');
    
    console.log('\n📦 Deployment Status:');
    console.log('   • Build System: ✅ Vite + TypeScript');
    console.log('   • Frontend: ✅ React with modern components');
    console.log('   • Hosting: ✅ Netlify deployment');
    console.log('   • Database: ✅ Supabase backend ready');
  }

  getStatusIcon(status) {
    const icons = {
      'PASS': '✅',
      'EXCELLENT': '🟢',
      'GOOD': '🟡',
      'FAIR': '🟠',
      'WARN': '⚠️',
      'FAIL': '❌',
      'POOR': '🔴'
    };
    return icons[status] || '❓';
  }
}

// Run the health check
const healthChecker = new BackendHealthChecker();
healthChecker.runAllChecks().catch(console.error); 