import { createClient } from '@sanity/client'

// Current stable API version
const STABLE_API_VERSION = '2023-08-01'

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: STABLE_API_VERSION,
  useCdn: true,
})
