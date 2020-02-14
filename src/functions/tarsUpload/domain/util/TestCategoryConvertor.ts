import { CategoryCode } from '@dvsa/mes-test-schema/categories/common';

export const convertDl25TestCategory = (category: CategoryCode): string => {
  if (category.indexOf('EU') === 0) {
    return category.substring(2);
  }

  return category;
};
