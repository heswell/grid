
let size;

export function getScrollbarSize() {
    if (size === undefined) {

        let outer = document.createElement('div');
        outer.className = 'scrollable-content';
        outer.style.width = '50px';
        outer.style.height = '50px';
        outer.style.overflowY = 'scroll';
        outer.style.position = 'absolute';
        outer.style.top = '-200px';
        outer.style.left = '-200px';
        const inner = document.createElement('div');
        inner.style.height = '100px';
        inner.style.width = '100%';
        outer.appendChild(inner);
        document.body.appendChild(outer);
        const outerWidth = outer.offsetWidth;
        const innerWidth = inner.offsetWidth;
        document.body.removeChild(outer);
        size = outerWidth - innerWidth;
        outer = null;
    }

    return size;
}

// THis needs to be customisable
export function getColumnWidth(columns, {Grid, GroupHeaderCell, HeaderCell}) {
  let outer = document.createElement('div');
  outer.className = `${Grid}`;
  outer.innerHTML = 
    `<div class="${HeaderCell} ${GroupHeaderCell}" style="padding-left: 0px; width: auto;">
       <div class="inner-container">
       ${columns.map(column => 
        `<div class="ColHeader">
          <i class="material-icons toggle-icon">chevron_right</i>
          <span class="ColHeaderLabel">${column.name}</span>
          <i class="material-icons remove-icon">cancel</i>
        </div>`
       )}
       </div>
      <div class="resizeHandle-0-3-20">
      </div>
    </div>`
  
  document.body.appendChild(outer);
  const w = outer.offsetWidth;
  document.body.removeChild(outer);
  outer = null;
  // return w + 50 + (columns.length-1) * 50;
  return w + (columns.length == 1 ? 4 : (columns.length * -3));
}
