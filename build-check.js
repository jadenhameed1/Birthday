const { execSync } = require('child_process');

console.log('🚀 CHECKING PRODUCTION BUILD...\\n');

try {
  console.log('1. Checking dependencies...');
  execSync('npm ls --depth=0', { stdio: 'inherit' });
  
  console.log('\\n2. Running production build...');
  execSync('npm run build', { stdio: 'inherit' });
  
  console.log('\\n🎉 BUILD SUCCESSFUL! Ready for deployment.');
  console.log('📦 Next steps:');
  console.log('   - Push to GitHub: git push origin main');
  console.log('   - Deploy to Vercel: https://vercel.com/new');
  console.log('   - Or deploy to Netlify: https://app.netlify.com/');
  
} catch (error) {
  console.log('\\n❌ BUILD FAILED:');
  console.log('   Fix the errors above, then run: npm run build');
}
