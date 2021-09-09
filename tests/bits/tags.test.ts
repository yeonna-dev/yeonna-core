import 'mocha';
import assert from 'assert';

import { createTags, deleteTags } from '../../src';

describe('Tags', () =>
{
  const tagNames = [ 'Fox', 'Dog', 'Cat', 'Rabbit' ];
  it('should create tags', async () =>
  {
    const createdTags = await createTags(tagNames);
    assert.strictEqual(createdTags.every(tag => tag.id && tag.name), true);
  });

  it('should delete tags', async () =>
  {
    const deletedTags = await deleteTags(tagNames);
    assert.strictEqual(deletedTags.every(tag => tag.id && tag.name), true);
  });
});
