import { useState, useCallback } from 'react';

export interface MarketplaceData {
  nome: string;
  comissoes: number[];
  adicional: number;
  imagem: string;
  aplicaFreteAcimaDe79?: boolean;
}

export interface CalculatorInputs {
  valorProduto: number;
  frete: number;
  nfPercentual: number;
  adsPercentual: number;
  lucroDesejado: number;
}

export interface MarketplaceResult {
  nome: string;
  imagem: string;
  precoVenda: number;
  comissao: number;
  comissaoValor: number;
  nfValor: number;
  adsValor: number;
  custoFixo: number;
  freteAplicado: number;
  custoTotal: number;
  lucroLiquido: number;
  lucroPercentual: number;
}

const marketplaces: MarketplaceData[] = [
  {
    nome: "Mercado Livre Clássico",
    comissoes: [10, 12], // Duas opções de comissão
    adicional: 0, // Calculado dinamicamente
    imagem: "🛒",
    aplicaFreteAcimaDe79: true
  },
  {
    nome: "Mercado Livre Premium",
    comissoes: [18],
    adicional: 0, // Calculado dinamicamente
    imagem: "⭐",
    aplicaFreteAcimaDe79: true
  },
  {
    nome: "Shopee",
    comissoes: [20],
    adicional: 5,
    imagem: "🛍️",
    aplicaFreteAcimaDe79: false
  },
  {
    nome: "Magalu",
    comissoes: [12],
    adicional: 0,
    imagem: "🏪",
    aplicaFreteAcimaDe79: true
  },
  {
    nome: "Americanas",
    comissoes: [18],
    adicional: 0,
    imagem: "🏬",
    aplicaFreteAcimaDe79: true
  },
  {
    nome: "Amazon",
    comissoes: [12.5],
    adicional: 5.50,
    imagem: "📦",
    aplicaFreteAcimaDe79: true
  },
  {
    nome: "Aliexpress",
    comissoes: [8],
    adicional: 0,
    imagem: "🌏",
    aplicaFreteAcimaDe79: false
  }
];

function calcularCustoFixoML(preco: number): number {
  if (preco <= 29) return 6.25;
  if (preco <= 50) return 6.5;
  if (preco <= 79) return 6.75;
  return 0;
}

export function useCalculator() {
  const [results, setResults] = useState<MarketplaceResult[]>([]);
  const [inputs, setInputs] = useState<CalculatorInputs | null>(null);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatPercent = (value: number): string => {
    return `${value.toFixed(2)}%`;
  };

  const calculate = useCallback((data: CalculatorInputs) => {
    setInputs(data);
    
    const resultados: MarketplaceResult[] = [];
    
    marketplaces.forEach(marketplace => {
      // Para ML Clássico, calcular para ambas as comissões (10% e 12%)
      const comissoes = marketplace.nome === "Mercado Livre Clássico" 
        ? marketplace.comissoes 
        : [marketplace.comissoes[0]];
      
      comissoes.forEach((comissao, index) => {
        const custoBase = data.valorProduto;
        
        // Percentuais agregados
        const percentualTotal = (comissao + data.nfPercentual + data.adsPercentual + data.lucroDesejado) / 100;
        const divisor = 1 - percentualTotal;

        // Iterar para estabilizar preço quando há frete acima de 79 e/ou custo fixo ML por faixa
        let precoVenda = custoBase / divisor;
        let freteAplicado = 0;
        let custoFixo = 0;

        for (let i = 0; i < 5; i++) { // poucas iterações bastam para convergir
          // custo fixo
        if (marketplace.nome.includes("Mercado Livre")) {
          custoFixo = calcularCustoFixoML(precoVenda);
          } else {
            custoFixo = marketplace.adicional;
          }

          // frete adicional somente quando preço > 79 e marketplace aplica
          const deveAplicarFrete = (marketplace.aplicaFreteAcimaDe79 ?? false) && precoVenda > 79;
          freteAplicado = deveAplicarFrete ? data.frete : 0;

          const novoPreco = (custoBase + custoFixo + freteAplicado) / divisor;

          // se mudança for mínima, interrompe
          if (Math.abs(novoPreco - precoVenda) < 0.01) {
            precoVenda = novoPreco;
            break;
          }
          precoVenda = novoPreco;
        }
        
        // Cálculos de valores
        const comissaoValor = precoVenda * (comissao / 100);
        const nfValor = precoVenda * (data.nfPercentual / 100);
        const adsValor = precoVenda * (data.adsPercentual / 100);
        
        // Custo total
        const custoTotal = custoBase + freteAplicado + comissaoValor + nfValor + adsValor + custoFixo;
        
        // Lucro líquido
        const lucroLiquido = precoVenda - custoTotal;
        const lucroPercentual = (lucroLiquido / precoVenda) * 100;
        
        // Nome ajustado para ML Clássico com diferentes comissões
        const nomeAjustado = marketplace.nome === "Mercado Livre Clássico"
          ? `${marketplace.nome} (${comissao}%)`
          : marketplace.nome;
        
        resultados.push({
          nome: nomeAjustado,
          imagem: marketplace.imagem,
          precoVenda,
          comissao,
          comissaoValor,
          nfValor,
          adsValor,
          custoFixo,
          freteAplicado,
          custoTotal,
          lucroLiquido,
          lucroPercentual
        });
      });
    });
    
    setResults(resultados);
    return resultados;
  }, []);

  return {
    results,
    inputs,
    calculate,
    formatCurrency,
    formatPercent
  };
}