import 'mocha';
import assert from 'assert';

import { Core } from '../../src';

describe('Tags', function()
{
  this.timeout(20000);

  const tagNames = ['Fox', 'Dog', 'Cat', 'Rabbit', 'Pig', 'Cow'];
  it('should create tags', async () =>
  {
    const createdTags = await Core.Bits.createTags(tagNames);
    assert.strictEqual(createdTags.every(tag => tag.id && tag.name), true);
  });

  it('should delete tags', async () =>
  {
    const deletedTags = await Core.Bits.deleteTags(tagNames);
    assert.strictEqual(deletedTags.every(tag => tag.id && tag.name), true);
  });
});
