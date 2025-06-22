# Supabase Database Setup Guide

## 🚀 Quick Setup (5 minutes)

### Step 1: Access Supabase SQL Editor
1. Go to your Supabase project: https://supabase.com/dashboard/project/xtmbhbqkvapdntakxczn
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"

### Step 2: Run Database Schema
1. Copy the entire contents of `database/schema.sql`
2. Paste it into the SQL editor
3. Click "Run" to execute the schema

### Step 3: Set Up Storage (for file uploads)
1. Go to "Storage" in the left sidebar
2. Click "Create a new bucket"
3. Name it `documents`
4. Set it to Public
5. Click "Create bucket"

### Step 4: Create Your Admin User
After the schema is set up, create your first admin user by running this SQL:

```sql
-- Insert your admin user (replace with your details)
INSERT INTO public.users (id, email, name, role, department)
SELECT 
    auth.users.id,
    'your-email@example.com',
    'Your Name',
    'admin',
    'Management'
FROM auth.users 
WHERE auth.users.email = 'your-email@example.com';
```

### Step 5: Add Sample Data (Optional)
To test the system, you can add some sample data:

```sql
-- Sample property
INSERT INTO public.properties (title, description, address, city, state, zip_code, price, property_type, status, bedrooms, bathrooms, square_feet, agent_id)
SELECT 
    'Beautiful Downtown Condo',
    'Modern 2-bedroom condo in the heart of downtown with stunning city views.',
    '123 Main Street, Unit 456',
    'New York',
    'NY',
    '10001',
    750000.00,
    'condo',
    'available',
    2,
    2.0,
    1200,
    u.id
FROM public.users u WHERE u.role = 'admin' LIMIT 1;

-- Sample contact
INSERT INTO public.contacts (name, email, phone, contact_type, company, lead_source, lead_status, assigned_agent_id)
SELECT 
    'John Smith',
    'john.smith@example.com',
    '555-123-4567',
    'buyer',
    'Smith Enterprises',
    'website',
    'qualified',
    u.id
FROM public.users u WHERE u.role = 'admin' LIMIT 1;
```

## ✅ Verification

After setup, verify everything works:

1. **Check Tables**: Go to "Table Editor" and confirm all tables are created
2. **Test Login**: Try logging into your app at https://endearing-cranachan-207a42.netlify.app/
3. **Check Data**: After login, you should see your sample data in the dashboard

## 🔧 Environment Variables

Make sure your `.env` file has:
```
VITE_SUPABASE_URL=https://xtmbhbqkvapdntakxczn.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## 🆘 Troubleshooting

**If login doesn't work:**
1. Check that your user exists in both `auth.users` and `public.users`
2. Verify RLS policies are working
3. Check browser console for errors

**If data doesn't show:**
1. Make sure you have sample data inserted
2. Check that the user has proper permissions
3. Verify the API calls in browser dev tools

## 🎉 You're Live!

Once setup is complete, you have a fully functional ERP system with:
- ✅ User authentication and roles
- ✅ Property management
- ✅ Contact/CRM system
- ✅ Deal pipeline
- ✅ Document management
- ✅ Activity tracking
- ✅ Real-time updates
- ✅ Mobile responsive design

Your production system is now ready for real business use! 