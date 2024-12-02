import React from "react";
import {provideComponent, isInPlaceEditingActive} from "scrivito";
import "./TableWidget.scss";

provideComponent("TableWidget", ({ widget }) => {
  const [header, ...body] = JSON.parse(widget.get("tableContent") || '[]');

  const addRow = (position) => {
    const columnCount = header.length;
    const newRow = Array(columnCount).fill("");
    body.splice(position, 0, newRow);
  };

  const addColumn = (position) => {
    return body.map(row => {
      row.splice(position, 0, "");
      return row;
    });
  };

  const storeTable = () => {
    isInPlaceEditingActive() && widget.update({ tableContent: [header, ...body] });
  }

  const AddButton = (cb) => (
    isInPlaceEditingActive() && (
      <button
        className="table-widget-addButton"
        onClick={cb}
      >
        +
      </button>
    )
  );

  const TableHeader = () => (
    <thead><tr>
      {header.map((cell, index) => (
        <th
          contenteditable={isInPlaceEditingActive()}
          key={index}
          onChange={(event) => {
            event.preventDefault();
            event.stopPropagation();
            if (isInPlaceEditingActive()) {
              storeTable();
            }
          }}
        >
          <AddButton cb={addColumn(index)} />
          {cell}
        </th>
      ))}
    </tr></thead>
  )

  const TableRow = ({row}) => (
    <tr>
      <AddButton cb={addRow(index)} />
      {row.map((cell, index) => (
        <td
          contenteditable={isInPlaceEditingActive()}
          key={index}
          onChange={(event) => {
            event.preventDefault();
            event.stopPropagation();
            if (isInPlaceEditingActive()) {
              storeTable();
            }
          }}
        >
          {cell}
        </td>
      ))}
    </tr>
  )

  const TableBody = () => (
    <tbody>
      {body.map((row, index) => <TableRow key={index} row={row} />)}
    </tbody>
  )

  const Table = () => (
    <table className="table-widget table">
      <TableHeader />
      <TableBody />
    </table>
  )

  return (
    <Table />
  );
});
