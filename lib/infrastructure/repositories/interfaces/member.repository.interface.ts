/**
 * Member Repository Interface
 */
export interface IMemberRepository {
    create(data: CreateMemberData): Promise<Member>;
    findByOrganizationId(organizationId: string): Promise<Member[]>;
    findByUserId(userId: string): Promise<Member[]>;
    findByUserAndOrg(userId: string, organizationId: string): Promise<Member | null>;
    updateRole(id: string, role: string): Promise<Member | null>;
}

export interface Member {
    id: string;
    organizationId: string;
    userId: string;
    role: 'owner' | 'admin' | 'manager' | 'viewer';
    joinedAt: Date;
}

export interface CreateMemberData {
    id: string;
    organizationId: string;
    userId: string;
    role: 'owner' | 'admin' | 'manager' | 'viewer';
}
