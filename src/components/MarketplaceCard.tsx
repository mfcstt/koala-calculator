import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MarketplaceResult } from '@/hooks/useCalculator';
import { TrendingUp, TrendingDown, Package, Truck, Receipt, Megaphone, DollarSign } from 'lucide-react';

interface MarketplaceCardProps {
  result: MarketplaceResult;
  formatCurrency: (value: number) => string;
  formatPercent: (value: number) => string;
}

export function MarketplaceCard({ result, formatCurrency, formatPercent }: MarketplaceCardProps) {
  const isProfit = result.lucroLiquido > 0;

  const getBrandConfig = (nome: string): { logo: string; color: string; alt: string } => {
    const lower = nome.toLowerCase();
    if (lower.includes('mercado livre')) {
      return { logo: '/meli-classico.svg', color: '#FFE600', alt: 'Mercado Livre' };
    }
    if (lower.includes('shopee')) {
      return { logo: '/shopee.svg', color: '#EE4D2D', alt: 'Shopee' };
    }
    if (lower.includes('magalu') || lower.includes('magazine luiza')) {
      return { logo: '/magalu.svg', color: '#00A4FF', alt: 'Magalu' };
    }
    if (lower.includes('americanas')) {
      return { logo: '/americanas.svg', color: '#D40000', alt: 'Americanas' };
    }
    if (lower.includes('amazon')) {
      return { logo: '/amazon.svg', color: '#FF9900', alt: 'Amazon' };
    }
    if (lower.includes('aliexpress') || lower.includes('ali express')) {
      return { logo: '/aliexpress.svg', color: '#FF6A00', alt: 'AliExpress' };
    }
    return { logo: '/logo.png', color: '#22c55e', alt: 'Lucro Verde' };
  };

  const brand = getBrandConfig(result.nome);

  return (
    <Card className="bg-gradient-card backdrop-blur-sm border-card-border shadow-card hover:shadow-glow transition-all duration-300 hover:scale-[1.02] overflow-hidden">
      <CardHeader className="pb-3 relative">
        <div className="absolute right-3 top-3 opacity-10 pointer-events-none select-none">
        </div>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={brand.logo} alt={brand.alt} className="h-6 w-6 rounded" />
            <span className="text-lg font-semibold">{result.nome}</span>
          </div>

        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg p-3" style={{ backgroundColor: 'rgba(0,0,0,0.03)' }}>
          <p className="text-sm text-muted-foreground mb-1">Preço de Venda</p>
          <p className="text-2xl font-bold" style={{ color: brand.color }}>{formatCurrency(result.precoVenda)}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">Comissão ({formatPercent(result.comissao)})</p>
                <p className="font-medium">{formatCurrency(result.comissaoValor)}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Receipt className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">NF</p>
                <p className="font-medium">{formatCurrency(result.nfValor)}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Megaphone className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">ADS</p>
                <p className="font-medium">{formatCurrency(result.adsValor)}</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">Frete</p>
                <p className="font-medium">
                  {result.freteAplicado === 0 ? (
                    <span className="text-success">Grátis</span>
                  ) : (
                    formatCurrency(result.freteAplicado)
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">Taxa Fixa</p>
                <p className="font-medium">
                  {result.custoFixo === 0 ? 'Sem taxa' : formatCurrency(result.custoFixo)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t pt-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Lucro Líquido</span>
            <span className={`text-lg font-bold ${isProfit ? 'text-success' : 'text-destructive'}`}>
              {formatCurrency(result.lucroLiquido)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}