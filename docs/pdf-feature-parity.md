# PDF capability comparison (2026-09-23)

Reference: [iLovePDF tool directory](https://www.ilovepdf.com/) and [PDF to Word description](https://www.ilovepdf.com/pdf_to_word). This is a functional planning comparison, not a plan to copy the other product's branding or interface.

FileTools remains a browser-only application: selected documents are not sent to our servers. “Available” means the function is implemented and tested, not that every edge case has parity with a commercial conversion engine.

| iLovePDF function | FileTools status | Notes                                                                                                                                                            |
| ----------------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Merge PDF         | Available        | Page-level merge.                                                                                                                                                |
| Split PDF         | Available        | One PDF per page.                                                                                                                                                |
| Remove pages      | Available        | New PDF copy.                                                                                                                                                    |
| Extract pages     | Available        | Selected ranges.                                                                                                                                                 |
| Organize PDF      | Partial          | Reorder pages; no drag-and-drop thumbnails or insertion.                                                                                                         |
| Scan to PDF       | Partial          | Images to PDF; no camera capture workflow.                                                                                                                       |
| Compress PDF      | Not available    | No reliable size reduction for arbitrary PDF without losing content.                                                                                             |
| Repair PDF        | Not available    | Requires a dedicated parser/recovery engine.                                                                                                                     |
| OCR PDF           | Not available    | Requires a local OCR engine and multilingual model files.                                                                                                        |
| JPG to PDF        | Available        | Images to PDF accepts JPG, PNG, WebP.                                                                                                                            |
| Word to PDF       | Partial          | Browser rendering; image-based output and layout limitations.                                                                                                    |
| PowerPoint to PDF | Not available    | Needs a presentation rendering engine.                                                                                                                           |
| Excel to PDF      | Not available    | Needs a spreadsheet rendering engine.                                                                                                                            |
| HTML to PDF       | Not available    | General HTML conversion needs security and page-break controls.                                                                                                  |
| PDF to JPG        | Available        | Page images in ZIP.                                                                                                                                              |
| PDF to Word       | Partial          | Editable text approximates indents, text size and spacing; appearance mode uses page pictures. Neither offers fully editable, exact original formatting. No OCR. |
| PDF to PowerPoint | Not available    | Images to PPTX is a separate function, not PDF to PPTX.                                                                                                          |
| PDF to Excel      | Not available    | Table structure extraction is not implemented.                                                                                                                   |
| PDF to PDF/A      | Not available    | Requires standards validation, embedded fonts and color profile conversion.                                                                                      |
| Rotate PDF        | Available        | Selected pages.                                                                                                                                                  |
| Add page numbers  | Available        | Centered current / total label.                                                                                                                                  |
| Watermark         | Partial          | Text watermark only; basic Latin characters.                                                                                                                     |
| Crop PDF          | Not available    | Hiding content with crop boxes is not secure content removal.                                                                                                    |
| Edit PDF          | Not available    | Full text/object editing is not implemented.                                                                                                                     |
| PDF forms         | Not available    | Interactive form creation/editing is not implemented.                                                                                                            |
| Unlock PDF        | Not available    | Password removal is not implemented.                                                                                                                             |
| Protect PDF       | Not available    | PDF encryption is not implemented.                                                                                                                               |
| Sign PDF          | Not available    | Cryptographic or verified e-signature is not implemented.                                                                                                        |
| Redact PDF        | Not available    | A visual overlay would not remove hidden content and must not be marketed as redaction.                                                                          |
| Compare PDF       | Not available    | No document diff engine.                                                                                                                                         |
| AI summarizer     | Not available    | Would require a model and separate privacy/cost decision.                                                                                                        |
| Translate PDF     | Not available    | Would require translation and layout reconstruction.                                                                                                             |
| PDF to Markdown   | Not available    | Structure extraction is not implemented.                                                                                                                         |

Priority for future browser-only increments: thumbnail-based organization, local OCR with explicit download size and performance limits, PDF comparison, and HTML-to-PDF for sanitized user-authored content. Avoid promising exact Microsoft Office layout fidelity or cryptographic features without a suitable engine and verification.
