-- Creo ERP Production Database Schema
-- This script creates all necessary tables, indexes, and policies for the production system

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    phone VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE
);

-- Properties table
CREATE TABLE public.properties (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    zip_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) NOT NULL DEFAULT 'USA',
    price DECIMAL(15,2) NOT NULL,
    property_type VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'available',
    bedrooms INTEGER,
    bathrooms DECIMAL(3,1),
    square_feet INTEGER,
    lot_size DECIMAL(10,2),
    year_built INTEGER,
    agent_id UUID REFERENCES public.users(id) NOT NULL,
    owner_id UUID REFERENCES public.users(id),
    images TEXT[],
    features TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contacts table
CREATE TABLE public.contacts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    contact_type VARCHAR(50) NOT NULL,
    company VARCHAR(255),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    zip_code VARCHAR(20),
    country VARCHAR(100) DEFAULT 'USA',
    notes TEXT,
    tags TEXT[],
    assigned_agent_id UUID REFERENCES public.users(id) NOT NULL,
    lead_source VARCHAR(100),
    lead_status VARCHAR(50) DEFAULT 'new',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Deals table
CREATE TABLE public.deals (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    property_id UUID REFERENCES public.properties(id) NOT NULL,
    client_id UUID REFERENCES public.contacts(id) NOT NULL,
    agent_id UUID REFERENCES public.users(id) NOT NULL,
    deal_value DECIMAL(15,2) NOT NULL,
    commission_rate DECIMAL(5,2) NOT NULL DEFAULT 6.00,
    commission_amount DECIMAL(15,2) NOT NULL,
    deal_stage VARCHAR(50) NOT NULL DEFAULT 'prospecting',
    deal_status VARCHAR(50) NOT NULL DEFAULT 'active',
    probability INTEGER DEFAULT 50 CHECK (probability >= 0 AND probability <= 100),
    expected_close_date DATE,
    actual_close_date DATE,
    notes TEXT,
    documents TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Documents table
CREATE TABLE public.documents (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    uploaded_by UUID REFERENCES public.users(id) NOT NULL,
    is_public BOOLEAN DEFAULT FALSE,
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activities table (audit trail)
CREATE TABLE public.activities (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) NOT NULL,
    action VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE public.notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'info',
    is_read BOOLEAN DEFAULT FALSE,
    entity_type VARCHAR(50),
    entity_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Settings table
CREATE TABLE public.settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id),
    key VARCHAR(100) NOT NULL,
    value JSONB NOT NULL,
    is_global BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, key)
);

-- Create indexes for better performance
CREATE INDEX idx_properties_agent_id ON public.properties(agent_id);
CREATE INDEX idx_properties_status ON public.properties(status);
CREATE INDEX idx_properties_price ON public.properties(price);
CREATE INDEX idx_properties_location ON public.properties(city, state);
CREATE INDEX idx_properties_created_at ON public.properties(created_at);

CREATE INDEX idx_contacts_agent_id ON public.contacts(assigned_agent_id);
CREATE INDEX idx_contacts_type ON public.contacts(contact_type);
CREATE INDEX idx_contacts_status ON public.contacts(lead_status);
CREATE INDEX idx_contacts_email ON public.contacts(email);
CREATE INDEX idx_contacts_created_at ON public.contacts(created_at);

CREATE INDEX idx_deals_agent_id ON public.deals(agent_id);
CREATE INDEX idx_deals_property_id ON public.deals(property_id);
CREATE INDEX idx_deals_client_id ON public.deals(client_id);
CREATE INDEX idx_deals_status ON public.deals(deal_status);
CREATE INDEX idx_deals_stage ON public.deals(deal_stage);
CREATE INDEX idx_deals_value ON public.deals(deal_value);
CREATE INDEX idx_deals_created_at ON public.deals(created_at);

CREATE INDEX idx_documents_entity ON public.documents(entity_type, entity_id);
CREATE INDEX idx_documents_uploaded_by ON public.documents(uploaded_by);
CREATE INDEX idx_documents_created_at ON public.documents(created_at);

CREATE INDEX idx_activities_user_id ON public.activities(user_id);
CREATE INDEX idx_activities_entity ON public.activities(entity_type, entity_id);
CREATE INDEX idx_activities_created_at ON public.activities(created_at);

CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_unread ON public.notifications(user_id, is_read);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON public.properties FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON public.contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_deals_updated_at BEFORE UPDATE ON public.deals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON public.documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON public.settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON public.users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role IN ('Administrator', 'CEO', 'Sales Manager', 'Marketing Manager')
        )
    );

-- Properties policies
CREATE POLICY "Users can view properties based on role" ON public.properties
    FOR SELECT USING (
        -- Admins and managers can see all
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role IN ('Administrator', 'CEO', 'Sales Manager', 'Marketing Manager')
        )
        OR
        -- Agents can see their own properties
        agent_id = auth.uid()
    );

CREATE POLICY "Users can create properties" ON public.properties
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role IN ('Administrator', 'CEO', 'Sales Manager', 'Real Estate Agent')
        )
    );

CREATE POLICY "Users can update their properties" ON public.properties
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND (
                role IN ('Administrator', 'CEO', 'Sales Manager') 
                OR id = agent_id
            )
        )
    );

-- Contacts policies
CREATE POLICY "Users can view contacts based on role" ON public.contacts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND (
                role IN ('Administrator', 'CEO', 'Sales Manager', 'Marketing Manager')
                OR id = assigned_agent_id
            )
        )
    );

CREATE POLICY "Users can create contacts" ON public.contacts
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role IN ('Administrator', 'CEO', 'Sales Manager', 'Real Estate Agent', 'Marketing Manager')
        )
    );

