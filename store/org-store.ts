import { create } from 'zustand';

export type OrganizationStatus = 'pending' | 'action_required' | 'approved' | 'rejected';

export interface Organization {
  id: string;
  name: string;
  ownerId: string;
  status: OrganizationStatus;
}

interface OrgState {
  organization: Organization | null;
  isLoading: boolean;
  setOrganization: (org: Organization | null) => void;
  updateStatus: (status: OrganizationStatus) => void;
  setLoading: (loading: boolean) => void;
}

export const useOrgStore = create<OrgState>((set) => ({
  organization: null,
  isLoading: false,
  setOrganization: (org) => set({ organization: org }),
  updateStatus: (status) =>
    set((state) => ({
      organization: state.organization ? { ...state.organization, status } : null,
    })),
  setLoading: (loading) => set({ isLoading: loading }),
}));
