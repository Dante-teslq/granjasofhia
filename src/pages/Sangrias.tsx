import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import SangriasTable from "@/components/SangriasTable";
import { SangriaItem } from "@/types/inventory";

const SangriasPage = () => {
  const [sangrias, setSangrias] = useState<SangriaItem[]>([
    { id: crypto.randomUUID(), sangria: "", cartelasVazias: "", barbantes: "", notacoes: "" },
  ]);

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 space-y-6 max-w-[1400px]">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Sangrias e Insumos</h1>
          <p className="text-muted-foreground text-sm mt-1">Controle de sangrias, cartelas e barbantes</p>
        </div>
        <SangriasTable items={sangrias} onChange={setSangrias} />
      </div>
    </DashboardLayout>
  );
};

export default SangriasPage;
