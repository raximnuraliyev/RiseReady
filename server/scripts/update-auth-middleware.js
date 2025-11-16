import fs from 'fs/promises'
import path from 'path'

const routesDir = path.join(process.cwd(), 'src', 'routes')

async function updateFile(filePath) {
  try {
    let content = await fs.readFile(filePath, 'utf8')
    
    // Update import statement
    content = content.replace(
      /import\s*{\s*authRequired\s*}\s*from\s*'\.\.\/middleware\/auth\.js'/g,
      "import { auth } from '../middleware/auth.js'"
    )
    
    // Update usage in routes
    content = content.replace(/authRequired/g, 'auth')
    
    await fs.writeFile(filePath, content, 'utf8')
    console.log(`Updated ${path.basename(filePath)}`)
  } catch (error) {
    console.error(`Error updating ${filePath}:`, error)
  }
}

async function updateAllFiles() {
  try {
    const files = await fs.readdir(routesDir)
    const routeFiles = files.filter(f => f.endsWith('.js'))
    
    await Promise.all(routeFiles.map(file => 
      updateFile(path.join(routesDir, file))
    ))
    
    console.log('All route files updated successfully')
  } catch (error) {
    console.error('Failed to update route files:', error)
  }
}

updateAllFiles()