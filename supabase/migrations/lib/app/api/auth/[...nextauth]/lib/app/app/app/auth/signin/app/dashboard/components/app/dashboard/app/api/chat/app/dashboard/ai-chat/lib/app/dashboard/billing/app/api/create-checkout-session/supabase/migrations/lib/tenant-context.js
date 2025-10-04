'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

const TenantContext = createContext()

export function TenantProvider({ children }) {
  const { data: session } = useSession()
  const [currentOrganization, setCurrentOrganization] = useState(null)
  const [organizations, setOrganizations] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (session?.user) {
      fetchUserOrganizations()
    }
  }, [session])

  const fetchUserOrganizations = async () => {
    try {
      const response = await fetch('/api/organizations')
      const data = await response.json()
      setOrganizations(data.organizations)
      
      // Set default organization (first one or last used)
      if (data.organizations.length > 0) {
        const lastUsedOrg = localStorage.getItem('lastUsedOrganization')
        const defaultOrg = lastUsedOrg 
          ? data.organizations.find(org => org.id === lastUsedOrg)
          : data.organizations[0]
        setCurrentOrganization(defaultOrg || data.organizations[0])
      }
    } catch (error) {
      console.error('Error fetching organizations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const switchOrganization = async (organizationId) => {
    const org = organizations.find(o => o.id === organizationId)
    if (org) {
      setCurrentOrganization(org)
      localStorage.setItem('lastUsedOrganization', organizationId)
      
      // Track organization switch
      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: 'organization_switch',
          organizationId: organizationId
        })
      })
    }
  }

  const createOrganization = async (organizationData) => {
    const response = await fetch('/api/organizations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(organizationData)
    })
    
    const newOrg = await response.json()
    setOrganizations(prev => [...prev, newOrg])
    return newOrg
  }

  const value = {
    currentOrganization,
    organizations,
    isLoading,
    switchOrganization,
    createOrganization,
    refreshOrganizations: fetchUserOrganizations
  }

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  )
}

export const useTenant = () => {
  const context = useContext(TenantContext)
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider')
  }
  return context
}