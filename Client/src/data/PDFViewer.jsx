import React from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";


const PDFviewer = ({ pdfUrl }) => {
  return (
    <div className="w-full h-[720px] hide-scrollbar p-1 bg-black rounded-[7px]">
      <iframe src={pdfUrl} className="h-full w-full" frameborder="0"></iframe>
    </div>
  );
};

export default PDFviewer;
