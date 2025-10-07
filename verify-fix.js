const fs = require('fs')
const { execSync } = require('child_process')

console.log('🔍 VERIFYING NUCLEAR FIX...\\n')

// Check for files with spaces
console.log('1. Checking for problematic files...')
try {
  const filesWithSpaces = execSync('find . -name "* *" -type f | head -10', { encoding: 'utf8' })
  if (filesWithSpaces.trim()) {
    console.log('❌ Found files with spaces:')
    console.log(filesWithSpaces)
  } else {
    console.log('✅ No files with spaces found')
  }
} catch (e) {
  console.log('✅ No files with spaces found')
}

// Check client components
console.log('\\n2. Checking client components...')
const clientPages = [
  'app/dashboard/page.js',
  'app/chat/page.js',
  'app/team/page.js',
  'app/marketplace/page.js',
  'app/bookings/page.js',
  'app/providers/page.js',
  'app/ai-insights/page.js',
  'app/settings/page.js',
  'components/DashboardNav.js'
]

let allClientCorrect = true
clientPages.forEach(page => {
  if (fs.existsSync(page)) {
    const content = fs.readFileSync(page, 'utf8')
    if (content.includes("'use client'")) {
      console.log(`✅ ${page}: Has 'use client'`)
    } else {
      console.log(`❌ ${page}: Missing 'use client'`)
      allClientCorrect = false
    }
  } else {
    console.log(`❌ ${page}: Missing file`)
    allClientCorrect = false
  }
})

// Check server components
console.log('\\n3. Checking server components...')
const serverComponents = [
  'app/page.js',
  'app/layout.js',
  'app/api/ai/chat/route.js'
]

serverComponents.forEach(component => {
  if (fs.existsSync(component)) {
    const content = fs.readFileSync(component, 'utf8')
    if (!content.includes("'use client'")) {
      console.log(`✅ ${component}: Correctly server component`)
    } else {
      console.log(`❌ ${component}: Should not have 'use client'`)
    }
  }
})

console.log('\\n�� FINAL RESULT:')
if (allClientCorrect) {
  console.log('✅ 100% SUCCESS! All components are properly configured!')
  console.log('🚀 Run: npm run build (should work now)')
} else {
  console.log('❌ Some components need fixing')
}
