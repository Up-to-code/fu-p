import { z } from "zod";

/**
 * Order Validation Schemas
 */
export const orderStatusSchema = z.enum([
  'received',
  'confirmed',
  'rejected',
  'preparing',
  'ready',
  'picked_up',
  'in_transit',
  'out_for_delivery',
  'delivered',
  'completed',
  'cancelled',
  'delayed',
  'failed',
  'return_requested',
  'refunded'
]);

export const orderUpdateStatusSchema = z.object({
  status: orderStatusSchema,
  notes: z.string().optional(),
});

export type OrderStatus = z.infer<typeof orderStatusSchema>;
export type OrderUpdateStatusInput = z.infer<typeof orderUpdateStatusSchema>;
