import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, TrendingUp } from 'lucide-react';
import { CalculatorInputs } from '@/hooks/useCalculator';

const formSchema = z.object({
  valorProduto: z.string()
    .transform(val => parseFloat(val.replace(',', '.')))
    .pipe(z.number().positive('Valor deve ser positivo')),
  frete: z.string()
    .transform(val => parseFloat(val.replace(',', '.')))
    .pipe(z.number().min(0, 'Frete não pode ser negativo')),
  nfPercentual: z.string()
    .transform(val => parseFloat(val.replace(',', '.')))
    .pipe(z.number().min(0).max(100, 'Percentual deve estar entre 0 e 100')),
  adsPercentual: z.string()
    .transform(val => parseFloat(val.replace(',', '.')))
    .pipe(z.number().min(0).max(100, 'Percentual deve estar entre 0 e 100')),
  lucroDesejado: z.string()
    .transform(val => parseFloat(val.replace(',', '.')))
    .pipe(z.number().min(0).max(100, 'Percentual deve estar entre 0 e 100'))
});

type FormData = z.infer<typeof formSchema>;

interface CalculatorFormProps {
  onCalculate: (data: CalculatorInputs) => void;
}

export function CalculatorForm({ onCalculate }: CalculatorFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      valorProduto: '',
      frete: '',
      nfPercentual: '',
      adsPercentual: '',
      lucroDesejado: ''
    } as any
  });

  const onSubmit = (data: FormData) => {
    onCalculate(data as CalculatorInputs);
  };

  return (
    <Card className="bg-gradient-card backdrop-blur-sm border-card-border shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          Calculadora de Vendas
        </CardTitle>
        <CardDescription>
          Preencha os dados para calcular o preço ideal em cada marketplace
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="valorProduto">Valor do Produto (R$)</Label>
            <Input
              id="valorProduto"
              type="text"
              placeholder="0,00"
              {...register('valorProduto')}
              className={errors.valorProduto ? 'border-destructive' : ''}
            />
            {errors.valorProduto && (
              <p className="text-sm text-destructive">{errors.valorProduto.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="frete">Frete (R$)</Label>
            <Input
              id="frete"
              type="text"
              placeholder="0,00"
              {...register('frete')}
              className={errors.frete ? 'border-destructive' : ''}
            />
            {errors.frete && (
              <p className="text-sm text-destructive">{errors.frete.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="nfPercentual">NF (%)</Label>
            <Input
              id="nfPercentual"
              type="text"
              placeholder="0,00"
              {...register('nfPercentual')}
              className={errors.nfPercentual ? 'border-destructive' : ''}
            />
            {errors.nfPercentual && (
              <p className="text-sm text-destructive">{errors.nfPercentual.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="adsPercentual">Custos de ADS (%)</Label>
            <Input
              id="adsPercentual"
              type="text"
              placeholder="0,00"
              {...register('adsPercentual')}
              className={errors.adsPercentual ? 'border-destructive' : ''}
            />
            {errors.adsPercentual && (
              <p className="text-sm text-destructive">{errors.adsPercentual.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lucroDesejado">Lucro Desejado (%)</Label>
            <Input
              id="lucroDesejado"
              type="text"
              placeholder="0,00"
              {...register('lucroDesejado')}
              className={errors.lucroDesejado ? 'border-destructive' : ''}
            />
            {errors.lucroDesejado && (
              <p className="text-sm text-destructive">{errors.lucroDesejado.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full bg-gradient-primary shadow-glow">
            <TrendingUp className="mr-2 h-4 w-4" />
            Calcular Preços
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}