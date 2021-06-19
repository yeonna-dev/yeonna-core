import assert from 'assert';

export async function assertThrowsAsync(fn: Function, error: string | Error)
{
  let f = () => {};
  try
  {
    await fn();
  } catch(e)
  {
    f = () => {throw e};
  }
  finally
  {
    assert.throws(f, error);
  }
}
