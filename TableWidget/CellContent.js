import React, { useCallback, useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.bubble.css";
import { isInPlaceEditingActive, WidgetTag } from "scrivito";

export const CellContent = ({ cell, cb }) => {
  const [content, setContent] = useState(cell.content);

  useEffect(() => {
    cb(content);
  }, [content]);

  const handleChange = useCallback((value) => {
    setContent(value);
  });

  if (!isInPlaceEditingActive()) {
    return <span dangerouslySetInnerHTML={{ __html: cell.content }} />;
  }

  return (
    <ReactQuill
      defaultValue={content}
      onChange={handleChange}
      theme="bubble"
      modules={{
        toolbar: [
          ["bold", "italic", "underline"],
        ],
      }}
    />
  )
};
