import BackgroundCell from '../cell-renderers/background-cell';
import CheckboxCell from '../cell-renderers/checkbox-cell';

// TODO use COntext provided registry here
export default function useCellComponent(column){
  if (column.type && column.type.renderer && column.type.renderer.name === 'background'){
    return BackgroundCell;
  } else if (column.type && column.type.renderer && column.type.renderer.name === 'selection-checkbox'){
    return CheckboxCell;
  }
}
