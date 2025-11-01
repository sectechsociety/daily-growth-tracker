# 🧪 AI Food Search Testing Guide

## ✅ What I Fixed

1. **Added Console Logging** - You can now see what's happening in the browser console
2. **Better Error Messages** - Shows specific errors (rate limit, API key, network issues)
3. **Clear Results Button** - Easily clear search and start fresh
4. **Prevents Double Searches** - Can't search while already searching

## 🔍 How to Test

### Step 1: Open Browser Console
1. Run your app
2. Open browser DevTools (F12 or Right-click → Inspect)
3. Go to the **Console** tab

### Step 2: Try a Search
1. Go to Calorie Tracker
2. Scroll to "🤖 AI-Powered Food Search"
3. Type "apple" in the search box
4. Click "Search" or press Enter

### Step 3: Check Console Output
You should see:
```
🔍 Searching for: apple
📡 API URL: https://api.api-ninjas.com/v1/nutrition
✅ API Response: [array of food items]
🎯 Transformed Results: [transformed data]
```

## 🐛 Troubleshooting

### Problem: "No results found"
**Check Console for:**
- `⚠️ No results found` - Try a different food name
- API might not recognize the term

**Solutions:**
- Try common foods: "chicken", "rice", "banana", "egg"
- Use simple terms, not complex dishes
- Try singular form: "apple" not "apples"

### Problem: "API key error"
**Console shows:** `Error details: 401`

**Solution:**
Check `src/config.js` - make sure API key is correct:
```javascript
NINJAS_API_KEY: 'GOD5Ac2Q+ZpViYkP68N7yQ==WH4Zsnm4KzY1RKHN'
```

### Problem: "Too many requests"
**Console shows:** `Error details: 429`

**Solution:**
- Wait 1-2 minutes before searching again
- API Ninjas free tier has rate limits
- Click "Clear" button and try again later

### Problem: "Network error"
**Console shows:** Network-related error

**Solution:**
- Check your internet connection
- Make sure you're not behind a firewall blocking the API
- Try a different network

### Problem: Search works once, then stops
**This is likely rate limiting**

**Solution:**
1. Click the "🗑️ Clear" button
2. Wait 30-60 seconds
3. Try searching again
4. Use different search terms to avoid caching issues

## 📊 Expected Behavior

### Successful Search:
1. Type "chicken breast"
2. Click Search
3. See loading spinner ("🔄 Searching...")
4. See toast: "✅ Found X results for 'chicken breast'!"
5. See food cards with nutrition info
6. Click "Add to Daily Intake" to log food

### Failed Search:
1. Type "asdfghjkl" (random text)
2. Click Search
3. See toast: "No results found for 'asdfghjkl'"
4. No cards displayed

## 🎯 Good Test Foods

These should work well:
- ✅ apple
- ✅ banana
- ✅ chicken breast
- ✅ brown rice
- ✅ salmon
- ✅ egg
- ✅ broccoli
- ✅ yogurt
- ✅ almonds
- ✅ oatmeal

## 📝 Console Commands for Testing

Open console and try:
```javascript
// Check if API config is loaded
console.log(window.API_CONFIG);

// Manual API test (replace YOUR_KEY with actual key)
fetch('https://api.api-ninjas.com/v1/nutrition?query=apple', {
  headers: { 'X-Api-Key': 'GOD5Ac2Q+ZpViYkP68N7yQ==WH4Zsnm4KzY1RKHN' }
})
.then(r => r.json())
.then(d => console.log('Direct API test:', d));
```

## 🚀 Next Steps

If everything works:
1. The search should return results
2. You should see detailed nutrition info
3. You can add foods to your daily intake
4. Foods appear in "Today's Meal Log"
5. You earn 5 XP per food added

If you see errors in the console, copy them and let me know!
