import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import StockTable from "@/components/StockTable";
import { StockItem } from "@/types/inventory";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

const EstoquePage = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [stockItems, setStockItems] = useState<StockItem[]>([
    { id: crypto.randomUUID(), descricao: "", codigo: "", estoqueInicial: 0, entradas: 0, quantVendida: 0, trincado: 0, quebrado: 0, obs: "" },
  ]);

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 space-y-6 max-w-[1400px]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Estoque Diário</h1>
            <p className="text-muted-foreground text-sm mt-1">Controle detalhado de estoque</p>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2 w-fit">
                <CalendarIcon className="w-4 h-4" />
                {format(date, "dd 'de' MMMM, yyyy", { locale: ptBR })}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar mode="single" selected={date} onSelect={(d) => d && setDate(d)} initialFocus />
            </PopoverContent>
          </Popover>
        </div>
        <StockTable items={stockItems} onChange={setStockItems} />
      </div>
    </DashboardLayout>
  );
};

export default EstoquePage;