-- Deals policies
CREATE POLICY "Users can view deals based on role" ON public.deals
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND (
                role IN ('Administrator', 'CEO', 'Sales Manager')
                OR id = agent_id
            )
        )
    );

CREATE POLICY "Users can create deals" ON public.deals
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role IN ('Administrator', 'CEO', 'Sales Manager', 'Real Estate Agent')
        )
    );

-- Documents policies
CREATE POLICY "Users can view documents they uploaded or have access to" ON public.documents
    FOR SELECT USING (
        uploaded_by = auth.uid()
        OR
        is_public = true
        OR
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role IN ('Administrator', 'CEO', 'Sales Manager')
        )
    );

CREATE POLICY "Users can upload documents" ON public.documents
    FOR INSERT WITH CHECK (
        uploaded_by = auth.uid()
    );

-- Activities policies
CREATE POLICY "Users can view their own activities" ON public.activities
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can view all activities" ON public.activities
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role IN ('Administrator', 'CEO')
        )
    );

CREATE POLICY "Users can create activities" ON public.activities
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON public.notifications
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications" ON public.notifications
    FOR UPDATE USING (user_id = auth.uid());

-- Settings policies
CREATE POLICY "Users can view their own settings" ON public.settings
    FOR SELECT USING (user_id = auth.uid() OR is_global = true);

CREATE POLICY "Users can manage their own settings" ON public.settings
    FOR ALL USING (user_id = auth.uid());

-- Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', false);

-- Storage policies for documents bucket
CREATE POLICY "Users can upload documents" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'documents' 
        AND auth.role() = 'authenticated'
    );

CREATE POLICY "Users can view documents they have access to" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'documents' 
        AND (
            auth.uid()::text = (storage.foldername(name))[1]
            OR
            EXISTS (
                SELECT 1 FROM public.users 
                WHERE id = auth.uid() 
                AND role IN ('Administrator', 'CEO', 'Sales Manager')
            )
        )
    );

-- Insert default roles and departments data
INSERT INTO public.settings (key, value, is_global) VALUES 
('roles', '[
    "Administrator",
    "CEO",
    "Sales Manager",
    "Marketing Manager",
    "Operations Manager",
    "Finance Manager",
    "Real Estate Agent",
    "Property Manager",
    "Marketing Specialist",
    "Admin Assistant"
]', true),
('departments', '[
    "Executive",
    "Sales",
    "Marketing",
    "Operations",
    "Finance",
    "Administration"
]', true),
('property_types', '[
    "Residential",
    "Commercial",
    "Industrial",
    "Land",
    "Multi-Family",
    "Retail",
    "Office",
    "Warehouse"
]', true),
('property_statuses', '[
    "Available",
    "Under Contract",
    "Sold",
    "Pending",
    "Off Market",
    "Coming Soon"
]', true),
('deal_stages', '[
    "Prospecting",
    "Qualification",
    "Proposal",
    "Negotiation",
    "Closing",
    "Closed Won",
    "Closed Lost"
]', true);

-- Create functions for common operations

-- Function to get user dashboard stats
CREATE OR REPLACE FUNCTION get_dashboard_stats(user_uuid UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
    user_role TEXT;
BEGIN
    -- Get user role
    SELECT role INTO user_role FROM public.users WHERE id = user_uuid;
    
    -- Calculate stats based on user role
    IF user_role IN ('Administrator', 'CEO', 'Sales Manager') THEN
        -- Admin/Manager stats - all data
        SELECT json_build_object(
            'total_properties', (SELECT COUNT(*) FROM public.properties),
            'total_contacts', (SELECT COUNT(*) FROM public.contacts),
            'total_deals', (SELECT COUNT(*) FROM public.deals),
            'total_deal_value', (SELECT COALESCE(SUM(deal_value), 0) FROM public.deals WHERE deal_status = 'active'),
            'properties_by_status', (
                SELECT json_object_agg(status, count) 
                FROM (
                    SELECT status, COUNT(*) as count 
                    FROM public.properties 
                    GROUP BY status
                ) t
            )
        ) INTO result;
    ELSE
        -- Agent stats - own data only
        SELECT json_build_object(
            'total_properties', (SELECT COUNT(*) FROM public.properties WHERE agent_id = user_uuid),
            'total_contacts', (SELECT COUNT(*) FROM public.contacts WHERE assigned_agent_id = user_uuid),
            'total_deals', (SELECT COUNT(*) FROM public.deals WHERE agent_id = user_uuid),
            'total_deal_value', (SELECT COALESCE(SUM(deal_value), 0) FROM public.deals WHERE agent_id = user_uuid AND deal_status = 'active'),
            'properties_by_status', (
                SELECT json_object_agg(status, count) 
                FROM (
                    SELECT status, COUNT(*) as count 
                    FROM public.properties 
                    WHERE agent_id = user_uuid
                    GROUP BY status
                ) t
            )
        ) INTO result;
    END IF;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create user profile after signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, name, role, department)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', 'New User'),
        COALESCE(NEW.raw_user_meta_data->>'role', 'Real Estate Agent'),
        COALESCE(NEW.raw_user_meta_data->>'department', 'Sales')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Comments for documentation
COMMENT ON TABLE public.users IS 'User profiles extending Supabase auth';
COMMENT ON TABLE public.properties IS 'Real estate property listings';
COMMENT ON TABLE public.contacts IS 'Client and prospect contact information';
COMMENT ON TABLE public.deals IS 'Sales deals and transactions';
COMMENT ON TABLE public.documents IS 'File uploads and document management';
COMMENT ON TABLE public.activities IS 'Audit trail of user actions';
COMMENT ON TABLE public.notifications IS 'System notifications for users';
COMMENT ON TABLE public.settings IS 'Application settings and configuration'; 