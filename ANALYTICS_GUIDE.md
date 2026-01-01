# Vercel Analytics Custom Events - Implementation Guide

This guide explains how to use custom event tracking with Vercel Analytics in your Next.js application.

## Documentation
- [Vercel Analytics Custom Events](https://vercel.com/docs/analytics/custom-events)

## Setup

Analytics is already configured in your application:

1. **Package installed**: `@vercel/analytics` (v1.6.1)
2. **Component added**: `<Analytics />` in `app/layout.tsx`
3. **Utility created**: `lib/analytics.ts` with pre-defined tracking functions

## How to Use

### Basic Usage

Import the tracking function you need from `lib/analytics.ts`:

```tsx
import { trackLogin, trackSignUp, trackOrderCreated } from '@/lib/analytics';

// Track an event
trackLogin('email');
```

### Available Tracking Functions

#### Authentication Events
```tsx
import { trackSignUp, trackLogin, trackLogout, trackPasswordReset } from '@/lib/analytics';

// Track signup
trackSignUp('email');      // method: 'email' | 'google' | 'github'

// Track login
trackLogin('email');       // method: 'email' | 'google' | 'github'

// Track logout
trackLogout();

// Track password reset
trackPasswordReset();
```

#### Dashboard Events
```tsx
import { trackPageView, trackDashboardAccess } from '@/lib/analytics';

// Track page views
trackPageView('orders');

// Track dashboard section access
trackDashboardAccess('analytics');
```

#### Order Events
```tsx
import { 
  trackOrderCreated, 
  trackOrderStatusChanged, 
  trackOrderDeleted 
} from '@/lib/analytics';

// Track order creation
trackOrderCreated('order_123', 299.99);

// Track status change
trackOrderStatusChanged('order_123', 'shipped');

// Track deletion
trackOrderDeleted('order_123');
```

#### Product Events
```tsx
import { 
  trackProductCreated, 
  trackProductUpdated, 
  trackProductDeleted 
} from '@/lib/analytics';

trackProductCreated('product_456');
trackProductUpdated('product_456');
trackProductDeleted('product_456');
```

#### Organization Events
```tsx
import { 
  trackOrganizationCreated, 
  trackOrganizationUpdated, 
  trackMemberInvited 
} from '@/lib/analytics';

trackOrganizationCreated('org_789');
trackOrganizationUpdated('org_789');
trackMemberInvited('org_789', 'admin');
```

#### Employee Events
```tsx
import { trackEmployeeAdded, trackEmployeeRemoved } from '@/lib/analytics';

trackEmployeeAdded('emp_123', 'manager');
trackEmployeeRemoved('emp_123');
```

#### Document Events
```tsx
import { trackDocumentUploaded, trackDocumentDownloaded } from '@/lib/analytics';

trackDocumentUploaded('invoice', 1024000); // type, size in bytes
trackDocumentDownloaded('doc_123', 'pdf');
```

#### Settings Events
```tsx
import { trackSettingsChanged, trackThemeChanged } from '@/lib/analytics';

trackSettingsChanged('notifications');
trackThemeChanged('dark'); // 'light' | 'dark' | 'system'
```

#### Error Events
```tsx
import { trackError } from '@/lib/analytics';

trackError('api_error', 'Failed to fetch orders');
```

#### Navigation Events
```tsx
import { trackNavigation } from '@/lib/analytics';

trackNavigation('/dashboard', '/dashboard/orders');
```

#### Search Events
```tsx
import { trackSearch } from '@/lib/analytics';

trackSearch('summer collection', 15); // query, resultsCount
```

#### Export Events
```tsx
import { trackExport } from '@/lib/analytics';

trackExport('orders', 'csv');
```

#### Custom Events
```tsx
import { trackCustomEvent } from '@/lib/analytics';

// For any event not covered by pre-defined functions
trackCustomEvent('button_clicked', { 
  button: 'hero_cta', 
  page: 'landing' 
});
```

## Implementation Examples

### Example 1: Track Button Click (Client Component)

```tsx
'use client';

import { Button } from '@/components/ui/button';
import { trackCustomEvent } from '@/lib/analytics';

export function CTAButton() {
  const handleClick = () => {
    trackCustomEvent('cta_clicked', { location: 'hero' });
    // ... rest of your logic
  };

  return (
    <Button onClick={handleClick}>
      Get Started
    </Button>
  );
}
```

### Example 2: Track Form Submission

```tsx
'use client';

import { useState } from 'react';
import { trackOrderCreated } from '@/lib/analytics';

export function OrderForm() {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const order = await createOrder(formData);
      
      // Track successful order creation
      trackOrderCreated(order.id, order.total);
      
      router.push('/orders');
    } catch (error) {
      // Handle error
    }
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

### Example 3: Track Page Views with useEffect

```tsx
'use client';

import { useEffect } from 'react';
import { trackPageView } from '@/lib/analytics';

export function AnalyticsPage() {
  useEffect(() => {
    trackPageView('analytics');
  }, []);

  return <div>Analytics Dashboard</div>;
}
```

### Example 4: Track Navigation

```tsx
'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { trackNavigation } from '@/lib/analytics';

export function NavigationTracker() {
  const pathname = usePathname();
  const previousPath = useRef(pathname);

  useEffect(() => {
    if (previousPath.current !== pathname) {
      trackNavigation(previousPath.current, pathname);
      previousPath.current = pathname;
    }
  }, [pathname]);

  return null; // This is just a tracking component
}
```

### Example 5: Track Search with Debounce

```tsx
'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { trackSearch } from '@/lib/analytics';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    const searchProducts = async () => {
      if (!query) return;
      
      const results = await fetchSearchResults(query);
      setResults(results);
      
      // Track search after results are fetched
      trackSearch(query, results.length);
    };

    const timer = setTimeout(searchProducts, 500);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <Input 
      value={query} 
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search products..."
    />
  );
}
```

### Example 6: Track Errors in Error Boundary

```tsx
'use client';

