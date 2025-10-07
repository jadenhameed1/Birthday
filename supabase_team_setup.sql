-- Organizations table
CREATE TABLE IF NOT EXISTS organizations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Organization members (team members)
CREATE TABLE IF NOT EXISTS organization_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'member')),
  invited_email TEXT,
  status TEXT NOT NULL CHECK (status IN ('active', 'pending', 'invited')) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Update conversations to belong to organizations
ALTER TABLE conversations 
ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id),
ADD COLUMN IF NOT EXISTS is_private BOOLEAN DEFAULT true;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_organization_members_org_id ON organization_members(organization_id);
CREATE INDEX IF NOT EXISTS idx_organization_members_user_id ON organization_members(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_org_id ON conversations(organization_id);

-- Insert a demo organization
INSERT INTO organizations (name, slug) VALUES
('Demo Organization', 'demo-org')
ON CONFLICT (slug) DO NOTHING;

-- Enable RLS (Row Level Security) for security
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;

-- Create policies for organizations
CREATE POLICY "Users can view organizations they belong to" ON organizations
FOR SELECT USING (
  id IN (SELECT organization_id FROM organization_members WHERE user_id = auth.uid())
);

CREATE POLICY "Organization owners can update their org" ON organizations
FOR UPDATE USING (
  id IN (
    SELECT organization_id FROM organization_members 
    WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
  )
);

-- Create policies for organization_members
CREATE POLICY "Users can view members of their organizations" ON organization_members
FOR SELECT USING (
  organization_id IN (SELECT organization_id FROM organization_members WHERE user_id = auth.uid())
);

CREATE POLICY "Admins can manage organization members" ON organization_members
FOR ALL USING (
  organization_id IN (
    SELECT organization_id FROM organization_members 
    WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
  )
);
