import mongoose from 'mongoose'

function sanitizeAndBuildUri() {
  let uri = process.env.MONGO_URI || ''
  if (uri) {
    // Strip template markers like {{value}}
    if (uri.includes('{{') && uri.includes('}}')) {
      uri = uri.replace(/\{\{/g, '').replace(/\}\}/g, '')
    }

    // Ensure a sensible database name
    const pathMatch = /mongodb\+srv:\/\/[^/]+\/([^?]*)/i.exec(uri)
    const pathDb = pathMatch && pathMatch[1] ? pathMatch[1] : ''
    let fixed = uri

    if (!pathDb || /^rise?readycluster\d*$/i.test(pathDb)) {
      if (/mongodb\+srv:\/\/[^/]+\//i.test(fixed)) {
        // Replace existing (possibly empty/placeholder) path with /riseready
        fixed = fixed.replace(/(mongodb\+srv:\/\/[^/]+)\/(?:[^?]*)?/i, '$1/riseready')
      } else if (/mongodb\+srv:\/\/[^?]+\?/i.test(fixed)) {
        // Insert /riseready before query string
        fixed = fixed.replace(/(mongodb\+srv:\/\/[^/]+)(\?)/i, '$1/riseready$2')
      } else {
        // Append /riseready at the end
        fixed = fixed.replace(/(mongodb\+srv:\/\/[^/]+)(\/)?$/i, '$1/riseready')
      }
    }

    // Ensure authSource=admin (Atlas users authenticate against admin by default)
    if (!/[?&]authSource=/.test(fixed)) {
      fixed += fixed.includes('?') ? '&authSource=admin' : '?authSource=admin'
    }

    return fixed
  }

  const {
    MONGODB_USERNAME,
    MONGODB_PASSWORD,
    MONGODB_HOST,
    MONGODB_DBNAME,
    MONGODB_PARAMS,
  } = process.env

  if (MONGODB_USERNAME && MONGODB_PASSWORD && MONGODB_HOST) {
    const user = encodeURIComponent(MONGODB_USERNAME)
    const pass = encodeURIComponent(MONGODB_PASSWORD)
    const db = MONGODB_DBNAME || 'riseready'
    const params = MONGODB_PARAMS || 'retryWrites=true&w=majority&authSource=admin'
    return `mongodb+srv://${user}:${pass}@${MONGODB_HOST}/${db}?${params}`
  }

  throw new Error(
    'MongoDB config missing. Set MONGO_URI or MONGODB_USERNAME, MONGODB_PASSWORD, MONGODB_HOST (and optional MONGODB_DBNAME, MONGODB_PARAMS).'
  )
}

export async function connectDB() {
  const uri = sanitizeAndBuildUri()

  // Handle connection errors
  mongoose.connection.on('error', (error) => {
    console.error('[db] connection error:', error)
  })

  mongoose.connection.on('disconnected', () => {
    console.warn('[db] disconnected')
  })

  process.on('SIGINT', async () => {
    try {
      await mongoose.connection.close()
      console.log('[db] connection closed through app termination')
      process.exit(0)
    } catch (err) {
      console.error('[db] error closing connection:', err)
      process.exit(1)
    }
  })

  await mongoose.connect(uri, {
    autoIndex: true
  })
  
  const redacted = uri.replace(/\/\/([^:]+):[^@]+@/, '//$1:****@')
  console.log(`[db] connected to ${redacted}`)
}
