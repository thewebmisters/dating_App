import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ReportPayload {
    chat_id: number;
    message_id?: number;
    reason: 'spam' | 'harassment' | 'inappropriate_content' | 'fake_profile' | 'other';
    description: string;
}

export interface Report {
    id: number;
    reporter_id: number;
    chat_id: number;
    message_id?: number;
    reason: string;
    description: string;
    status: 'pending' | 'under_review' | 'resolved' | 'dismissed';
    admin_notes?: string;
    created_at: string;
    updated_at?: string;
    reporter?: {
        id: number;
        name: string;
    };
}

export interface ReportsResponse {
    message: string;
    data: {
        data: Report[];
        total: number;
    };
}

export interface ReportStatsResponse {
    message: string;
    data: {
        total_reports: number;
        pending: number;
        under_review: number;
        resolved: number;
        dismissed: number;
        by_reason: {
            spam: number;
            harassment: number;
            inappropriate_content: number;
            fake_profile: number;
            other: number;
        };
    };
}

@Injectable({
    providedIn: 'root'
})
export class ReportsService {
    private baseUrl = environment.baseUrl;

    constructor(private http: HttpClient) { }

    /**
     * 10.1 Create Report - Report inappropriate chat or message
     */
    createReport(payload: ReportPayload): Observable<{ message: string; data: Report }> {
        const fullUrl = `${this.baseUrl}/reports`;
        return this.http.post<{ message: string; data: Report }>(fullUrl, payload);
    }

    /**
     * 10.2 Get Pending Reports (Admin Only) - Get all pending reports
     */
    getPendingReports(perPage: number = 20): Observable<ReportsResponse> {
        const fullUrl = `${this.baseUrl}/reports/pending`;
        const params = new HttpParams().set('per_page', perPage.toString());
        return this.http.get<ReportsResponse>(fullUrl, { params });
    }

    /**
     * 10.3 Get My Reports - Get reports created by authenticated user
     */
    getMyReports(): Observable<{ message: string; data: Report[] }> {
        const fullUrl = `${this.baseUrl}/reports/my-reports`;
        return this.http.get<{ message: string; data: Report[] }>(fullUrl);
    }

    /**
     * 10.4 Get User Reports (Admin Only) - Get reports for specific user
     */
    getUserReports(userId: number): Observable<{ message: string; data: Report[] }> {
        const fullUrl = `${this.baseUrl}/reports/user`;
        const params = new HttpParams().set('user_id', userId.toString());
        return this.http.get<{ message: string; data: Report[] }>(fullUrl, { params });
    }

    /**
     * 10.5 Get Report Statistics (Admin Only) - Get report statistics
     */
    getReportStats(): Observable<ReportStatsResponse> {
        const fullUrl = `${this.baseUrl}/reports/stats`;
        return this.http.get<ReportStatsResponse>(fullUrl);
    }

    /**
     * 10.6 Get Reports by Reason (Admin Only) - Get reports grouped by reason
     */
    getReportsByReason(): Observable<{ message: string; data: { [reason: string]: Report[] } }> {
        const fullUrl = `${this.baseUrl}/reports/by-reason`;
        return this.http.get<{ message: string; data: { [reason: string]: Report[] } }>(fullUrl);
    }

    /**
     * 10.7 Get Single Report - Get specific report details
     */
    getReport(id: number): Observable<{ message: string; data: Report }> {
        const fullUrl = `${this.baseUrl}/reports/${id}`;
        return this.http.get<{ message: string; data: Report }>(fullUrl);
    }

    /**
     * 10.8 Update Report Status (Admin Only) - Update report status and add notes
     */
    updateReportStatus(
        id: number,
        payload: {
            status: 'pending' | 'under_review' | 'resolved' | 'dismissed';
            admin_notes?: string;
        }
    ): Observable<{ message: string; data: Report }> {
        const fullUrl = `${this.baseUrl}/reports/${id}`;
        return this.http.put<{ message: string; data: Report }>(fullUrl, payload);
    }

    /**
     * Get available report reasons
     */
    getReportReasons(): string[] {
        return ['spam', 'harassment', 'inappropriate_content', 'fake_profile', 'other'];
    }

    /**
     * Create standardized report payload
     */
    createReportPayload(
        chatId: number,
        reason: string,
        description: string,
        messageId?: number
    ): ReportPayload {
        return {
            chat_id: chatId,
            message_id: messageId,
            reason: reason as any,
            description
        };
    }
}