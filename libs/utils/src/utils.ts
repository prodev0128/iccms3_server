export const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const filterQueryItemBuilder = (query: any) => {
  if (!query.value) {
    query.value = '';
  }
  switch (query.operator) {
    case 'contains':
      return { [query.field]: { $options: 'i', $regex: query.value } };
    case 'doesNotContain':
      return { [query.field]: { $not: { $options: 'i', $regex: query.value } } };
    case 'equals':
      return { [query.field]: query.value };
    case 'doesNotEqual':
      return { [query.field]: { $ne: query.value } };
    case 'startsWith':
      return { [query.field]: { $options: 'i', $regex: `^${query.value}` } };
    case 'endsWith':
      return { [query.field]: { $options: 'i', $regex: `${query.value}$` } };
    case 'isEmpty':
      return { [query.field]: { $in: [null, ''] } };
    case 'isNotEmpty':
      return { [query.field]: { $nin: [null, ''] } };
    default:
      return {};
  }
};

export const filterQueryBuilder = (queryText: string, quickFilterFields = []) => {
  const queryObject = JSON.parse(queryText);
  const { items = [], logicOperator = 'and', quickFilterLogicOperator = 'and', quickFilterValues = [] } = queryObject;
  const query1 = { [`$${logicOperator}`]: [] };
  const query2 = { $or: [] };

  for (const query of items) {
    query1[`$${logicOperator}`].push(filterQueryItemBuilder(query));
  }

  for (const field of quickFilterFields) {
    const tempQuery = { [`$${quickFilterLogicOperator}`]: [] };
    for (const query of quickFilterValues) {
      tempQuery[`$${quickFilterLogicOperator}`].push({ [field]: { $options: 'i', $regex: query } });
    }
    query2['$or'].push(tempQuery);
  }
  return { $and: [query1, query2] };
};

export const sortQueryBuilder = (queryText: string) => {
  const sortQuery = {};
  const queryObject = JSON.parse(queryText);
  for (const query of queryObject) {
    switch (query.sort) {
      case 'asc':
        sortQuery[query.field] = 1;
        break;
      case 'desc':
        sortQuery[query.field] = -1;
        break;
      default:
        break;
    }
  }
  return sortQuery;
};
