import { Plus, Trash2 } from "lucide-react";
import { StockItem, PRODUCT_CATALOG } from "@/types/inventory";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";

interface StockTableProps {
  items: StockItem[];
  onChange: (items: StockItem[]) => void;
}

const emptyItem = (): StockItem => ({
  id: crypto.randomUUID(),
  descricao: "",
  codigo: "",
  estoqueSistema: 0,
  estoqueLoja: 0,
  trincado: 0,
  quebrado: 0,
  faltas: 0,
  obs: "",
});

const StockTable = ({ items, onChange }: StockTableProps) => {
  const isMobile = useIsMobile();

  const updateItem = (id: string, field: keyof StockItem, value: string | number) => {
    onChange(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const selectProduct = (id: string, descricao: string) => {
    const product = PRODUCT_CATALOG.find((p) => p.descricao === descricao);
    onChange(
      items.map((item) =>
        item.id === id
          ? { ...item, descricao, codigo: product?.codigo || "" }
          : item
      )
    );
  };

  const addRow = () => onChange([...items, emptyItem()]);
  const removeRow = (id: string) => onChange(items.filter((item) => item.id !== id));

  const numFields: { key: keyof StockItem; label: string }[] = [
    { key: "estoqueSistema", label: "Est. Sistema" },
    { key: "estoqueLoja", label: "Est. Loja" },
    { key: "trincado", label: "Trincado" },
    { key: "quebrado", label: "Quebra" },
  ];

  if (isMobile) {
    return (
      <div className="space-y-3">
        {items.map((item) => {
          const faltas = item.estoqueLoja - item.estoqueSistema;
          return (
            <div key={item.id} className="glass-card rounded-xl p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <Select value={item.descricao} onValueChange={(v) => selectProduct(item.id, v)}>
                    <SelectTrigger className="h-10 text-sm">
                      <SelectValue placeholder="Selecione o produto" />
                    </SelectTrigger>
                    <SelectContent>
                      {PRODUCT_CATALOG.map((p) => (
                        <SelectItem key={p.codigo} value={p.descricao}>{p.descricao}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <button
                  onClick={() => removeRow(item.id)}
                  className="p-2 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              {item.codigo && (
                <p className="text-xs text-muted-foreground">Código: {item.codigo}</p>
              )}
              <div className="grid grid-cols-2 gap-2">
                {numFields.map((field) => (
                  <div key={field.key} className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{field.label}</label>
                    <Input
                      type="number"
                      step="0.5"
                      value={item[field.key] || ""}
                      onChange={(e) => updateItem(item.id, field.key, parseFloat(e.target.value) || 0)}
                      placeholder="0"
                      className="h-10 text-sm text-center"
                    />
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Faltas</span>
                <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full font-bold text-xs ${
                  faltas < 0 ? "bg-destructive/15 text-destructive" : faltas > 0 ? "bg-primary/15 text-primary" : "bg-success/15 text-success"
                }`}>
                  {faltas.toFixed(1)}
                </span>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">OBS</label>
                <Input
                  value={item.obs}
                  onChange={(e) => updateItem(item.id, "obs", e.target.value)}
                  placeholder="Anotações"
                  className="h-10 text-sm"
                />
              </div>
            </div>
          );
        })}
        <Button variant="outline" size="lg" onClick={addRow} className="gap-1.5 w-full h-12">
          <Plus className="w-4 h-4" /> Adicionar Linha
        </Button>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50 text-foreground">
              <th className="px-3 py-3 text-left font-bold text-[11px] uppercase tracking-[0.1em] text-muted-foreground min-w-[200px]">Produto</th>
              <th className="px-3 py-3 text-center font-bold text-[11px] uppercase tracking-[0.1em] text-muted-foreground">Código</th>
              {numFields.map((f) => (
                <th key={f.key} className="px-3 py-3 text-center font-bold text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
                  {f.label}
                </th>
              ))}
              <th className="px-3 py-3 text-center font-bold text-[11px] uppercase tracking-[0.1em] text-muted-foreground">Faltas</th>
              <th className="px-3 py-3 text-left font-bold text-[11px] uppercase tracking-[0.1em] text-muted-foreground">OBS</th>
              <th className="px-3 py-3 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => {
              const faltas = item.estoqueLoja - item.estoqueSistema;
              return (
                <tr key={item.id} className={`border-t border-border/50 transition-colors duration-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 ${idx % 2 === 0 ? "" : "bg-muted/10"}`}>
                  <td className="px-2 py-1.5">
                    <Select value={item.descricao} onValueChange={(v) => selectProduct(item.id, v)}>
                      <SelectTrigger className="border border-input bg-background h-8 text-sm rounded-md">
                        <SelectValue placeholder="Selecione o produto" />
                      </SelectTrigger>
                      <SelectContent>
                        {PRODUCT_CATALOG.map((p) => (
                          <SelectItem key={p.codigo} value={p.descricao}>{p.descricao}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-2 py-1.5 text-center">
                    <span className="inline-flex items-center justify-center w-16 h-8 rounded bg-muted text-sm font-medium text-foreground">{item.codigo || "—"}</span>
                  </td>
                  {numFields.map((field) => (
                    <td key={field.key} className="px-2 py-1.5">
                      <Input
                        type="number" step="0.5"
                        value={item[field.key] || ""}
                        onChange={(e) => updateItem(item.id, field.key, parseFloat(e.target.value) || 0)}
                        placeholder="0"
                        className="border border-input bg-background h-8 text-sm text-center w-24 mx-auto rounded-md"
                      />
                    </td>
                  ))}
                  <td className="px-3 py-1.5 text-center">
                    <span className={`inline-flex items-center justify-center w-20 h-8 rounded-full font-bold text-xs ${
                      faltas < 0 ? "bg-destructive/15 text-destructive" : faltas > 0 ? "bg-primary/15 text-primary" : "bg-success/15 text-success"
                    }`}>{faltas.toFixed(1)}</span>
                  </td>
                  <td className="px-2 py-1.5">
                    <Input value={item.obs} onChange={(e) => updateItem(item.id, "obs", e.target.value)} placeholder="Anotações" className="border border-input bg-background h-8 text-sm rounded-md" />
                  </td>
                  <td className="px-2 py-1.5">
                    <button onClick={() => removeRow(item.id)} className="p-1 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="p-3 border-t border-border/50">
        <Button variant="outline" size="sm" onClick={addRow} className="gap-1.5">
          <Plus className="w-3.5 h-3.5" /> Adicionar Linha
        </Button>
      </div>
    </div>
  );
};

export default StockTable;
