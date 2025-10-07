#!/bin/bash
echo "🚀 Starting deployment process..."

# Remove any existing build
rm -rf .next

# Install dependencies
echo "�� Installing dependencies..."
npm install

# Build the project
echo "🔨 Building project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🎯 NEXT STEPS:"
    echo "1. Visit: https://vercel.com/new"
    echo "2. Import your GitHub repository"
    echo "3. Add these environment variables:"
    echo "   - NEXT_PUBLIC_SUPABASE_URL"
    echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY" 
    echo "   - OPENAI_API_KEY (optional)"
    echo "4. Deploy!"
    echo ""
    echo "🌐 Your app will be live at: https://your-app.vercel.app"
else
    echo "❌ Build failed. Check errors above."
fi
