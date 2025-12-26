import { Injectable } from '@angular/core';

export interface AttachmentData {
    type: 'image' | 'file';
    url?: string; // For URL-based attachments (as per API docs)
    data?: string; // For base64 data (alternative approach)
    filename?: string;
    size?: number;
    mimeType?: string;
}

// Specific interface for base64 attachments
export interface Base64AttachmentData extends AttachmentData {
    data: string; // Required for base64 attachments
    filename: string;
    size: number;
    mimeType: string;
}

@Injectable({
    providedIn: 'root'
})
export class FileUploadService {

    constructor() { }

    /**
     * Convert file to base64 for API transmission
     */
    convertFileToBase64(file: File): Promise<Base64AttachmentData> {
        console.log('Converting file to base64:', file.name, file.type, file.size);

        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = () => {
                const base64String = reader.result as string;
                // Remove the data:image/jpeg;base64, prefix
                const base64Data = base64String.split(',')[1];

                const attachment: Base64AttachmentData = {
                    type: file.type.startsWith('image/') ? 'image' : 'file',
                    data: base64Data,
                    filename: file.name,
                    size: file.size,
                    mimeType: file.type
                };

                console.log('File converted successfully:', {
                    filename: attachment.filename,
                    type: attachment.type,
                    size: attachment.size,
                    mimeType: attachment.mimeType,
                    dataLength: attachment.data.length
                });

                resolve(attachment);
            };

            reader.onerror = () => {
                console.error('File reader error:', reader.error);
                reject(reader.error);
            };

            reader.readAsDataURL(file);
        });
    }

    /**
     * Convert multiple files to base64
     */
    async convertMultipleFiles(files: File[]): Promise<Base64AttachmentData[]> {
        const promises = files.map(file => this.convertFileToBase64(file));
        return Promise.all(promises);
    }

    /**
     * Validate file before processing
     */
    validateFile(file: File): { valid: boolean; error?: string } {
        const maxSize = 10 * 1024 * 1024; // 10MB
        const allowedTypes = [
            'image/jpeg', 'image/png', 'image/gif', 'image/webp',
            'application/pdf', 'text/plain', 'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];

        if (file.size > maxSize) {
            return { valid: false, error: 'File size must be less than 10MB' };
        }

        if (!allowedTypes.includes(file.type)) {
            return { valid: false, error: 'File type not supported. Allowed: Images, PDF, TXT, DOC, DOCX' };
        }

        return { valid: true };
    }

    /**
     * Get file preview URL for display
     */
    getFilePreviewUrl(file: File): Promise<string> {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
        });
    }

    /**
     * Create attachment in API documentation format (with URL)
     */
    createUrlAttachment(file: File, url: string): AttachmentData {
        return {
            type: file.type.startsWith('image/') ? 'image' : 'file',
            url: url
        };
    }

    /**
     * Format file size for display
     */
    formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}