import { useEffect } from 'react';
import { trackError } from '@/lib/analytics';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    trackError('page_error', error.message);
  }, [error]);

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

### Example 7: Track Theme Change

```tsx
'use client';

import { useTheme } from 'next-themes';
import { useEffect } from 'react';
import { trackThemeChanged } from '@/lib/analytics';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    trackThemeChanged(newTheme);
  };

  return (
    <select value={theme} onChange={(e) => handleThemeChange(e.target.value as any)}>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
      <option value="system">System</option>
    </select>
  );
}
```

### Example 8: Track Server Actions (Server Components)

For server-side tracking, you'll need to import from `@vercel/analytics/server`:

```tsx
// app/actions/orders.ts
'use server';

import { track } from '@vercel/analytics/server';

export async function createOrderAction(data: OrderData) {
  try {
    const order = await db.orders.create(data);
    
    // Track on server
    await track('order_created', { 
      orderId: order.id, 
      value: order.total 
    });
    
    return { success: true, order };
  } catch (error) {
    return { success: false, error: 'Failed to create order' };
  }
}
```

## Current Integration

The following pages already have analytics tracking:

### ✅ Login Page (`app/(auth)/login/page.tsx`)
- Tracks successful login with `trackLogin('email')`

### ✅ Register Page (`app/(auth)/register/page.tsx`)
- Tracks successful signup with `trackSignUp('email')`
- Tracks organization creation with `trackOrganizationCreated(orgId)`

## Recommended Next Steps

Consider adding tracking to these key areas:

1. **Dashboard Navigation** - Track which sections users visit most
2. **Order Management** - Track order status changes, deletions
3. **Product Management** - Track product CRUD operations
4. **Document Management** - Track uploads/downloads
5. **Settings Changes** - Track configuration updates
6. **Error Pages** - Track errors and 404s
7. **Search** - Track search queries and results
8. **Exports** - Track data exports

## Best Practices

1. **Keep event names consistent**: Use lowercase with underscores (e.g., `order_created`)
2. **Limit custom data**: Only send essential data points
3. **Don't track sensitive information**: Never send PII, passwords, or tokens
4. **Track at the right time**: After successful operations, not before
5. **Use client-side for user interactions**: trackbutton clicks, form submissions
6. **Use server-side for critical events**: Track important business logic on the server

## Limitations

- Maximum 255 characters for event names, keys, and values
- Number of custom data properties limited by your Vercel plan
- No nested objects in custom data
- Allowed values: string, number, boolean, null

## Viewing Analytics

1. Go to your Vercel dashboard
2. Select your project
3. Click on "Analytics"
4. Navigate to "Events" tab to see all custom events

## Additional Resources

- [Vercel Analytics Documentation](https://vercel.com/docs/analytics)
- [Custom Events API Reference](https://vercel.com/docs/analytics/custom-events)
- [Analytics Limits & Pricing](https://vercel.com/docs/analytics/limits-and-pricing)
