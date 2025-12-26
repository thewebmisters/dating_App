import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface TokenPackage {
    id: number;
    name: string;
    price: string;
    tokens: number;
    description: string;
    is_active: boolean;
    sort_order: number;
    price_per_token: number;
}

export interface PurchasePayload {
    token_package_id: number;
    payment_method: string;
    payment_reference: string;
}

export interface PurchaseResponse {
    message: string;
    data: {
        id: number;
        user_id: number;
        token_package_id: number;
        tokens_purchased: number;
        amount_paid: string;
        payment_method: string;
        payment_reference: string;
        status: string;
        created_at: string;
        new_balance: number;
    };
}

@Injectable({
    providedIn: 'root'
})
export class TokenPackagesService {
    private baseUrl = environment.baseUrl;

    constructor(private http: HttpClient) { }

    /**
     * 7.1 Get Active Token Packages - Get all available token packages (public endpoint)
     */
    getActiveTokenPackages(): Observable<{ message: string; data: TokenPackage[] }> {
        const fullUrl = `${this.baseUrl}/tokens/packages`;
        return this.http.get<{ message: string; data: TokenPackage[] }>(fullUrl);
    }

    /**
     * 7.2 Purchase Token Package - Purchase tokens and credit to wallet
     */
    purchaseTokenPackage(payload: PurchasePayload): Observable<PurchaseResponse> {
        const fullUrl = `${this.baseUrl}/tokens/purchase`;
        return this.http.post<PurchaseResponse>(fullUrl, payload);
    }

    /**
     * Get payment methods
     */
    getPaymentMethods(): string[] {
        return ['mpesa', 'card', 'paypal', 'bank_transfer'];
    }

    /**
     * Calculate savings for a package
     */
    calculateSavings(packagePrice: number, tokens: number, basePrice: number = 0.15): number {
        const regularPrice = tokens * basePrice;
        return regularPrice - packagePrice;
    }

    /**
     * Get best value package
     */
    getBestValuePackage(packages: TokenPackage[]): TokenPackage | null {
        if (!packages.length) return null;

        return packages.reduce((best, current) => {
            return current.price_per_token < best.price_per_token ? current : best;
        });
    }
}