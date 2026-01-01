# 📱 Advanced Mobile API Technical Specification (v1)

This is the definitive technical reference for Integrating the **Next.js Backend** with the **Expo/React Native** mobile application.

---

## 🏛️ Core Architectural Principles

1.  **Statelessness**: Every request is self-contained. Identity is resolved via Secure Cookies/Tokens.
2.  **Multi-Tenancy**: The `organizationId` is automatically resolved from the user's active context. You **never** need to pass `orgId` in request bodies.
3.  **RBAC (Role-Based Access Control)**: Permissions are enforced at the gateway. 
4.  **Optimistic UI Ready**: All IDs are UUIDs (v4). You can generate them on the mobile client for immediate UI updates if necessary.

---

## 🔐 Authentication Deep-Dive

We use **Better Auth** with a session-based approach.

### Headers Requirement
| Header | Value | Description |
| :--- | :--- | :--- |
| `Authorization` | `Bearer <token>` | Fixed token from `SecureStore` (Recommended for Mobile) |
| `Content-Type` | `application/json` | Required for all POST/PATCH requests |
| `Accept` | `application/json` | Ensures responses are parsed as JSON |

### Handling Session Expiry (401)
The mobile app should implement an interceptor:
```typescript
// Interceptor logic
if (error.status === 401) {
  await SecureStore.deleteItemAsync('user_session');
  router.replace('/login');
}
```

---

## 🧭 Identity & Context (`/me`)
This endpoint should be called immediately after login and during every app cold-start.

### `GET /me`
Returns the "Source of Truth" for the user's current session.

**Detailed Response Schema:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "Ahmed Ali",
    "role": "owner | admin | manager | viewer", // USE THIS for UI logic
    "image": "url | null"
  },
  "organizationId": "uuid",
  "permissions": [ // Derived permissions list
    "products.view",
    "orders.manage",
    ...
  ]
}
```

---

## 📦 Inventory Engine (`/products`)

### `GET /products`
**Query Parameters:**
- `query` (string): Search products by name (min 2 chars).
- `limit` (number): Max items to return (default: 50).

**Response Item Detail:**
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID | Unique product ID |
| `price` | Number | Normalized price (Client should format based on `currency`) |
| `stock` | Integer | Absolute stock count |
| `status` | Enum | `active` (visible to customers), `draft` (hidden) |

### `POST /products` (Validator Rules)
The backend enforces **Strict Validation**. Failures return `400 Bad Request`.
```json
{
  "name": "string (min:1, max:255)",
  "price": "number (non-negative)",
  "stock": "integer (min:0)",
  "categoryId": "uuid | null",
  "brand": "string (max:255)",
  "status": "draft | active"
}
```

---

## 🛒 Order Pipeline (`/orders`)

### `POST /orders` (Point of Sale)
Use this to create an order from the mobile app.
```json
{
  "customerName": "string",
  "totalAmount": number,
  "status": "pending",
  "items": [ // Future implementation
    { "productId": "uuid", "quantity": number, "price": number }
  ]
}
```

### `PATCH /orders/:id` (Fulfillment)
**Transition Logic:**
- `pending` ➡️ `completed` (Common Flow)
- `completed` ➡️ `returned` (Refund Flow)

---

## 📈 Real-time Analytics (`/analytics`)
Data structure specialized for **Mobile Charts** (Optimized for `VictoryNative` or `GiftedCharts`).

### `GET /analytics`
**Field Definitions:**
- `totalRevenue`: Sum of all `completed` orders.
- `salesData`: Timeseries data. `isAboveAverage` flag helps highlight "Hot Days".
- `bestSellers`: Sorted by revenue, limited to Top 5.

---

## 🛡️ Permission Matrix Table
Use this table to map mobile screens to user roles.

| Permission | Owner | Admin | Manager | Viewer |
| :--- | :---: | :---: | :---: | :---: |
| `org.update` | ✅ | ❌ | ❌ | ❌ |
| `users.view` | ✅ | ✅ | ✅ | ✅ |
| `products.create` | ✅ | ✅ | ✅ | ❌ |
| `orders.manage` | ✅ | ✅ | ✅ | ❌ |
| `analytics.view` | ✅ | ✅ | ✅ | ✅ |

---

## 🐣 The "No-Organization" lifecycle

A critical flow for mobile is handling users who have an account but haven't created or joined a store (Organization) yet.

### 🔍 Detection
When calling `GET /me`, if the user has no organization, the response will look like this:
```json
{
  "user": { ... },
  "organizationId": null // THIS IS THE TRIGGER for Onboarding UI
}
```
**Mobile Action**: If `organizationId` is `null`, navigate the user to the `OnboardingScreen`.

### 🏗️ Onboarding Flow (`POST /onboarding`)
This endpoint is **exempt** from the organization check. It only requires a valid session.

**Scenario A: Creating a New Store**
```json
{
  "action": "create",
  "name": "Super Coffee Shop",
  "slug": "super-coffee" // Optional
}
```

**Scenario B: Joining via Invite**
```json
{
  "action": "join",
  "inviteCode": "uuid-of-target-org" 
}
```

---

## 🛠️ Expo Integration Example (Axios)

```typescript
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const api = axios.create({
  baseURL: 'https://api.verve.com/api/v1/mobile',
});

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Example: Fetching Products
export const getProducts = async () => {
  const { data } = await api.get('/products');
  return data; // Typed as Product[]
};
```

---

## 🚨 Error Catalog & Recovery 

| Error Message | Scenario | Action |
| :--- | :--- | :--- |
| `Forbidden` | Viewer trying to edit price | Show "Permission Denied" Alert |
| `Validation failed` | Negative stock value | Highlight input field in Red |
| `Organization not found` | Org deleted or moved | Force re-login |
| `Internal Server Error`| Database timeout | Show "Try again later" snackbar |

---

### 📅 Document Info
- **Version**: 1.2.0 (Structural Harmony Edition)
- **Last Updated**: 2026-01-01
- **Contact**: API Team / Architecture Guild
