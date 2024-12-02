import * as Scrivito from "scrivito";

const TableWidget = Scrivito.provideWidgetClass("TableWidget", {
  attributes: {
    tableContent: "string",
  },
});

export default TableWidget;
