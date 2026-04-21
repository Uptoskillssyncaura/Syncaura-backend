import axios from "axios";

const canvaClient = axios.create({
  baseURL: process.env.CANVA_API_BASE,
  headers: {
    Authorization: `Bearer ${process.env.CANVA_ACCESS_TOKEN}`,
    "Content-Type": "application/json",
    },
});

// Create Export Job
export const exportTemplate = async (templateId, format) => {
  const res = await canvaClient.post(`/exports`, {
    design_id: templateId,
    format: { type: format.toLowerCase() }
  });

  return res.data.job; // RETURN JOB
};

// Check Job Status
export const checkExportStatus = async (jobId) => {
  const res = await canvaClient.get(`/exports/${jobId}`);
  return res.data.job;
};