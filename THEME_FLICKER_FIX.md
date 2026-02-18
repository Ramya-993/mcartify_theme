# Theme Flicker Fix Implementation

This document explains the solution implemented to fix the theme flickering issue where the default theme would briefly appear before switching to the correct dynamic theme.

## Problem Description

The flickering occurred due to this sequence:

1. **Initial Render**: Components rendered with default fallback values (`themeId: "default"`)
2. **Client-side Hydration**: `fetchStore()` was called from client components
3. **Store Update**: Redux store got populated with actual theme data
4. **Re-render**: Components re-rendered with correct theme, causing visible flicker

## Solution Overview

The fix implements **server-side store initialization** combined with **CSS-based flicker prevention**:

### 1. Server-Side Store Initialization

#### Added Store Action (`src/store/slices/store.ts`)

```typescript
reducers: {
  setInitialData: (state, action) => {
    state.store = action.payload.Store;
    state.channel = action.payload.Channel;
    state.storestatus = action.payload.StoreStatus;
    state.isLoading = false;
    state.error = null;
  },
}
```

#### Created StoreInitializer Component (`src/components/StoreInitializer.tsx`)

- Runs immediately when the app mounts
- Populates Redux store with server-side data from `generateMetadata()`
- Prevents the need for client-side API calls for initial theme data

#### Updated Layout (`src/app/layout.tsx`)

```typescript
<StoreProvider>
  <StoreInitializer storeData={data} />
  <ThemeProvider>{/* rest of app */}</ThemeProvider>
</StoreProvider>
```

### 2. Enhanced Theme Provider

#### Loading State Management (`src/components/theme-provider.tsx`)

- Tracks theme readiness with `isThemeReady` state
- Applies CSS classes for loading/loaded states
- Provides smooth transitions between states

#### CSS Classes Applied

- `theme-loading`: Applied initially when store data is not available
- `theme-loaded`: Applied when store data is ready and theme can be applied

### 3. CSS-Based Flicker Prevention (`src/app/globals.css`)

```css
/* Theme flicker prevention */
.theme-loading {
  opacity: 0;
  transition: opacity 0.1s ease-in;
}

.theme-loaded {
  opacity: 1;
  transition: opacity 0.1s ease-in;
}

/* Ensure smooth theme transitions */
.theme-loading * {
  visibility: hidden;
}

.theme-loaded * {
  visibility: visible;
}
```

### 4. Optimized API Calls

#### Updated Components

- **Navbar Component**: Only calls `fetchStore()` if store data is not available
- **useNavbar Hook**: Same optimization applied

```typescript
useEffect(() => {
  // Only fetch store data if not already available (fallback for client-side navigation)
  if (!storeDetails) {
    dispatch(fetchStore());
  }
}, [storeDetails, dispatch]);
```

## How It Works

1. **Server-Side**: `generateMetadata()` fetches store data during SSR
2. **Initial Mount**: `StoreInitializer` immediately populates Redux store
3. **Theme Provider**: Detects store availability and applies `theme-loaded` class
4. **CSS**: Smoothly transitions from hidden to visible state
5. **Components**: Render with correct theme data from the first paint

## Benefits

- ✅ **Eliminates Theme Flicker**: No more flash of default theme
- ✅ **Improved Performance**: Reduces unnecessary API calls
- ✅ **Better UX**: Smooth, professional loading experience
- ✅ **SEO Friendly**: Proper theme applied during SSR
- ✅ **Fallback Support**: Still works for client-side navigation

## Testing

1. **Hard Refresh**: No flicker should occur on page reload
2. **Client Navigation**: Theme should persist across route changes
3. **Network Throttling**: Graceful loading even on slow connections
4. **Different Themes**: Works with all theme configurations

## Debugging

The implementation includes comprehensive logging:

- Store initialization logs in `StoreInitializer`
- Theme readiness logs in `ThemeProvider`
- Theme debug information with applied classes and styles

Check browser console for:

```
Store initialized with server-side data: { storeId, themeId, serviceName }
Theme ready - flicker prevention activated
Theme Debug: { appliedTheme, isThemeReady, isLoading, ... }
```

## Future Improvements

1. **Preload Critical Themes**: Cache frequently used theme components
2. **Progressive Enhancement**: Load theme assets progressively
3. **Theme Prefetching**: Preload themes based on user behavior
4. **Performance Monitoring**: Track theme loading metrics
