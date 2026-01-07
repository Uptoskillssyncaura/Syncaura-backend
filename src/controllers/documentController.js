import Document from "../models/Document.js";
import { createPDF } from "../utils/exportUtils.js";
import ExcelJS from "exceljs";
/**
 * CREATE DOCUMENT
 */
export const createDocument = async (req, res) => {
  try {
    const { title, content, projectId } = req.body;

    const doc = await Document.create({
      title,
      content,
      projectId,
      createdBy: req.user.id,
    });

    res.status(201).json({ message: "Document created", document: doc });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET SINGLE DOCUMENT
 */
export const getDocumentById = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);

    if (!doc) return res.status(404).json({ message: "Document not found" });

    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET ALL DOCUMENTS (optional)
 */
export const getAllDocuments = async (req, res) => {
  try {
    const docs = await Document.find();
    res.json(docs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * UPDATE DOCUMENT (with version control)
 */
export const updateDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Document not found" });

    // Save current content to versions array
    doc.versions.push({
      content: doc.content,
      editedBy: req.user.id,
      editedAt: new Date(),
    });

    // Update with new content
    doc.title = req.body.title || doc.title;
    doc.content = req.body.content || doc.content;

    await doc.save();
    res.json({ message: "Document updated", document: doc });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * DELETE DOCUMENT
 */
export const deleteDocument = async (req, res) => {
  try {
    const doc = await Document.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ message: "Document not found" });

    res.json({ message: "Document deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET DOCUMENT VERSIONS
 */
export const getDocumentVersions = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Document not found" });

    res.json(doc.versions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const exportDocumentPDF = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await Document.findById(id);

    if (!doc) return res.status(404).json({ message: "Document not found" });

    const pdfData = await createPDF(doc);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=${doc.title}.pdf`);
    res.send(pdfData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Export document as Excel
export const exportDocumentExcel = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Document");

    sheet.columns = [
      { header: "Title", key: "title", width: 30 },
      { header: "Content", key: "content", width: 50 },
      { header: "Project ID", key: "projectId", width: 30 },
      { header: "Created At", key: "createdAt", width: 25 },
    ];

    sheet.addRow({
      title: doc.title,
      content: doc.content,
      projectId: String(doc.projectId),
      createdAt: doc.createdAt.toISOString(),
    });

    // ✅ CREATE BUFFER (IMPORTANT)
    const buffer = await workbook.xlsx.writeBuffer();

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="document.xlsx"'
    );
    res.setHeader("Content-Length", buffer.length);

    res.end(buffer);
    return;
  } catch (error) {
    console.error("Excel export error:", error);
    res.status(500).json({ message: error.message });
  }
};

