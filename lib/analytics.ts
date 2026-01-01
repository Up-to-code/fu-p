import { track } from '@vercel/analytics';

/**
 * Analytics utility for tracking custom events
 * Documentation: https://vercel.com/docs/analytics/custom-events
 */

// Authentication Events
export const trackSignUp = (method: 'email' | 'google' | 'github') => {
    track('signup', { method });
};

export const trackLogin = (method: 'email' | 'google' | 'github') => {
    track('login', { method });
};

export const trackLogout = () => {
    track('logout');
};

export const trackPasswordReset = () => {
    track('password_reset');
};

// Dashboard Events
export const trackPageView = (page: string) => {
    track('page_view', { page });
};

export const trackDashboardAccess = (section: string) => {
    track('dashboard_access', { section });
};

// Order Events
export const trackOrderCreated = (orderId: string, value?: number) => {
    track('order_created', { orderId, value });
};

export const trackOrderStatusChanged = (orderId: string, status: string) => {
    track('order_status_changed', { orderId, status });
};

export const trackOrderDeleted = (orderId: string) => {
    track('order_deleted', { orderId });
};

// Product Events
export const trackProductCreated = (productId: string) => {
    track('product_created', { productId });
};

export const trackProductUpdated = (productId: string) => {
    track('product_updated', { productId });
};

export const trackProductDeleted = (productId: string) => {
    track('product_deleted', { productId });
};

// Organization Events
export const trackOrganizationCreated = (orgId: string) => {
    track('organization_created', { orgId });
};

export const trackOrganizationUpdated = (orgId: string) => {
    track('organization_updated', { orgId });
};

export const trackMemberInvited = (orgId: string, role: string) => {
    track('member_invited', { orgId, role });
};

// Employee Events
export const trackEmployeeAdded = (employeeId: string, role: string) => {
    track('employee_added', { employeeId, role });
};

export const trackEmployeeRemoved = (employeeId: string) => {
    track('employee_removed', { employeeId });
};

// Document Events
export const trackDocumentUploaded = (documentType: string, size?: number) => {
    track('document_uploaded', { documentType, size });
};

export const trackDocumentDownloaded = (documentId: string, documentType: string) => {
    track('document_downloaded', { documentId, documentType });
};

// Settings Events
export const trackSettingsChanged = (section: string) => {
    track('settings_changed', { section });
};

export const trackThemeChanged = (theme: 'light' | 'dark' | 'system') => {
    track('theme_changed', { theme });
};

// Error Events
export const trackError = (errorType: string, errorMessage?: string) => {
    track('error', { errorType, message: errorMessage });
};

// Navigation Events
export const trackNavigation = (from: string, to: string) => {
    track('navigation', { from, to });
};

// Search Events
export const trackSearch = (query: string, resultsCount?: number) => {
    track('search', { query, resultsCount });
};

// Export Events
export const trackExport = (type: string, format: string) => {
    track('export', { type, format });
};

// Generic track function for custom events
export const trackCustomEvent = (eventName: string, data?: Record<string, string | number | boolean | null>) => {
    track(eventName, data);
};
