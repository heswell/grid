const FORMATTERS = {
  datetime: Intl.DateTimeFormat("en-us"),
  date: Intl.DateTimeFormat("en-us"),
  integer: Intl.NumberFormat("en-us"),
  float: new Intl.NumberFormat("en-us", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
  }),
};

const TEMPLATE = document.createElement("template");

export default class PerspectiveDataModel {
  _tree_header_levels(path, is_open, is_leaf) {
      const tree_levels = path.map(() => '<span class="pd-tree-group"></span>');
      if (!is_leaf) {
          const group_icon = is_open ? "remove" : "add";
          const tree_button = `<span class="pd-row-header-icon">${group_icon}</span>`;
          tree_levels.push(tree_button);
      }

      return tree_levels.join("");
  }

  _tree_header(path, is_leaf, is_open) {
      const name = path.length === 0 ? "TOTAL" : path[path.length - 1];
      const header_classes = is_leaf ? "pd-group-name pd-group-leaf" : "pd-group-name";
      const tree_levels = this._tree_header_levels(path, is_open, is_leaf);
      const header_text = name;
      TEMPLATE.innerHTML = `<span class="pd-tree-container">${tree_levels}<span class="${header_classes}">${header_text}</span></span>`;
      return TEMPLATE.content.firstChild;
  }

  _format(parts, val) {
      if (val === null) {
          return "-";
      }
      const type = this._schema[parts[parts.length - 1]] || "string";
      return FORMATTERS[type]?.format(val) || val;
  }

  async getData(x0, y0, x1, y1) {
      let columns = {};
      if (x1 - x0 > 0 && y1 - y0 > 0) {
          columns = await this.view.to_columns({
              start_row: y0,
              start_col: x0,
              end_row: y1,
              end_col: x1,
              id: this._config.row_pivots.length > 0,
          });
      }

      const data = [];
      const column_headers = [];
      for (const path of this._column_paths.slice(x0, x1)) {
          const path_parts = path.split("|");
          data.push(columns[path].map((x) => this._format(path_parts, x)));
          column_headers.push(path_parts);
      }

      return {
          num_rows: this._num_rows,
          num_columns: this._column_paths.length,
          row_headers: (columns.__ROW_PATH__ || []).map((x) => [this._tree_header(x, x.length === 3, true)]),
          column_headers,
          data,
      };
  }

  applyStyle({detail: regularTable}) {
      for (const td of regularTable.querySelectorAll("td, thead tr:last-child th")) {
          const metadata = regularTable.getMeta(td);
          let type;
          if (metadata.x >= 0) {
              const column_path = this._column_paths[metadata.x];
              const column_path_parts = column_path.split("|");
              type = this._schema[column_path_parts[column_path_parts.length - 1]];
          } else {
              type = "string";
          }
          if (type === "integer" || type === "float") {
              td.classList.toggle("pd-align-right", true);
              td.classList.toggle("pd-align-left", false);
              if (parseFloat(metadata.value) > 0) {
                  td.classList.add("pd-positive");
                  td.classList.toggle("pd-negative", false);
              } else if (parseFloat(metadata.value) < 0) {
                  td.classList.add("pd-negative");
                  td.classList.toggle("pd-positive", false);
              }
          } else {
              td.classList.toggle("pd-positive", false);
              td.classList.toggle("pd-negative", false);
              td.classList.toggle("pd-align-right", false);
              td.classList.toggle("pd-align-left", true);
          }
      }
  }

  async set_view(table, view) {
      this.view = view;
      this.table_schema = await table.schema();
      this._config = await view.get_config();
      this._num_rows = await view.num_rows();
      this._schema = await view.schema();
      this._column_paths = await view.column_paths();
      this._column_paths = this._column_paths.filter((path) => {
          return path !== "__ROW_PATH__" && path !== "__ID__";
      });
  }
}