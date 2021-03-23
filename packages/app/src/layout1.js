const layout = {
  "type": "Stack",
  "props": {
    "style": {
      "width": "100%",
      "height": "100%"
    },
    "showTabs": true,
    "enableAddTab": true,
    "preserve": true,
    "type": "Stack",
    "active": 1
  },
  "children": [
    {
      "type": "Flexbox",
      "props": {
        "active": 0,
        "style": {
          "flexBasis": 0,
          "flexGrow": 1,
          "flexShrink": 1,
          "flexDirection": "column"
        }
      },
      "children": [
        {
          "type": "DataGridView",
          "props": {
            "schema": {
              "table": "instruments",
              "columns": [
                {
                  "name": "currency",
                  "label": "ccy",
                  "width": 60
                },
                "description",
                "exchange",
                {
                  "name": "lotSize",
                  "width": 80,
                  "type": {
                    "name": "number"
                  }
                },
                "ric"
              ]
            },
            "resizeable": true,
            "style": {
              "flexBasis": 0,
              "flexGrow": 1,
              "flexShrink": 1,
              "width": "auto",
              "height": "auto"
            }
          },
          "state": {
            "query-filter": {}
          },
          "children": []
        },
        {
          "type": "View",
          "props": {
            "title": "Page 1",
            "style": {
              "flexBasis": 0,
              "flexGrow": 1,
              "flexShrink": 1,
              "width": "auto",
              "height": "auto"
            },
            "type": "View",
            "resizeable": true
          },
          "children": []
        }
      ]
    },
    {
      "type": "Flexbox",
      "props": {
        "active": 0,
        "style": {
          "flexGrow": 1,
          "flexShrink": 0,
          "flexBasis": 0,
          "flexDirection": "column"
        }
      },
      "children": [
        {
          "type": "DataGridView",
          "props": {
            "schema": {
              "table": "instruments",
              "columns": [
                {
                  "name": "currency",
                  "label": "ccy",
                  "width": 60
                },
                "description",
                "exchange",
                {
                  "name": "lotSize",
                  "width": 80,
                  "type": {
                    "name": "number"
                  }
                },
                "ric"
              ]
            },
            "resizeable": true,
            "style": {
              "flexBasis": 0,
              "flexGrow": 1,
              "flexShrink": 1,
              "width": "auto",
              "height": "auto"
            }
          },
          "children": []
        },
        {
          "type": "View",
          "props": {
            "title": "New Page",
            "style": {
              "flexGrow": 1,
              "flexShrink": 1,
              "flexBasis": 0,
              "width": "auto",
              "height": "auto"
            },
            "closeable": true,
            "resizeable": true
          },
          "children": [
            {
              "type": "div",
              "props": {
                "style": {
                  "backgroundColor": "#ccc"
                }
              }
            }
          ]
        }
      ]
    }
  ]
}

export default layout;
