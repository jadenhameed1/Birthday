const fs = require('fs')

console.log('🔍 VERIFYING STATIC BUILD READINESS...\\n')

// Check for React hooks in pages
console.log('1. Checking for React hooks in pages...')
const pages = [
  'app/page.js',
  'app/dashboard/page.js',
  'app/chat/page.js',
  'app/team/page.js',
  'app/marketplace/page.js',
  'app/bookings/page.js',
  'app/providers/page.js',
  'app/ai-insights/page.js',
  'app/settings/page.js'
]

let hasHooks = false
pages.forEach(page => {
  if (fs.existsSync(page)) {
    const content = fs.readFileSync(page, 'utf8')
    if (content.includes('useState') || content.includes('useEffect') || content.includes('useRef')) {
      console.log(`❌ ${page}: Contains React hooks`)
      hasHooks = true
    } else {
      console.log(`✅ ${page}: Static (no hooks)`)
    }
  }
})

// Check config
console.log('\\n2. Checking build configuration...')
if (fs.existsSync('next.config.js')) {
  const config = fs.readFileSync('next.config.js', 'utf8')
  if (config.includes("output: 'export'")) {
    console.log('✅ Next.js configured for static export')
  } else {
    console.log('❌ Next.js not configured for static export')
  }
}

console.log('\\n🎯 RESULT:')
if (!hasHooks) {
  console.log('✅ 100% READY FOR STATIC BUILD!')
  console.log('🚀 Run: ./nuclear-build.sh')
} else {
  console.log('❌ Some pages still have React hooks')
  console.log('   Remove useState/useEffect/useRef from pages')
}
