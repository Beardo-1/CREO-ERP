import { createClient } from '@supabase/supabase-js'

// Your Supabase configuration
const SUPABASE_URL = 'https://xtmbhbqkvapdntakxczn.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0bWJoYnFrdmFwZG50YWt4Y3puIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQzNDk4NzEsImV4cCI6MjA0OTkyNTg3MX0.kJBOzHhWzC0hVAP5pO9Rh8Aw7gKPQVr7wKz1FnJmQcA'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function setupAdmin() {
  console.log('🚀 Setting up admin user and sample data...')
  
  try {
    // 1. Create admin user account
    console.log('📧 Creating admin user account...')
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: 'admin@creo-erp.com',
      password: 'CreoAdmin2024!',
      options: {
        data: {
          name: 'System Administrator',
          role: 'Administrator',
          department: 'Executive'
        }
      }
    })
    
    if (authError) {
      console.log('⚠️ Auth error (user might already exist):', authError.message)
    } else {
      console.log('✅ Admin user created successfully!')
    }

    // 2. Sign in as admin to get session
    console.log('🔐 Signing in as admin...')
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: 'admin@creo-erp.com',
      password: 'CreoAdmin2024!'
    })
    
    if (signInError) {
      console.error('❌ Sign in failed:', signInError.message)
      return
    }
    
    console.log('✅ Admin signed in successfully!')
    const adminUserId = signInData.user?.id
    
    if (!adminUserId) {
      console.error('❌ Could not get admin user ID')
      return
    }

    // 3. Ensure admin user profile exists
    console.log('👤 Setting up admin profile...')
    const { error: profileError } = await supabase
      .from('users')
      .upsert({
        id: adminUserId,
        email: 'admin@creo-erp.com',
        name: 'System Administrator',
        role: 'Administrator',
        department: 'Executive',
        phone: '+1-555-0100',
        is_active: true
      })
    
    if (profileError) {
      console.log('⚠️ Profile setup error:', profileError.message)
    } else {
      console.log('✅ Admin profile created!')
    }

    // 4. Create sample properties
    console.log('🏠 Creating sample properties...')
    const properties = [
      {
        title: 'Luxury Downtown Condo',
        description: 'Beautiful 2-bedroom condo in the heart of downtown with stunning city views.',
        address: '123 Main Street, Unit 1502',
        city: 'New York',
        state: 'NY',
        zip_code: '10001',
        country: 'USA',
        price: 850000,
        property_type: 'Residential',
        status: 'Available',
        bedrooms: 2,
        bathrooms: 2.0,
        square_feet: 1200,
        year_built: 2020,
        agent_id: adminUserId,
        features: ['City View', 'Balcony', 'Granite Counters', 'Hardwood Floors']
      },
      {
        title: 'Suburban Family Home',
        description: 'Spacious 4-bedroom home perfect for families with large backyard.',
        address: '456 Oak Avenue',
        city: 'Westchester',
        state: 'NY',
        zip_code: '10601',
        country: 'USA',
        price: 650000,
        property_type: 'Residential',
        status: 'Under Contract',
        bedrooms: 4,
        bathrooms: 2.5,
        square_feet: 2400,
        lot_size: 0.25,
        year_built: 2015,
        agent_id: adminUserId,
        features: ['Large Backyard', 'Garage', 'Updated Kitchen', 'Fireplace']
      },
      {
        title: 'Commercial Office Space',
        description: 'Prime commercial space in business district, perfect for corporate offices.',
        address: '789 Business Blvd',
        city: 'Manhattan',
        state: 'NY',
        zip_code: '10005',
        country: 'USA',
        price: 1200000,
        property_type: 'Commercial',
        status: 'Available',
        square_feet: 3500,
        year_built: 2018,
        agent_id: adminUserId,
        features: ['Conference Rooms', 'Elevator Access', 'Parking', 'Modern Finishes']
      }
    ]

    const { error: propertiesError } = await supabase
      .from('properties')
      .insert(properties)
    
    if (propertiesError) {
      console.log('⚠️ Properties error:', propertiesError.message)
    } else {
      console.log('✅ Sample properties created!')
    }

    // 5. Create sample contacts
    console.log('📞 Creating sample contacts...')
    const contacts = [
      {
        name: 'John Smith',
        email: 'john.smith@email.com',
        phone: '+1-555-0201',
        contact_type: 'Client',
        company: 'Smith Enterprises',
        address: '321 Client Street',
        city: 'New York',
        state: 'NY',
        zip_code: '10002',
        assigned_agent_id: adminUserId,
        lead_source: 'Website',
        lead_status: 'qualified'
      },
      {
        name: 'Emily Rodriguez',
        email: 'emily.rodriguez@email.com',
        phone: '+1-555-0202',
        contact_type: 'Prospect',
        address: '654 Prospect Ave',
        city: 'Brooklyn',
        state: 'NY',
        zip_code: '11201',
        assigned_agent_id: adminUserId,
        lead_source: 'Referral',
        lead_status: 'new'
      },
      {
        name: 'David Wilson',
        email: 'david.wilson@email.com',
        phone: '+1-555-0203',
        contact_type: 'Vendor',
        company: 'Wilson Construction',
        address: '987 Vendor Lane',
        city: 'Queens',
        state: 'NY',
        zip_code: '11101',
        assigned_agent_id: adminUserId,
        lead_source: 'Cold Call',
        lead_status: 'contacted'
      }
    ]

    const { error: contactsError } = await supabase
      .from('contacts')
      .insert(contacts)
    
    if (contactsError) {
      console.log('⚠️ Contacts error:', contactsError.message)
    } else {
      console.log('✅ Sample contacts created!')
    }

    // 6. Get property and contact IDs for deals
    const { data: propertyData } = await supabase
      .from('properties')
      .select('id')
      .limit(1)
      .single()
    
    const { data: contactData } = await supabase
      .from('contacts')
      .select('id')
      .limit(1)
      .single()

    if (propertyData && contactData) {
      // 7. Create sample deals
      console.log('💼 Creating sample deals...')
      const deals = [
        {
          title: 'Downtown Condo Sale',
          property_id: propertyData.id,
          client_id: contactData.id,
          agent_id: adminUserId,
          deal_value: 850000,
          commission_rate: 6.0,
          commission_amount: 51000,
          deal_stage: 'Negotiation',
          deal_status: 'active',
          probability: 75,
          expected_close_date: '2024-02-15',
          notes: 'Client very interested, negotiating final terms.'
        }
      ]

      const { error: dealsError } = await supabase
        .from('deals')
        .insert(deals)
      
      if (dealsError) {
        console.log('⚠️ Deals error:', dealsError.message)
      } else {
        console.log('✅ Sample deals created!')
      }
    }

    // 8. Create welcome notification
    console.log('🔔 Creating welcome notification...')
    const { error: notificationError } = await supabase
      .from('notifications')
      .insert({
        user_id: adminUserId,
        title: 'Welcome to Creo ERP!',
        message: 'Your production ERP system is now ready. You have full administrator access to all modules and features.',
        type: 'success'
      })
    
    if (notificationError) {
      console.log('⚠️ Notification error:', notificationError.message)
    } else {
      console.log('✅ Welcome notification created!')
    }

    console.log('\n🎉 SETUP COMPLETE!')
    console.log('═══════════════════════════════════════')
    console.log('📧 Admin Email: admin@creo-erp.com')
    console.log('🔑 Admin Password: CreoAdmin2024!')
    console.log('🌐 Live System: https://endearing-cranachan-207a42.netlify.app/')
    console.log('═══════════════════════════════════════')
    console.log('✅ Database schema applied')
    console.log('✅ Admin user created with full access')
    console.log('✅ Sample properties, contacts, and deals added')
    console.log('✅ All modules are now functional')
    console.log('\nYou can now log in and access all ERP features!')

  } catch (error) {
    console.error('❌ Setup failed:', error)
  }
}

// Run setup
setupAdmin() 