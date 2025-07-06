# 🔐 Google OAuth Setup Guide

This guide will help you set up Google OAuth authentication for your MyPlatform application.

## 📋 Prerequisites

- A Google account
- Access to Google Cloud Console
- Your application domain (for production) or localhost (for development)

## 🚀 Step-by-Step Setup

### 1. **Create a Google Cloud Project**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Enter a project name (e.g., "MyPlatform OAuth")
4. Click "Create"

### 2. **Enable Google+ API**

1. In your project, go to "APIs & Services" → "Library"
2. Search for "Google+ API" or "Google Identity"
3. Click on it and press "Enable"

### 3. **Create OAuth 2.0 Credentials**

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client IDs"
3. If prompted, configure the OAuth consent screen first:
   - **User Type**: External (or Internal if you have Google Workspace)
   - **App name**: MyPlatform
   - **User support email**: Your email
   - **Developer contact information**: Your email
   - **Authorized domains**: Add your domain (e.g., `yourdomain.com`)

### 4. **Configure OAuth Consent Screen**

1. **App name**: MyPlatform
2. **User support email**: Your email address
3. **App logo**: Upload your platform logo (optional)
4. **App domain**: Your domain
5. **Authorized domains**: Add your domain
6. **Scopes**: Add these scopes:
   - `email`
   - `profile`
   - `openid`

### 5. **Create OAuth 2.0 Client ID**

1. **Application type**: Web application
2. **Name**: MyPlatform Web Client
3. **Authorized JavaScript origins**:
   - `http://localhost:3000` (for development)
   - `https://yourdomain.com` (for production)
4. **Authorized redirect URIs**:
   - `http://localhost:3000/api/auth/callback/google` (for development)
   - `https://yourdomain.com/api/auth/callback/google` (for production)

### 6. **Get Your Credentials**

After creating the OAuth client, you'll get:
- **Client ID**: A long string like `123456789-abcdef.apps.googleusercontent.com`
- **Client Secret**: A secret string (keep this secure!)

### 7. **Add to Environment Variables**

Add these to your `.env` file:

```env
# Google OAuth
GOOGLE_CLIENT_ID=your-client-id-here
GOOGLE_CLIENT_SECRET=your-client-secret-here
```

### 8. **Test the Integration**

1. Start your development server: `npm run dev`
2. Go to your login page
3. Click the "Sign in with Google" button
4. You should be redirected to Google's consent screen
5. After authorization, you should be redirected back to your app

## 🔧 Troubleshooting

### **Common Issues**

1. **"Error: redirect_uri_mismatch"**
   - Make sure your redirect URI exactly matches what's in Google Console
   - Check for trailing slashes or protocol mismatches

2. **"Error: invalid_client"**
   - Verify your Client ID and Client Secret are correct
   - Make sure you copied them from the right OAuth client

3. **"Error: access_denied"**
   - Check if your OAuth consent screen is properly configured
   - Ensure the required scopes are added

### **Development vs Production**

- **Development**: Use `http://localhost:3000` in authorized origins
- **Production**: Use your actual domain (e.g., `https://myplatform.com`)
- **Multiple environments**: You can add multiple origins and redirect URIs

## 🔒 Security Best Practices

1. **Never commit credentials to version control**
   - Keep `.env` files in `.gitignore`
   - Use environment variables in production

2. **Use HTTPS in production**
   - Google OAuth requires HTTPS for production domains
   - Localhost is allowed for development

3. **Regular credential rotation**
   - Periodically regenerate your Client Secret
   - Monitor for any suspicious activity

## 📱 Mobile Considerations

If you plan to add mobile apps later:
1. Create additional OAuth clients for Android/iOS
2. Use different application types in Google Console
3. Configure platform-specific redirect URIs

## 🎯 Next Steps

After setting up Google OAuth:

1. **Test the flow** with different Google accounts
2. **Customize the user experience** in your app
3. **Add additional providers** (GitHub, Facebook, etc.) if needed
4. **Implement user profile management** for OAuth users

## 📞 Support

If you encounter issues:
1. Check Google Cloud Console logs
2. Verify your environment variables
3. Test with a fresh browser session
4. Check NextAuth.js documentation for advanced configuration

---

**Your Google OAuth integration is now ready! 🎉** 