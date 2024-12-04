import React, {useCallback, useRef} from "react";
import {provideComponent, isInPlaceEditingActive, connect} from "scrivito";

import debounce from "lodash.debounce";

import { CellContent } from "./CellContent";
import "./TableWidget.scss";

provideComponent("ScrivitoTableWidget", connect(({ widget }) => {
  const content = widget.get("tableContent");
  const isSaving = useRef(false);

  if (!content) {
    return <button
      className="btn btn-primary"
      onClick={() => {
        widget.update({ tableContent: JSON.stringify([
          [{content: "Header 1"}, {content: "Header 2"}, {content: "Header 3"}],
          [{content: "Content 1"}, {content: "Content 2"}, {content: "Content 3"}],
          [{content: "Content 4"}, {content: "Content 5"}, {content: "Content 6"}],
        ])});
      }}
    >
      Create new table
    </button>
  }

  const [header, ...body] = JSON.parse(content);

  const addRow = (position) => {
    const columnCount = header.length;
    const newRow = Array(columnCount).fill({ content: "New Content" });
    const newBody = [...body.slice(0, position), newRow, ...body.slice(position)];
    widget.update({ tableContent: JSON.stringify([header, ...newBody]) });
  };

  const addColumn = (position) => {
    const newBody = body.map((row) => {
      const newRow = [...row.slice(0, position), { content: "New Content" }, ...row.slice(position)];
      return newRow;
    });
    const newHeader = [...header.slice(0, position), { content: "New Header" }, ...header.slice(position)]
    widget.update({ tableContent: JSON.stringify([newHeader, ...newBody]) });
  };

  const storeTable = useCallback(debounce(async () => {
    if (isSaving.current) {return;}

    try {
      isSaving.current = true;
      await widget.obj().finishSaving();
      widget.update({ tableContent: JSON.stringify([header, ...body]) });
    } catch (error) {
      console.error("Error in onChange handler:", error);
    } finally {
      isSaving.current = false;
    }
  }, 200));

  const AddButton = ({cb, last}) => (
    isInPlaceEditingActive() && (
      <button
        className={`table-widget-addButton ${last ? "__last" : "__default"}`}
        onClick={() => cb()}
      >
        +
      </button>
    )
  );

  const TableHeader = ({row}) => (
    <thead><tr>
      {row.map((cell, index) => (
        <th key={index}>
          <AddButton cb={() => addColumn(index)} />
          <CellContent
            cell={cell}
            cb={(value) => {
              header[index].content = value;
              storeTable();
            }}
          />
          {index === row.length - 1 && <AddButton last={true} cb={() => addColumn(index + 1)} />}
        </th>
      ))}
    </tr></thead>
  )

  const TableRow = ({row, rowIndex}) => {
    return (
      <tr>
        {row.map((cell, index) => (
          <td key={index}>
            {index === 0 && <AddButton cb={() => addRow(rowIndex)} />}
            <CellContent
              cell={cell}
              cb={(value) => {
                body[rowIndex][index].content = value;
                storeTable();
              }}
            />
            {index === 0 && rowIndex === body.length - 1 &&  <AddButton last={true} cb={() => addRow(rowIndex + 1)} />}
          </td>
        ))}
      </tr>
    )
  }

  const TableBody = () => (
    body.map((row, index) => <TableRow key={index} row={row} rowIndex={index} />)
  )

  const cssClasses = ["table-widget", "table"];
  cssClasses.push(`table-${widget.get("variant") || "default"}`);

  if (widget.get("striped")) {
    cssClasses.push("table-striped");
  }

  if (widget.get("bordered")) {
    cssClasses.push("table-bordered");
  }

  const Table = () => (
    <table className={cssClasses.join(" ")}>
      <TableHeader row={header} />
      <tbody><TableBody /></tbody>
    </table>
  )

  return (
    <Table />
  );
}));
