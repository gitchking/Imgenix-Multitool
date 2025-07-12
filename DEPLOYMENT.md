# Netlify Deployment Guide

## Prerequisites
- GitHub account
- Netlify account
- Firebase project configured

## Step 1: Prepare Your Repository

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Configure for Netlify deployment"
   git push origin main
   ```

## Step 2: Set Up Netlify

1. **Go to [Netlify](https://netlify.com) and sign in**
2. **Click "New site from Git"**
3. **Choose GitHub as your Git provider**
4. **Select your repository**
5. **Configure build settings:**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Node version: 18

## Step 3: Environment Variables

Add these environment variables in Netlify dashboard:

### Firebase Configuration
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### How to get Firebase config:
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to Project Settings > General
4. Scroll down to "Your apps" section
5. Copy the config values

## Step 4: Deploy

1. **Click "Deploy site"**
2. **Wait for the build to complete**
3. **Your site will be available at: `https://your-site-name.netlify.app`**

## Step 5: Custom Domain (Optional)

1. **Go to Site settings > Domain management**
2. **Click "Add custom domain"**
3. **Follow the DNS configuration instructions**

## Troubleshooting

### Build Errors
- Check that all environment variables are set
- Ensure Node.js version is 18
- Verify all dependencies are in package.json

### Runtime Errors
- Check browser console for Firebase configuration errors
- Verify API routes are working
- Test authentication flow

### Performance Issues
- Check Netlify analytics
- Monitor build times
- Optimize images and assets

## Features That Work on Netlify

✅ **Static Pages**: All your tool pages  
✅ **API Routes**: `/api/proxy-image`, `/api/random-dog`, `/api/sharpen`  
✅ **Firebase Auth**: Login, signup, authentication  
✅ **Firebase Firestore**: Database operations  
✅ **Image Optimization**: Next.js Image component  
✅ **Client-side Features**: All React components  

## Monitoring

- **Netlify Analytics**: Monitor site performance
- **Firebase Analytics**: Track user behavior
- **Error Tracking**: Check Netlify function logs

## Support

If you encounter issues:
1. Check Netlify build logs
2. Verify environment variables
3. Test locally with `npm run build`
4. Check Firebase console for errors 