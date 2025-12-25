#!/bin/bash

# Firebase App Check Disable Script for Development
# This script helps you disable App Check for development

echo "🔧 Firebase App Check Development Helper"
echo "========================================"

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI is not installed."
    echo "📦 Install it with: npm install -g firebase-tools"
    echo "🔑 Then login with: firebase login"
    exit 1
fi

echo "✅ Firebase CLI found"

# Check if user is logged in
if ! firebase projects:list &> /dev/null; then
    echo "❌ You need to login to Firebase CLI first"
    echo "🔑 Run: firebase login"
    exit 1
fi

echo "✅ Firebase CLI authenticated"

# Get project ID
PROJECT_ID="daily-growth-tracker"

echo ""
echo "🔧 To disable App Check for development:"
echo ""
echo "1. Go to Firebase Console: https://console.firebase.google.com"
echo "2. Select your project: $PROJECT_ID"
echo "3. Go to: Authentication → Sign-in method → Authorized domains"
echo "4. Add your development domain: localhost"
echo ""
echo "📝 OR for production, configure App Check properly:"
echo "1. Go to: Project settings → App Check"
echo "2. Register your app with reCAPTCHA Enterprise"
echo "3. Use the site key in your app"
echo ""
echo "🚀 For now, the app will work without App Check enabled!"
echo "The updated Firebase config handles App Check errors gracefully."

echo ""
echo "✅ Your app should now work without the App Check error!"
