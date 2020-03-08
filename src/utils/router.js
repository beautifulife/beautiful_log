export const validateRoot = (location, rootPath) => {
  if (location.pathname === rootPath) {
    return true;
  }

  const afterBasePath = location.pathname.split('ko')[1];

  if (afterBasePath === '/' || afterBasePath === '') {
    return true;
  }

  return false;
};
