// Prisma Client Singleton & Mock Adapter for Browser/Dev environment
export interface MockDatabaseStore {
  websites: any[]
  articles: any[]
  workflows: any[]
  agents: any[]
  sources: any[]
  files: any[]
  subscriptions: any[]
  logs: any[]
  integrations: any[]
}

const globalForPrisma = globalThis as unknown as {
  mockStore?: MockDatabaseStore
}

export const mockStore: MockDatabaseStore = globalForPrisma.mockStore || {
  websites: [],
  articles: [],
  workflows: [],
  agents: [],
  sources: [],
  files: [],
  subscriptions: [],
  logs: [],
  integrations: []
}

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.mockStore = mockStore
}

export default mockStore
