import { CollectionsService } from '../services/CollectionsService';

export const getUserCollections = async (userId: string, context?: string) =>
  CollectionsService.getCollections({ userId, context });
