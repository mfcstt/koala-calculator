import { CalculatorForm } from '@/components/CalculatorForm';
import { MarketplaceCard } from '@/components/MarketplaceCard';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useCalculator } from '@/hooks/useCalculator';
import { ChartLine, Package2 } from 'lucide-react';

const Index = () => {
  const { results, calculate, formatCurrency, formatPercent } = useCalculator();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="Koala Parts" className="h-8 w-10 mr-2" />
              <div className="leading-tight">
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8">
          {/* Left Panel - Form */}
          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <CalculatorForm onCalculate={calculate} />
          </aside>

          {/* Right Panel - Results */}
          <section>
            {results.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[400px] text-center">
                <Package2 className="h-16 w-16 text-muted-foreground/30 mb-4" />
                <h2 className="text-xl font-semibold text-muted-foreground mb-2">
                  Nenhum cálculo realizado
                </h2>
                <p className="text-sm text-muted-foreground max-w-md">
                  Preencha os dados do produto no formulário ao lado e clique em "Calcular Preços" 
                  para ver os resultados em cada marketplace.
                </p>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-2">Resultados por Marketplace</h2>
                  <p className="text-muted-foreground">
                    Comparação de preços e lucros em diferentes plataformas
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {results.map((result) => (
                    <MarketplaceCard
                      key={result.nome}
                      result={result}
                      formatCurrency={formatCurrency}
                      formatPercent={formatPercent}
                    />
                  ))}
                </div>

              
              </>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default Index;