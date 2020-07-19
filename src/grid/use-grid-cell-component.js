import BackgroundCell from '../cell-renderers/background-cell';

export default function useCellComponent(column){
  if (column.type && column.type.renderer && column.type.renderer.name === 'background'){
    return BackgroundCell;
  }
}
