export interface TokenPackagesResponseDto {
  message: string;
  data: TokenPackageDto[];
}
export interface TokenPackageDto {
  id: number;
  name: string;
  price: string;          
  tokens: number;
  description: string;
  is_active: boolean;
  sort_order: number;
  price_per_token: number;
}
