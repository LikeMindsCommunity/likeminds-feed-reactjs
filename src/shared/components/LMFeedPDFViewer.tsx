import React, { useState } from "react";
import { Document, Page } from "react-pdf";

interface PDFViewerProps {
  pdfUrl: string;
}
const LMFeedPDFViewer: React.FC<PDFViewerProps> = ({ pdfUrl }) => {
  const [numPages, setNumPages] = useState<number | null>(null);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  return (
    <div>
      <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
        <Page pageNumber={1} />
      </Document>
      <p>Number of Pages: {numPages}</p>
    </div>
  );
};

export default LMFeedPDFViewer;
