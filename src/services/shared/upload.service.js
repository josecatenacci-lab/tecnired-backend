import fs from 'fs';
import path from 'path';

// =========================
// UPLOAD SERVICE (LOCAL STORAGE - MVP)
// =========================

const UPLOAD_DIR = path.resolve('uploads');

// 🔥 asegurar carpeta
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export const uploadService = {
  // =========================
  // GUARDAR ARCHIVO
  // =========================
  async saveFile(file) {
    try {
      if (!file || !file.buffer) {
        throw new Error('Archivo inválido');
      }

      const fileName = `${Date.now()}-${file.originalname}`;
      const filePath = path.join(UPLOAD_DIR, fileName);

      await fs.promises.writeFile(filePath, file.buffer);

      return {
        fileName,
        url: `/uploads/${fileName}`,
      };
    } catch (error) {
      console.error('upload.saveFile error:', error.message);
      return null;
    }
  },

  // =========================
  // ELIMINAR ARCHIVO
  // =========================
  async deleteFile(fileName) {
    try {
      const filePath = path.join(UPLOAD_DIR, fileName);

      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
      }

      return true;
    } catch (error) {
      console.error('upload.deleteFile error:', error.message);
      return false;
    }
  },
};