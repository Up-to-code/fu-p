# Start Kit

A modern, full-featured Next.js starter kit with authentication, database integration, and beautiful UI components. Built to help you start your next project in minutes, not hours.

## ✨ Features

- 🔐 **Complete Authentication System**
  - Email/password authentication with [Better Auth](https://better-auth.com)
  - Login, registration, password reset flows
  - Protected routes with client-side wrapper
  - Session management with Zustand
  - Expo mobile app integration support

- 🎨 **Modern UI Components**
  - Built with [Shadcn UI](https://ui.shadcn.com)
  - Fully responsive design
  - Beautiful split-layout auth pages
  - Custom dashboard with sidebar navigation
  - Loading skeletons and error handling

- 🗄️ **Database Integration**
  - MongoDB with Mongoose ODM
  - Connection pooling and error handling
  - User model with TypeScript types

- 📊 **Dashboard**
  - Real dashboard with sidebar navigation
  - Stats cards, activity feed, and analytics placeholders
  - User profile management
  - Settings and notifications pages

- 🎯 **Developer Experience**
  - TypeScript for type safety
  - Zustand for state management
  - Custom React hooks for authentication
  - ESLint configuration
  - Tailwind CSS for styling

## 🚀 Tech Stack

- **Framework:** [Next.js 16.1.1](https://nextjs.org) (App Router)
- **Language:** TypeScript
- **Authentication:** [Better Auth](https://better-auth.com)
- **Database:** MongoDB with [Mongoose](https://mongoosejs.com)
- **State Management:** [Zustand](https://zustand-demo.pmnd.rs)
- **UI Components:** [Shadcn UI](https://ui.shadcn.com)
- **Styling:** [Tailwind CSS](https://tailwindcss.com)
- **Icons:** [Lucide React](https://lucide.dev)

## 📋 Prerequisites

- Node.js 18+ or Bun
- MongoDB database (local or cloud)
- npm, yarn, pnpm, or bun

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd start-kit
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # MongoDB Connection
   MONGODB_URI=mongodb://localhost:27017
   # or for MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net

   # MongoDB Database Name (optional, defaults to "Cluster0")
   MONGODB_DB_NAME=Cluster0

   # Better Auth Configuration
   BETTER_AUTH_SECRET=your-secret-key-here-min-32-characters
   BETTER_AUTH_URL=http://localhost:3000
   NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   bun dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
start-kit/
├── app/                      # Next.js App Router pages
│   ├── (auth)/              # Authentication pages (login, register, etc.)
│   ├── api/                 # API routes
│   │   └── auth/            # Better Auth API endpoints
│   ├── dashboard/           # Dashboard pages
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Landing page
│   ├── error.tsx            # Error page
│   └── not-found.tsx        # 404 page
├── components/              # React components
│   ├── auth/               # Authentication components
│   ├── dashboard/          # Dashboard components
│   ├── ui/                 # Shadcn UI components
│   ├── nav.tsx             # Navigation component
│   └── footer.tsx          # Footer component
├── hooks/                  # Custom React hooks
│   ├── use-auth.ts         # Main authentication hook
│   ├── use-session.ts      # Session hook
│   └── use-user.ts         # User data hook
├── lib/                    # Utility libraries
│   ├── auth/              # Auth configuration and utilities
│   ├── db/                # Database utilities
│   └── utils.ts           # General utilities
├── models/                # Mongoose models
│   └── User.ts            # User model
└── store/                 # Zustand stores
    └── auth-store.ts      # Authentication state store
```

## 🔑 Authentication

### Features

- Email/password authentication
- Session management
- Protected routes
- Password reset flow

### Usage

The authentication system is built with Better Auth and Zustand. Use the `useAuth` hook in your components:

```tsx
import { useAuth } from "@/hooks/use-auth";

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return <div>Welcome, {user?.name}!</div>;
}
```

### Protected Routes

Use the `AuthWrapper` component to protect routes:

```tsx
import { AuthWrapper } from "@/components/auth/auth-wrapper";

export default function ProtectedPage() {
  return (
    <AuthWrapper>
      <div>This content is protected</div>
    </AuthWrapper>
  );
}
```

## 🎨 UI Components

This project uses Shadcn UI components. All components are located in `components/ui/`:

- Button
- Input
- Card
- Alert
- Avatar
- Separator
- Skeleton
- And more...

To add new components:

```bash
npx shadcn@latest add [component-name]
```

## 📊 Dashboard

The dashboard includes:

- **Sidebar Navigation** - Easy navigation between sections
- **Stats Cards** - Display key metrics
- **Activity Feed** - Recent user activity
- **User Profile** - User information display
- **Settings** - Application settings
- **Analytics** - Analytics placeholder
- **Documents** - Document management placeholder

## 🗄️ Database

### MongoDB Connection

The project uses Mongoose for MongoDB connection. The connection is handled in `lib/db/mongoose.ts` with connection pooling.

### User Model

The User model is defined in `models/User.ts`:

```typescript
interface IUser {
  email: string;
  name: string;
  emailVerified?: boolean;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `MONGODB_URI` | MongoDB connection string (without database name) | Yes | - |
| `MONGODB_DB_NAME` | MongoDB database name | No | `Cluster0` |
| `BETTER_AUTH_SECRET` | Secret key for Better Auth (min 32 chars) | Yes | - |
| `BETTER_AUTH_URL` | Base URL for Better Auth (server) | Yes | - |
| `NEXT_PUBLIC_BETTER_AUTH_URL` | Base URL for Better Auth (client) | Yes | - |

### Better Auth Configuration

Better Auth is configured in `lib/auth/config.ts`. The configuration includes:

- MongoDB adapter
- Email/password provider
- Session management

## 📝 Scripts

```bash
# Development
npm run dev          # Start development server

# Production
npm run build        # Build for production
npm run start        # Start production server

# Linting
npm run lint         # Run ESLint
```

## 🎯 Customization

### Adding New Pages

1. Create a new file in `app/` directory
2. Export a default React component
3. Use the layout system for shared UI

### Adding New API Routes

1. Create a new file in `app/api/` directory
2. Export HTTP method handlers (GET, POST, etc.)

### Styling

The project uses Tailwind CSS. Customize colors and styles in:
- `app/globals.css` - Global styles and CSS variables
- `components.json` - Shadcn UI configuration

## 🐛 Troubleshooting

### MongoDB Connection Issues

- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env.local`
- Verify network connectivity for cloud databases

### Authentication Errors

- Verify `BETTER_AUTH_SECRET` is set (min 32 characters)
- Check that `BETTER_AUTH_URL` matches your domain
- Ensure MongoDB connection is working

### Build Errors

- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npm run lint`

## 📱 Expo Integration

This starter kit includes support for Expo mobile apps! See the [Expo Setup Guide](EXPO_SETUP.md) for detailed instructions on integrating your Expo app with this backend.

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Better Auth Documentation](https://better-auth.com/docs)
- [Shadcn UI Documentation](https://ui.shadcn.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Zustand Documentation](https://zustand-demo.pmnd.rs)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org) - The React framework
- [Better Auth](https://better-auth.com) - Authentication library
- [Shadcn UI](https://ui.shadcn.com) - UI component library
- [Vercel](https://vercel.com) - Deployment platform

---

Built with ❤️ using Next.js and modern web technologies.
