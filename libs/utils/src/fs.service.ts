import * as path from 'path';

export const getFileNameWithoutExtension = (filePath: string) => {
  const baseName = path.basename(filePath); // Get file name with extension
  return baseName.replace(path.extname(baseName), ''); // Remove extension
};
