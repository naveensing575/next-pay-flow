import { MongoClient, ServerApiVersion } from "mongodb"

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your Mongo URI to .env or .env.local")
}

const uri = process.env.MONGODB_URI

// Optimized options for serverless environments (Vercel)
const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  // Connection pool settings for serverless
  maxPoolSize: 10, // Limit connections for serverless
  minPoolSize: 1,
  maxIdleTimeMS: 10000, // Close idle connections after 10s
  serverSelectionTimeoutMS: 10000, // Fail fast if can't connect
  socketTimeoutMS: 45000,
  connectTimeoutMS: 10000,
  // Retry settings
  retryWrites: true,
  retryReads: true,
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

declare global {
  // allow global var reuse across hot reloads in dev
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

if (process.env.NODE_ENV === "development") {
  // In development, use a global variable to preserve the connection across hot reloads
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  // In production (serverless), create new client but reuse connection via connection pooling
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export default clientPromise
