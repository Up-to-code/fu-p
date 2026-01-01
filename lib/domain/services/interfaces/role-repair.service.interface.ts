export interface IRoleRepairService {
    repairUserRole(userId: string): Promise<{ success: boolean; message: string }>;
}
