export function buildMenuDescriptors(location, options){
  const menuItems = [];
  if (location === 'header') {
      const {model={}, column: {name: colName, sorted, isGroup}} = options;
      const {groupBy, sortBy:sortCriteria} = model;
      if (!sorted) {
          menuItems.push(
              {label: 'Sort', action: 'sort-asc', options, children: [
                  {label: 'ASC', action: 'sort-asc', options},
                  {label: 'DSC', action: 'sort-dsc', options}
              ]}
          );
          if (sortCriteria && sortCriteria.length){
              menuItems.push(
              {label: 'Add to sort', action: 'sort-add-asc', options, children: [
                  {label: 'ASC', action: 'sort-add-asc', options},
                  {label: 'DSC', action: 'sort-add-dsc', options}
              ]})
          }
      } else {    
          if (sortCriteria && sortCriteria.length > 1){
              menuItems.push(
                  {label: 'Remove from sort', action: 'sort-remove', options}
              );
          }
          if (sorted === 1) {
              menuItems.push({label: 'Sort (DESC)', action: 'sort-dsc', options});
          } else {
              menuItems.push({label: 'Sort (ASC)', action: 'sort-asc', options});
          }
      }

      if (groupBy && groupBy.length) {
          if (!isGroup){
              menuItems.push({label: `Add ${colName} to Group`, action: 'groupby', options});
          }
      } else {
          menuItems.push({label: `Group by ${colName}`, action: 'groupby', options});
      }
  }

  return menuItems;

}

