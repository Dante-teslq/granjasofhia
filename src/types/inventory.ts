export interface StockItem {
  id: string;
  descricao: string;
  codigo: string;
  estoqueInicial: number;
  entradas: number;
  quantVendida: number;
  trincado: number;
  quebrado: number;
  obs: string;
}

export interface SangriaItem {
  id: string;
  sangria: string;
  cartelasVazias: string;
  barbantes: string;
  notacoes: string;
}

export function calcularEstoqueFinal(item: StockItem): number {
  return item.estoqueInicial + item.entradas - item.quantVendida - item.trincado - item.quebrado;
}
