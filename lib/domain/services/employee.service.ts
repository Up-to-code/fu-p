import { IUserRepository } from "@/lib/infrastructure/repositories/interfaces/user.repository.interface";
import { IOrganizationRepository } from "@/lib/infrastructure/repositories/interfaces/organization.repository.interface";
import { IMemberRepository } from "@/lib/infrastructure/repositories/interfaces/member.repository.interface";
import { IEmployeeService } from "./interfaces/employee.service.interface";
import { employeeUpdateRoleSchema } from "@/lib/domain/validators/employee.validator";
import { hasPermission } from "@/lib/permissions";
import { BusinessError, ValidationError, NotFoundError, UnauthorizedError } from "@/lib/domain/errors/business.error";

/**
 * Employee Service Implementation
 * 
 * Contains all business logic for employee management.
 */
export class EmployeeService implements IEmployeeService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly organizationRepository: IOrganizationRepository,
    private readonly memberRepository: IMemberRepository
  ) { }

  /**
   * Get all employees for an organization
   */
  async getEmployees(orgId: string) {
    // Fetch organization to get ownerId
    const org = await this.organizationRepository.findById(orgId);
    if (!org) return [];

    // Fetch employees (members)
    const employees = await this.userRepository.findByOrganizationId(orgId);

    // Ensure owner is included
    const owner = await this.userRepository.findById(org.ownerId);
    const allUsers = [...employees];

    // Add owner if not already in the list
    if (owner && !employees.find((e) => e.id === owner.id)) {
      allUsers.unshift(owner);
    }

    return allUsers.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role || 'viewer',
      image: u.image,
    }));
  }

  /**
   * Get a single employee Details
   */
  async getEmployee(orgId: string, employeeId: string) {
    const employee = await this.userRepository.findById(employeeId);
    if (!employee || (employee.organizationId !== orgId && await this.isOrgOwner(orgId, employeeId) === false)) {
      throw new NotFoundError("Employee");
    }
    return employee;
  }

  /**
   * Update employee role
   * 
   * Business Rules:
   * - Cannot change own role
   * - Cannot change organization owner's role
   * - Member must belong to same organization
   */
  async updateEmployeeRole(
    orgId: string,
    currentUserId: string,
    currentUserRole: string,
    employeeId: string,
    newRole: string
  ) {
    // 1. Check permissions
    if (!hasPermission(currentUserRole, 'users.edit')) {
      throw new UnauthorizedError("Insufficient permissions");
    }

    // 2. Validate role
    const roleValidation = employeeUpdateRoleSchema.safeParse({ role: newRole });
    if (!roleValidation.success) {
      throw new ValidationError("Invalid role");
    }

    // 3. Prevent changing own role
    if (employeeId === currentUserId) {
      throw new BusinessError("Cannot change your own role");
    }

    // 4. Get organization to check owner
    const org = await this.organizationRepository.findById(orgId);
    if (!org) {
      throw new BusinessError("Active organization not found");
    }

    // 5. Check if target member is owner of the org
    if (org.ownerId === employeeId) {
      throw new BusinessError("Cannot change role of the Organization Owner");
    }

    // 6. Verify target member belongs to same org
    const targetMember = await this.userRepository.findById(employeeId);
    if (!targetMember || (targetMember.organizationId !== orgId && targetMember.id !== org.ownerId)) {
      throw new BusinessError("Member does not belong to your organization");
    }

    // 7. Update role
    const updated = await this.userRepository.updateRole(employeeId, newRole);
    if (!updated) {
      throw new NotFoundError("Member");
    }
  }

  /**
   * Remove employee from organization
   */
  async removeEmployee(orgId: string, employeeId: string) {
    // Implementation needed in repository or here
    // For now, just set organizationId to null and role to viewer?
    const org = await this.organizationRepository.findById(orgId);
    if (org?.ownerId === employeeId) {
      throw new BusinessError("Cannot remove the Organization Owner");
    }

    await this.userRepository.updateRoleAndOrganization(employeeId, 'viewer', null as any);
    await this.organizationRepository.decrementMemberCount(orgId);
  }

  async inviteEmployee(orgId: string, data: any) {
    const { email, role, name, password } = data;

    // 1. Check if user already exists
    let user = await this.userRepository.findByEmail(email);

    if (user) {
      // 2. If user exists, check if already in this org
      const existingMember = await this.memberRepository.findByUserAndOrg(user.id, orgId);
      if (existingMember) {
        throw new BusinessError("User is already a member of this organization");
      }

      // 3. Update user's org if not set (or they are switching?)
      // For now, just add them as a member
    } else {
      // 4. Create new user
      const userId = crypto.randomUUID();
      user = await this.userRepository.create({
        id: userId,
        email,
        name,
        role: role as any,
        organizationId: orgId,
      });

      // Note: In a production app, we would also create an entry in 'accounts' 
      // table with a hashed password so they can log in.
      // Better-auth handles this via its own internal APIs but for this task 
      // we are implementing the business logic link.
    }

    // 5. Add to Members table
    await this.memberRepository.create({
      id: crypto.randomUUID(),
      userId: user.id,
      organizationId: orgId,
      role: role as any,
    });

    // 6. Increment member count
    await this.organizationRepository.incrementMemberCount(orgId);
  }

  private async isOrgOwner(orgId: string, userId: string): Promise<boolean> {
    const org = await this.organizationRepository.findById(orgId);
    return org?.ownerId === userId;
  }
}

