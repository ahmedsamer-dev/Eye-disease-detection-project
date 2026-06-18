import axiosClient from '../axiosConfig';
import { DiagnosisReportDto, ReportsResponseDto } from '../types/report';
// @ts-ignore
import html2pdf from 'html2pdf.js';

const reportService = {
  getAll: async (): Promise<ReportsResponseDto> => {
    const response = await axiosClient.get<ReportsResponseDto>('/Reports');
    return response.data;
  },

  getById: async (id: number): Promise<DiagnosisReportDto> => {
    const response = await axiosClient.get<DiagnosisReportDto>(`/Reports/${id}`);
    return response.data;
  },

  save: async (id: number): Promise<{ message: string }> => {
    const response = await axiosClient.post(`/Reports/${id}/save`);
    return response.data;
  },

  downloadPdf: async (id: number): Promise<void> => {
    // 1. Fetch the complete report details
    const report = await reportService.getById(id);

    // 2. Create a temporary DOM container and render the printable styled document
    const element = document.createElement('div');
    element.innerHTML = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 45px; color: #1e3d64; max-width: 800px; margin: auto; background-color: #ffffff;">
        
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #2D598F; padding-bottom: 20px; margin-bottom: 30px;">
          <div>
            <h1 style="margin: 0; font-size: 26px; color: #2D598F; font-weight: 700; letter-spacing: 0.5px;">EyeDiseaseAI</h1>
            <p style="margin: 5px 0 0 0; font-size: 13px; color: #666; font-style: italic;">AI-Powered Eye Disease Detection & Diagnosis Platform</p>
          </div>
          <div style="text-align: right;">
            <div style="background-color: #2D598F; color: #ffffff; padding: 6px 12px; border-radius: 6px; font-weight: bold; font-size: 13px; display: inline-block;">
              Medical Report: #${report.id}
            </div>
            <p style="margin: 8px 0 0 0; font-size: 11px; color: #777;">Date: ${new Date(report.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
          </div>
        </div>

        <!-- Scan Info Section -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; background-color: #f4f7fa; padding: 22px; border-radius: 12px; border: 1px solid #e1e8ed;">
          <div>
            <p style="margin: 0 0 6px 0; font-size: 11px; text-transform: uppercase; color: #888; font-weight: 600; letter-spacing: 0.5px;">Diagnostic Condition</p>
            <p style="margin: 0; font-weight: 700; font-size: 18px; color: #2D598F;">${report.condition}</p>
          </div>
          <div>
            <p style="margin: 0 0 6px 0; font-size: 11px; text-transform: uppercase; color: #888; font-weight: 600; letter-spacing: 0.5px;">AI Confidence Level</p>
            <p style="margin: 0; font-weight: 700; font-size: 18px; color: #10b981;">${report.confidence}%</p>
          </div>
          <div>
            <p style="margin: 0 0 6px 0; font-size: 11px; text-transform: uppercase; color: #888; font-weight: 600; letter-spacing: 0.5px;">Severity Index</p>
            <span style="display: inline-block; background-color: rgba(239, 68, 68, 0.08); border: 1px solid rgba(239, 68, 68, 0.2); color: #ef4444; padding: 4px 8px; border-radius: 4px; font-weight: 600; font-size: 12px; margin-top: 2px;">
              ${report.severity}
            </span>
          </div>
          <div>
            <p style="margin: 0 0 6px 0; font-size: 11px; text-transform: uppercase; color: #888; font-weight: 600; letter-spacing: 0.5px;">Physiological Estimates</p>
            <p style="margin: 2px 0 0 0; font-size: 13px; color: #333; font-weight: 500;">
              <strong>IOP:</strong> ${report.iopEstimate || 'Normal'} <br/>
              <strong>Cup-to-Disc Ratio:</strong> ${report.retinalCupDiscRatio || 'Normal'}
            </p>
          </div>
        </div>

        <!-- Clinical Summary -->
        <div style="margin-bottom: 35px; background-color: #ffffff; border-left: 4px solid #2D598F; padding-left: 15px;">
          <h3 style="margin: 0 0 8px 0; color: #2D598F; font-size: 15px; font-weight: 700; text-transform: uppercase;">Clinical Summary</h3>
          <p style="line-height: 1.6; color: #444; font-size: 13.5px; margin: 0; text-align: justify;">${report.summary}</p>
        </div>

        <!-- AI Medical Recommendations -->
        <div style="margin-bottom: 40px;">
          <h3 style="border-bottom: 1.5px solid #2D598F; padding-bottom: 6px; margin: 0 0 15px 0; color: #2D598F; font-size: 15px; font-weight: 700; text-transform: uppercase;">AI Medical Recommendations</h3>
          <ul style="padding-left: 20px; margin: 0; line-height: 1.8; color: #444; font-size: 13.5px;">
            ${report.recommendations.map(r => `<li style="margin-bottom: 10px;">${r.text}</li>`).join('')}
          </ul>
        </div>

        <!-- Signature Space & Disclaimer -->
        <div style="margin-top: 70px; display: flex; justify-content: space-between; align-items: flex-end;">
          <div style="font-size: 11px; color: #999; max-width: 60%;">
            <p style="margin: 0; font-weight: bold; color: #666;">Disclaimer:</p>
            <p style="margin: 4px 0 0 0; line-height: 1.4;">This automated evaluation is based on deep learning model analysis of fundus images. It serves as clinical decision support. Final diagnostic and therapeutic decisions must be made by a qualified ophthalmologist.</p>
          </div>
          <div style="text-align: center; width: 180px; border-top: 1px dashed #ccc; padding-top: 8px;">
            <p style="margin: 0; font-size: 12px; color: #555; font-weight: bold;">Attending Ophthalmologist</p>
            <p style="margin: 15px 0 0 0; font-size: 11px; color: #888;">Signature / Stamp</p>
          </div>
        </div>
        
      </div>
    `;

    // 4. Configure html2pdf option settings
    const opt = {
      margin:       12,
      filename:     `report_${id}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, logging: false },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // 5. Generate PDF binary and trigger local browser download save dialog
    await html2pdf().set(opt).from(element).save();
  },

  delete: async (id: number): Promise<{ message: string }> => {
    const response = await axiosClient.delete<{ message: string }>(`/Reports/${id}`);
    return response.data;
  }
};

export default reportService;
