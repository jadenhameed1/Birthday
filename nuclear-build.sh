#!/bin/bash
echo "🚀 RUNNING NUCLEAR BUILD..."

# Clean everything
rm -rf .next out

# Remove any problematic files
find . -name "* *" -type f -delete 2>/dev/null || true

# Install fresh
echo "📦 Installing dependencies..."
npm install

# Build static site
echo "🔨 Building static site..."
npm run build

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ SUCCESS! Static build completed!"
    echo ""
    echo "📁 Your static site is in: /out"
    echo ""
    echo "🚀 Deployment ready!"
    echo "   You can now deploy the 'out' folder to:"
    echo "   - Vercel: https://vercel.com/new"
    echo "   - Netlify: https://app.netlify.com/"
    echo "   - GitHub Pages: Push to GitHub and enable Pages"
    echo "   - Any static hosting service"
    echo ""
    echo "🌐 Test locally:"
    echo "   npx serve out"
else
    echo ""
    echo "❌ Build failed. Checking for remaining issues..."
    echo "   Make sure all pages are static (no React hooks)"
    echo "   Check for files with spaces in names"
    echo "   Verify no dynamic data in pages"
fi
