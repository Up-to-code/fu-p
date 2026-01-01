import { members } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { BaseRepository } from "./base.repository";
import type { IMemberRepository, Member, CreateMemberData } from "./interfaces/member.repository.interface";

/**
 * Member Repository Implementation
 * 
 * Handles database operations for organization members.
 */
export class MemberRepository extends BaseRepository implements IMemberRepository {
    /**
     * Helper to map raw database member to Domain Member interface
     */
    private mapToMember(m: any): Member {
        return {
            id: m.id,
            organizationId: m.organizationId,
            userId: m.userId,
            role: m.role,
            joinedAt: m.joinedAt,
        };
    }

    async create(data: CreateMemberData): Promise<Member> {
        const [inserted] = await this.db.insert(members).values({
            id: data.id,
            organizationId: data.organizationId,
            userId: data.userId,
            role: data.role,
        }).returning();

        if (!inserted) {
            throw new Error("Failed to create member");
        }

        return this.mapToMember(inserted);
    }

    async findByOrganizationId(organizationId: string): Promise<Member[]> {
        const membersList = await this.db.query.members.findMany({
            where: this.tenantFilter(members.organizationId, organizationId),
        });

        return membersList.map(m => this.mapToMember(m));
    }

    async findByUserId(userId: string): Promise<Member[]> {
        const membersList = await this.db.query.members.findMany({
            where: eq(members.userId, userId),
        });

        return membersList.map(m => this.mapToMember(m));
    }

    async findByUserAndOrg(userId: string, organizationId: string): Promise<Member | null> {
        const member = await this.db.query.members.findFirst({
            where: this.tenantFilter(members.organizationId, organizationId, eq(members.userId, userId)),
        });

        if (!member) return null;
        return this.mapToMember(member);
    }

    async updateRole(id: string, role: string): Promise<Member | null> {
        const [updated] = await this.db
            .update(members)
            .set({ role: role as any })
            .where(eq(members.id, id))
            .returning();

        if (!updated) return null;
        return this.mapToMember(updated);
    }
}

// Export singleton instance
export const memberRepository = new MemberRepository();
