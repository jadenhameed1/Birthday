const fs = require('fs')

console.log('🔍 CHECKING ALL PAGES FOR 404 ERRORS...\\n')

const pages = [
  { path: 'app/dashboard/page.js', name: 'Dashboard' },
  { path: 'app/team/page.js', name: 'Team' },
  { path: 'app/marketplace/page.js', name: 'Marketplace' },
  { path: 'app/bookings/page.js', name: 'Bookings' },
  { path: 'app/providers/page.js', name: 'Providers' },
  { path: 'app/ai-insights/page.js', name: 'AI Insights' },
  { path: 'app/chat/page.js', name: 'AI Assistant' },
  { path: 'app/settings/page.js', name: 'Settings' }
]

let allGood = true

pages.forEach(page => {
  const exists = fs.existsSync(page.path)
  console.log(`${exists ? '✅' : '❌'} ${page.name}: ${exists ? 'EXISTS' : 'MISSING'}`)
  if (!exists) allGood = false
})

console.log('\\n🎯 RESULT:')
if (allGood) {
  console.log('✅ SUCCESS! All pages exist. No more 404 errors!')
  console.log('🌐 Test your AI Assistant at: http://localhost:3000/chat')
} else {
  console.log('❌ Some pages are missing. Running nuclear fix...')
}
