# Authentication System

This dating app uses a comprehensive authentication system built with Next.js best practices and Supabase.

## Architecture Overview

The authentication system consists of three main components:

1. **Middleware-based Route Protection** (`middleware.ts`)
2. **Higher-Order Component (HOC)** (`components/withAuth.tsx`)
3. **Authentication Context** (`contexts/auth-context.tsx`)

## 1. Middleware Protection

The middleware runs on the Edge Runtime and provides server-side route protection before pages even load.

### Protected Routes

- `/chat/*` - All chat-related pages
- `/matches/*` - All match-related pages
- `/profile/*` - All profile-related pages

### Features

- **Automatic Redirects**: Unauthenticated users are redirected to `/auth`
- **Return URL Preservation**: Users are redirected back to their original destination after login
- **Auth Page Protection**: Authenticated users accessing `/auth` are redirected away

### Configuration

```typescript
const protectedRoutes = ['/chat', '/matches', '/profile'];
```

## 2. Higher-Order Component (HOC)

The `withAuth` HOC provides client-side authentication protection for React components.

### Usage

```typescript
import { withAuth } from '@/components';

function MyProtectedPage() {
  return <div>Protected content</div>;
}

export default withAuth(MyProtectedPage, {
  loadingText: 'Loading...',
  redirectTo: '/auth', // optional, defaults to '/auth'
});
```

### Features

- **Loading States**: Shows loading spinner while checking auth
- **Customizable Messages**: Custom loading text per page
- **Flexible Redirects**: Configurable redirect destinations
- **Type Safety**: Full TypeScript support

## 3. Authentication Hook

For more granular control, use the `useAuthProtection` hook:

```typescript
import { useAuthProtection } from '@/components';

function MyComponent() {
  const { user, authLoading, isAuthenticated } = useAuthProtection('/auth');

  if (!isAuthenticated) return null;

  return <div>Protected content for {user.email}</div>;
}
```

## Implementation Examples

### Basic Protected Page

```typescript
'use client';

import { withAuth } from '@/components';

function ChatPage() {
  return <div>Chat interface</div>;
}

export default withAuth(ChatPage, {
  loadingText: 'Loading chats...',
});
```

### Page with Custom Logic

```typescript
'use client';

import { useAuthProtection } from '@/components';

function ProfilePage() {
  const { user, isAuthenticated } = useAuthProtection();

  if (!isAuthenticated) return null;

  return (
    <div>
      <h1>Welcome, {user.email}!</h1>
      {/* Profile content */}
    </div>
  );
}

export default ProfilePage;
```

## Security Benefits

1. **Defense in Depth**: Multiple layers of protection (middleware + client)
2. **Server-Side First**: Middleware blocks requests before React loads
3. **SEO Friendly**: Server redirects prevent flash of unauthorized content
4. **Performance**: Early redirects reduce unnecessary page loads
5. **User Experience**: Smooth redirects with return URL preservation

## Best Practices

1. **Use Middleware for Route-Level Protection**: Primary defense mechanism
2. **Use HOC for Page Components**: Clean, reusable component protection
3. **Use Hook for Custom Logic**: When you need fine-grained control
4. **Combine Approaches**: Middleware + HOC provides strongest protection
5. **Handle Loading States**: Always show loading indicators during auth checks

## Migration from Manual Auth Checks

**Before:**

```typescript
export default function ChatPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  if (loading) return <FullPageLoader />;
  if (!user) return null;

  return <div>Chat Page</div>;
}
```

**After:**

```typescript
function ChatPage() {
  return <div>Chat Page</div>;
}

export default withAuth(ChatPage, {
  loadingText: 'Loading chats...',
});
```

## Error Handling

The system gracefully handles:

- Network failures during auth checks
- Invalid or expired sessions
- Missing authentication tokens
- Supabase service interruptions

All errors result in safe redirects to the authentication page.
