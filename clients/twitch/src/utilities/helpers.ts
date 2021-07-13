import fs from 'fs';

/*
  Scans the given directory and dynamically imports all the modules.
  The export of each module with the same name as the module's script's
  filename is added to an array which is returned.
*/
export async function loadNamedModules(directory: string)
{
  const files = fs.readdirSync(directory);
  const index = files.findIndex(file => file.startsWith('index'));
  if(index !== -1)
    files.splice(index, 1);

  const modules = [];
  for(const file of files)
  {
    const _module = await import(`${directory}/${file}`);
    modules.push(_module[file.substr(0, file.lastIndexOf('.'))]);
  }

  return modules;
};
