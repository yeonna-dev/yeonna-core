import { InventoriesService } from '../services/InventoriesService';

export const getUserItems = async (userId: string, context?: string) =>
  InventoriesService.getUserItems(userId, context);
