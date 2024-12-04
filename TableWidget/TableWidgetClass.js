import * as Scrivito from "scrivito";

const TableWidget = Scrivito.provideWidgetClass("ScrivitoTableWidget", {
  attributes: {
    tableContent: "string",
    variant: ["enum", { values: ["default", "primary", "secondary", "success", "danger", "warning", "light", "dark"] }],
    striped: "boolean",
    bordered: "boolean",
  },
});

export default TableWidget;
