export interface IEmployeeService {
    getEmployees(orgId: string): Promise<any[]>;
    getEmployee(orgId: string, employeeId: string): Promise<any>;
    updateEmployeeRole(orgId: string, currentUserId: string, currentUserRole: string, employeeId: string, role: string): Promise<void>;
    removeEmployee(orgId: string, employeeId: string): Promise<void>;
    inviteEmployee(orgId: string, data: any): Promise<void>;
}
