import * as Scrivito from "scrivito";
import tableWidgetIcon from  "./table_widget.svg";

Scrivito.provideEditingConfig("ScrivitoTableWidget", {
  title: "Table",
  thumbnail: tableWidgetIcon,
  properties: ["tableContent", "variant", "striped", "bordered"],
});
