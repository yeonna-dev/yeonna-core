import { withUser } from '../../../common/providers';
import { Identifiers } from '../../../common/types';
import { UserBitService } from '../services/UserBitService';

type FindUserBitsParameters = Identifiers &
{
  search?: string;
};

export const findUserBits = async ({
  search,
  ...identifiers
}: FindUserBitsParameters) => withUser(identifiers)(
  async (userId) => UserBitService.find({ userIds: [userId], search }),
);
