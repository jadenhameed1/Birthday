-- Service Categories for Marketplace
CREATE TABLE service_categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  icon VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Marketplace Services
CREATE TABLE marketplace_services (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category_id UUID REFERENCES service_categories(id) ON DELETE SET NULL,
  provider_organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  price_type VARCHAR(50) DEFAULT 'fixed', -- fixed, hourly, monthly, custom
  price_amount DECIMAL(10,2),
  is_active BOOLEAN DEFAULT true,
  features JSONB DEFAULT '[]',
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Service Orders
CREATE TABLE service_orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  service_id UUID REFERENCES marketplace_services(id) ON DELETE CASCADE,
  customer_organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  provider_organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'pending', -- pending, confirmed, in_progress, completed, cancelled
  requirements TEXT,
  agreed_price DECIMAL(10,2),
  timeline_days INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- API Integrations
CREATE TABLE api_integrations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  base_url TEXT NOT NULL,
  api_key_encrypted TEXT,
  is_active BOOLEAN DEFAULT true,
  rate_limit_per_minute INTEGER DEFAULT 60,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- AI Recommendations Engine
CREATE TABLE ai_recommendations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  recommendation_type VARCHAR(100) NOT NULL, -- service, integration, workflow, insight
  title VARCHAR(255) NOT NULL,
  description TEXT,
  confidence_score DECIMAL(3,2),
  metadata JSONB DEFAULT '{}',
  is_actioned BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Workflow Automations
CREATE TABLE workflow_automations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  trigger_type VARCHAR(100) NOT NULL,
  trigger_config JSONB DEFAULT '{}',
  actions JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Analytics Events
CREATE TABLE analytics_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  event_type VARCHAR(100) NOT NULL,
  event_data JSONB DEFAULT '{}',
  user_agent TEXT,
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Insert initial service categories
INSERT INTO service_categories (name, slug, description, icon) VALUES
('Development', 'development', 'Software development and engineering services', 'Code'),
('Design', 'design', 'UI/UX design and creative services', 'Palette'),
('Marketing', 'marketing', 'Digital marketing and growth services', 'TrendingUp'),
('Consulting', 'consulting', 'Business and technical consulting', 'Users'),
('Support', 'support', 'Customer support and operations', 'Headphones');

-- Indexes for performance
CREATE INDEX idx_marketplace_services_category ON marketplace_services(category_id);
CREATE INDEX idx_marketplace_services_provider ON marketplace_services(provider_organization_id);
CREATE INDEX idx_service_orders_customer ON service_orders(customer_organization_id);
CREATE INDEX idx_service_orders_provider ON service_orders(provider_organization_id);
CREATE INDEX idx_api_integrations_org ON api_integrations(organization_id);
CREATE INDEX idx_ai_recommendations_org ON ai_recommendations(organization_id);
CREATE INDEX idx_workflow_automations_org ON workflow_automations(organization_id);
CREATE INDEX idx_analytics_events_org ON analytics_events(organization_id);
CREATE INDEX idx_analytics_events_type ON analytics_events(event_type);