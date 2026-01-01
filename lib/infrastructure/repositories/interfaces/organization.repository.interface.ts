/**
 * Organization Repository Interface
 */
export interface IOrganizationRepository {
  findById(id: string): Promise<Organization | null>;
  findByOwnerId(ownerId: string): Promise<Organization | null>;
  findBySlug(slug: string): Promise<Organization | null>;
  create(data: CreateOrganizationData): Promise<Organization>;
  update(id: string, data: UpdateOrganizationData): Promise<Organization | null>;
  incrementMemberCount(id: string): Promise<void>;
  decrementMemberCount(id: string): Promise<void>;
  findAllGlobal(): Promise<Organization[]>;
}

export interface Organization {
  id: string;
  name: string;
  description: string | null;
  logo: string | null;
  slug: string;
  ownerId: string;
  currency: string | null;
  status: 'pending' | 'action_required' | 'approved' | 'rejected';
  memberCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateOrganizationData {
  name?: string;
  description?: string;
  logo?: string;
}

export interface CreateOrganizationData {
  id: string;
  name: string;
  slug: string;
  ownerId: string;
}

