import React, { useState } from "react";
import { Document, Page } from "react-pdf";

interface PdfThumbnailProps {
  pdfUrl: string;
}

function PdfThumbnail({ pdfUrl }: PdfThumbnailProps) {
  const [numPages, setNumPages] = useState<number | null>(null);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  return (
    <div>
      <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
        <Page pageNumber={1} width={200} />
      </Document>
      <p>Number of pages: {numPages}</p>
    </div>
  );
}

export default PdfThumbnail;
