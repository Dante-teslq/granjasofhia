import DashboardLayout from "@/components/DashboardLayout";

const ConfiguracoesPage = () => {
  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 max-w-[1400px]">
        <h1 className="text-2xl font-bold text-foreground">Configurações</h1>
        <p className="text-muted-foreground text-sm mt-1">Em breve: configurações de produtos, usuários e preferências.</p>
      </div>
    </DashboardLayout>
  );
};

export default ConfiguracoesPage;
