import { withUser } from '../../../common/providers';
import { Identifiers } from '../../../common/types';
import { UsersBitsService } from '../services/UsersBitsService';

type FindUserBitsParameters = Identifiers &
{
  search?: string;
};

export const findUserBits = async ({
  search,
  ...identifiers
}: FindUserBitsParameters) => withUser(identifiers)(
  async (userId) => UsersBitsService.find({ userIds: [userId], search }),
);
