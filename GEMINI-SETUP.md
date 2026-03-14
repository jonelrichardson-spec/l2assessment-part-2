# Getting Your Free Google Gemini API Key

## Why Google Gemini?

✅ **Completely Free** - No credit card required for the free tier
✅ **Fast** - Gemini 2.0 Flash is optimized for speed and real-time applications
✅ **Generous Limits** - 15 requests per minute, 1500 requests per day on free tier
✅ **High Quality** - Gemini 2.0 Flash Experimental model performs excellently

## Step-by-Step Setup

### 1. Sign Up for Google AI Studio

Visit: https://aistudio.google.com/

- Sign in with your Google account
- Accept the terms of service
- **No credit card required!**

### 2. Get Your API Key

Once logged in:

1. Click "Get API key" in the top navigation
2. Click "Create API key"
3. Select "Create API key in new project" (or use an existing Google Cloud project)
4. **Copy the API key** - it starts with `AIza`

**Important**: Save this key somewhere safe! You can always view it again in the API keys section.

### 3. Add to Your Project

1. Open the project folder
2. Create or edit the `.env.local` file in the root directory
3. Add your key:

```
VITE_GEMINI_API_KEY=your-actual-key-here
```

4. Save the file
5. Restart the dev server:

```bash
npm run dev
```

### 4. Test It Out

1. Open http://localhost:5173
2. Go to the "Analyze" tab
3. Paste a test message: "Our server is down"
4. Click "Analyze Message"
5. You should see AI-powered results!

## Troubleshooting

### "Missing credentials" Error

**Problem**: The app can't find your API key

**Solution**:
- Make sure file is named `.env.local` (not `.env`)
- Check that the key starts with `AIza`
- Restart the dev server after adding the key
- Make sure there are no extra spaces in the file

### "Rate limit exceeded" Error

**Problem**: You've hit the free tier limit

**Solutions**:
- Wait a minute and try again (15 requests per minute limit)
- Wait until the next day if you've hit the daily limit (1500 requests/day)
- Use the built-in mock responses (automatic fallback)

### Key Not Working

**Problem**: API returns 401 Unauthorized or 403 Forbidden

**Solution**:
- Check that you've enabled the Generative Language API in your Google Cloud project
- Make sure the API key is copied correctly (no extra spaces)
- Regenerate a new key at https://aistudio.google.com/
- Update `.env.local` with the new key
- Restart dev server

### "API key not valid" Error

**Problem**: The API key is malformed or disabled

**Solution**:
- Go to https://aistudio.google.com/ and check your API keys
- Make sure the key hasn't been restricted or disabled
- Create a new API key if needed
- Update `.env.local` and restart the dev server

## Mock Mode (No API Key Needed)

If you don't want to use an API key, the app automatically falls back to **mock responses** when:
- No API key is configured
- API key is invalid
- Rate limit is exceeded

The mock mode uses realistic keyword-based categorization and works offline!

## Free Tier Limits

Google Gemini's free tier includes:

- **15 requests per minute**
- **1500 requests per day**
- Access to models including:
  - Gemini 2.0 Flash Experimental (what this app uses)
  - Gemini 1.5 Pro
  - Gemini 1.5 Flash

This is more than enough for development and testing!

## Need Help?

- Gemini Documentation: https://ai.google.dev/docs
- Google AI Studio: https://aistudio.google.com/
- Project README: See `README.md` in this folder

---

**Happy Triaging! 🚀**
