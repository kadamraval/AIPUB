const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export async function fetchWebsites() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/websites/`, { cache: 'no-store' }).catch(() => null)
    if (!res || !res.ok) return []
    return await res.json()
  } catch (error) {
    return []
  }
}

export async function fetchWebsiteById(id: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/websites/${id}`, { cache: 'no-store' }).catch(() => null)
    if (!res || !res.ok) return null
    return await res.json()
  } catch (error) {
    console.error("API Error (Website By Id):", error)
    return null
  }
}

export async function createWebsite(data: { logo_url?: string; name: string; domain: string; workflow_name: string; cms_type: string; cms_credentials: any }) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/websites/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }).catch(() => null)
    if (!res) return null
    return await res.json()
  } catch (error) {
    console.error("API Error (Create Website):", error)
    return null
  }
}

export async function updateWebsite(id: string, data: { logo_url?: string; name?: string; domain?: string; workflow_name?: string; cms_type?: string; cms_credentials?: any }) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/websites/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }).catch(() => null)
    if (!res) return null
    return await res.json()
  } catch (error) {
    console.error("API Error (Update Website):", error)
    return null
  }
}

export async function toggleWebsiteStatus(id: string, status: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/websites/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    }).catch(() => null)
    if (!res) return null
    return await res.json()
  } catch (error) {
    console.error("API Error (Toggle Website Status):", error)
    return null
  }
}

export async function deleteWebsite(id: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/websites/${id}`, { method: "DELETE" }).catch(() => null)
    if (!res) return null
    return await res.json()
  } catch (error) {
    console.error("API Error (Delete Website):", error)
    return null
  }
}

// Custom Workflows Builder Blueprints
export async function fetchWorkflows() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/workflows/`, { cache: 'no-store' }).catch(() => null)
    if (!res || !res.ok) return []
    return await res.json()
  } catch (error) {
    return []
  }
}

export async function createWorkflow(data: { name: string; description: string; target_cms: string; steps: any[] }) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/workflows/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }).catch(() => null)
    if (!res) return null
    return await res.json()
  } catch (error) {
    console.error("API Error (Create Workflow):", error)
    return null
  }
}

export async function updateWorkflow(id: string, data: { name: string; description: string; target_cms: string; steps: any[] }) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/workflows/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }).catch(() => null)
    if (!res) return null
    return await res.json()
  } catch (error) {
    console.error("API Error (Update Workflow):", error)
    return null
  }
}

export async function deleteWorkflow(id: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/workflows/${id}`, { method: "DELETE" }).catch(() => null)
    if (!res) return null
    return await res.json()
  } catch (error) {
    console.error("API Error (Delete Workflow):", error)
    return null
  }
}

// Data Sources (RSS, Google News, Subreddits, GitHub, Web Scrapers)
export async function fetchSources() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/sources/`, { cache: 'no-store' }).catch(() => null)
    if (!res || !res.ok) return []
    return await res.json()
  } catch (error) {
    return []
  }
}

export async function createSource(data: { name: string; source_type: string; url: string; target_site: string; fetch_interval: string }) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/sources/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }).catch(() => null)
    if (!res) return null
    return await res.json()
  } catch (error) {
    console.error("API Error (Create Source):", error)
    return null
  }
}

export async function triggerFetchSource(id: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/sources/${id}/fetch`, { method: "POST" }).catch(() => null)
    if (!res) return null
    return await res.json()
  } catch (error) {
    console.error("API Error (Fetch Source):", error)
    return null
  }
}

export async function deleteSource(id: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/sources/${id}`, { method: "DELETE" }).catch(() => null)
    if (!res) return null
    return await res.json()
  } catch (error) {
    console.error("API Error (Delete Source):", error)
    return null
  }
}

// Integrations (Combined Plugins, APIs, MCP Marketplace)
export async function fetchIntegrations() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/integrations/`, { cache: 'no-store' }).catch(() => null)
    if (!res || !res.ok) return []
    return await res.json()
  } catch (error) {
    console.error("API Error (Fetch Integrations):", error)
    return []
  }
}

export async function createIntegration(data: { name: string; category: string; provider: string; credentials: any }) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/integrations/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }).catch(() => null)
    if (!res) return null
    return await res.json()
  } catch (error) {
    console.error("API Error (Create Integration):", error)
    return null
  }
}

export async function updateIntegration(id: string, data: { name?: string; status?: string; credentials?: any }) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/integrations/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }).catch(() => null)
    if (!res) return null
    return await res.json()
  } catch (error) {
    console.error("API Error (Update Integration):", error)
    return null
  }
}

export async function toggleIntegrationStatus(id: string, status: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/integrations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    }).catch(() => null)
    if (!res) return null
    return await res.json()
  } catch (error) {
    console.error("API Error (Toggle Integration Status):", error)
    return null
  }
}

export async function deleteIntegration(id: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/integrations/${id}`, { method: "DELETE" }).catch(() => null)
    if (!res) return null
    return await res.json()
  } catch (error) {
    console.error("API Error (Delete Integration):", error)
    return null
  }
}

export const fetchApiKeys = fetchIntegrations
export const createApiKey = createIntegration

// Custom Agents & Skills
export async function fetchCustomAgents() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/custom-agents/`, { cache: 'no-store' }).catch(() => null)
    if (!res || !res.ok) return []
    return await res.json()
  } catch (error) {
    console.error("API Error (Fetch Custom Agents):", error)
    return []
  }
}

export async function createCustomAgent(data: { name: string; role_description: string; skills: any[]; permitted_integrations?: string[]; permitted_sources?: string[]; system_prompt: string }) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/custom-agents/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }).catch(() => null)
    if (!res) return null
    return await res.json()
  } catch (error) {
    console.error("API Error (Create Custom Agent):", error)
    return null
  }
}

export async function updateCustomAgent(id: string, data: { name: string; role_description: string; skills: any[]; permitted_integrations?: string[]; permitted_sources?: string[]; system_prompt: string }) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/custom-agents/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }).catch(() => null)
    if (!res) return null
    return await res.json()
  } catch (error) {
    console.error("API Error (Update Custom Agent):", error)
    return null
  }
}

export async function deleteCustomAgent(id: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/custom-agents/${id}`, { method: "DELETE" }).catch(() => null)
    if (!res) return null
    return await res.json()
  } catch (error) {
    console.error("API Error (Delete Custom Agent):", error)
    return null
  }
}

export async function fetchArticles(status?: string) {
  try {
    const url = status ? `${API_BASE_URL}/api/v1/articles/?status=${status}` : `${API_BASE_URL}/api/v1/articles/`
    const res = await fetch(url, { cache: 'no-store' }).catch(() => null)
    if (!res || !res.ok) return []
    return await res.json()
  } catch (error) {
    console.error("API Error (Articles):", error)
    return []
  }
}

export async function fetchAnalyticsSummary() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/agents/summary`, { cache: 'no-store' }).catch(() => null)
    if (!res || !res.ok) return null
    return await res.json()
  } catch (error) {
    console.error("API Error (Analytics):", error)
    return null
  }
}

export async function triggerAgentWorkflow(siteId: string, topic: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/agents/trigger`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ website_id: siteId, topic: topic, auto_publish: true })
    }).catch(() => null)
    if (!res) return { status: "error", message: "Failed to connect to backend service" }
    return await res.json()
  } catch (error) {
    console.error("API Error (Trigger Workflow):", error)
    return { status: "error", message: String(error) }
  }
}
