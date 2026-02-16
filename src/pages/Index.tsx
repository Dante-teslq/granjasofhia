import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Package, TrendingDown, AlertTriangle, CheckCircle } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import StockTable from "@/components/StockTable";
import SangriasTable from "@/components/SangriasTable";
import { StockItem, SangriaItem, calcularEstoqueFinal } from "@/types/inventory";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

const initialStockItems: StockItem[] = [
  { id: "1", descricao: "Ovo Tipo A - Cartela", codigo: "001", estoqueInicial: 120, entradas: 30, quantVendida: 80, trincado: 5, quebrado: 2, obs: "" },
  { id: "2", descricao: "Ovo Tipo B - Cartela", codigo: "002", estoqueInicial: 85, entradas: 20, quantVendida: 50, trincado: 3, quebrado: 1, obs: "" },
  { id: "3", descricao: "Ovo Caipira - Cartela", codigo: "003", estoqueInicial: 40, entradas: 15, quantVendida: 30, trincado: 1, quebrado: 0, obs: "" },
];

const initialSangrias: SangriaItem[] = [
  { id: "1", sangria: "", cartelasVazias: "", barbantes: "", notacoes: "" },
  { id: "2", sangria: "", cartelasVazias: "", barbantes: "", notacoes: "" },
];

const Index = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [stockItems, setStockItems] = useState<StockItem[]>(initialStockItems);
  const [sangrias, setSangrias] = useState<SangriaItem[]>(initialSangrias);

  const totalEstoqueFinal = stockItems.reduce((acc, item) => acc + calcularEstoqueFinal(item), 0);
  const totalVendido = stockItems.reduce((acc, item) => acc + item.quantVendida, 0);
  const totalPerdas = stockItems.reduce((acc, item) => acc + item.trincado + item.quebrado, 0);

  const stats = [
    { label: "Estoque Final", value: totalEstoqueFinal, icon: Package, color: "text-primary" },
    { label: "Total Vendido", value: totalVendido, icon: CheckCircle, color: "text-accent" },
    { label: "Perdas (Trinc. + Queb.)", value: totalPerdas, icon: AlertTriangle, color: "text-destructive" },
    { label: "Produtos", value: stockItems.length, icon: TrendingDown, color: "text-muted-foreground" },
  ];

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 space-y-6 max-w-[1400px]">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Controle de Estoque Diário</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Gerencie entradas, saídas e perdas do dia
            </p>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2 w-fit">
                <CalendarIcon className="w-4 h-4" />
                {format(date, "dd 'de' MMMM, yyyy", { locale: ptBR })}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(d) => d && setDate(d)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="glass-card rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
                <span className="text-xs text-muted-foreground font-medium">{stat.label}</span>
              </div>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Stock Table */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">Planilha de Estoque</h2>
          <p className="text-xs text-muted-foreground mb-3">
            OBS: Unidade de medida em cartelas. Todo ovo quebrado ou trincado deve ser registrado.
          </p>
          <StockTable items={stockItems} onChange={setStockItems} />
        </section>

        {/* Sangrias Table */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">Controle de Sangrias e Insumos</h2>
          <SangriasTable items={sangrias} onChange={setSangrias} />
        </section>
      </div>
    </DashboardLayout>
  );
};

export default Index;
