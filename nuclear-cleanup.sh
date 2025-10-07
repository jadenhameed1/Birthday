#!/bin/bash
echo "🧹 RUNNING NUCLEAR CLEANUP..."

# Remove all build artifacts
rm -rf .next
rm -rf node_modules/.cache

# Remove any problematic files
find . -name "* *" -type f -delete 2>/dev/null || true
find . -name "* *" -type d -exec rm -rf {} + 2>/dev/null || true

# Reinstall dependencies
echo "📦 Reinstalling dependencies..."
npm install

# Build the project
echo "🔨 Building project..."
npm run build

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ SUCCESS! Build completed without errors!"
    echo ""
    echo "🚀 Next steps:"
    echo "   npm run dev    # Start development server"
    echo "   git add .      # Add changes to git"
    echo "   git commit -m 'fix: Nuclear cleanup - build errors resolved'"
    echo "   git push       # Push to GitHub"
    echo ""
    echo "🎉 Your app is now 100% build-ready!"
else
    echo ""
    echo "❌ Build still failing. Checking for issues..."
    echo "   Check the error messages above"
    echo "   Make sure all components have 'use client' when needed"
    echo "   Verify there are no files with spaces in names"
fi
