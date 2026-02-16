import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { StockItem, calcularEstoqueFinal } from "@/types/inventory";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface StockTableProps {
  items: StockItem[];
  onChange: (items: StockItem[]) => void;
}

const emptyItem = (): StockItem => ({
  id: crypto.randomUUID(),
  descricao: "",
  codigo: "",
  estoqueInicial: 0,
  entradas: 0,
  quantVendida: 0,
  trincado: 0,
  quebrado: 0,
  obs: "",
});

const StockTable = ({ items, onChange }: StockTableProps) => {
  const updateItem = (id: string, field: keyof StockItem, value: string | number) => {
    onChange(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const addRow = () => onChange([...items, emptyItem()]);
  const removeRow = (id: string) => onChange(items.filter((item) => item.id !== id));

  const numFields: (keyof StockItem)[] = [
    "estoqueInicial",
    "entradas",
    "quantVendida",
    "trincado",
    "quebrado",
  ];

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-primary/10 text-foreground">
              <th className="px-3 py-3 text-left font-semibold">Descrição do Produto</th>
              <th className="px-3 py-3 text-left font-semibold">Código</th>
              <th className="px-3 py-3 text-center font-semibold">Est. Inicial</th>
              <th className="px-3 py-3 text-center font-semibold">Entradas</th>
              <th className="px-3 py-3 text-center font-semibold">Qt. Vendida</th>
              <th className="px-3 py-3 text-center font-semibold">Trincado</th>
              <th className="px-3 py-3 text-center font-semibold">Quebrado</th>
              <th className="px-3 py-3 text-center font-semibold bg-accent/20 text-accent">Est. Final</th>
              <th className="px-3 py-3 text-left font-semibold">OBS</th>
              <th className="px-3 py-3 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr
                key={item.id}
                className={`border-t border-border transition-colors hover:bg-muted/50 ${
                  idx % 2 === 0 ? "" : "bg-muted/30"
                }`}
              >
                <td className="px-2 py-1.5">
                  <Input
                    value={item.descricao}
                    onChange={(e) => updateItem(item.id, "descricao", e.target.value)}
                    placeholder="Ex: Ovo tipo A"
                    className="border-0 bg-transparent h-8 text-sm"
                  />
                </td>
                <td className="px-2 py-1.5">
                  <Input
                    value={item.codigo}
                    onChange={(e) => updateItem(item.id, "codigo", e.target.value)}
                    placeholder="000"
                    className="border-0 bg-transparent h-8 text-sm w-20"
                  />
                </td>
                {numFields.map((field) => (
                  <td key={field} className="px-2 py-1.5">
                    <Input
                      type="number"
                      min={0}
                      value={item[field] || ""}
                      onChange={(e) =>
                        updateItem(item.id, field, parseInt(e.target.value) || 0)
                      }
                      className="border-0 bg-transparent h-8 text-sm text-center w-20 mx-auto"
                    />
                  </td>
                ))}
                <td className="px-3 py-1.5 text-center font-bold text-accent">
                  {calcularEstoqueFinal(item)}
                </td>
                <td className="px-2 py-1.5">
                  <Input
                    value={item.obs}
                    onChange={(e) => updateItem(item.id, "obs", e.target.value)}
                    placeholder="—"
                    className="border-0 bg-transparent h-8 text-sm"
                  />
                </td>
                <td className="px-2 py-1.5">
                  <button
                    onClick={() => removeRow(item.id)}
                    className="p-1 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-3 border-t border-border">
        <Button variant="outline" size="sm" onClick={addRow} className="gap-1.5">
          <Plus className="w-3.5 h-3.5" /> Adicionar Linha
        </Button>
      </div>
    </div>
  );
};

export default StockTable;
