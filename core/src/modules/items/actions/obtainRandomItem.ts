import { ItemsService } from '../services/ItemsService';

export async function obtainRandomItem({

})
{
  const chance = Math.random() * 100;
  const items = await ItemsService.find({ chance });
  const randomItem = items[Math.floor(Math.random() * items.length)];

}
