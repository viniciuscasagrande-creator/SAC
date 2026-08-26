export const mockProducerMarketing = {
  kpis: {
    activeEvents: 25,
    views: "850.000",
    checkouts: "48.500",
    purchases: "18.250",
    revenue: "R$ 2.850.000,00",
    conversionRate: "2,14%",
    roas: "7.4x"
  },
  funnel: [
    { label: "1. Visualização", value: "850.000", percentage: "100%", color: "bg-slate-800" },
    { label: "2. Ingresso Selecionado", value: "120.000", percentage: "14.1%", color: "bg-blue-600" },
    { label: "3. Início de Checkout", value: "48.500", percentage: "5.7%", color: "bg-amber-500" },
    { label: "4. Preenchimento de Pagamento", value: "25.300", percentage: "2.9%", color: "bg-slate-500" },
    { label: "5. Compra Aprovada", value: "18.250", percentage: "2.14%", color: "bg-emerald-600" }
  ],
  producerPixels: [
    { id: "892341209384721", name: "Pixel Principal Produtora (Padrão Global)", platform: "Meta", eventsCount: 8, isDefault: true, matchQuality: "9.6/10" },
    { id: "918273645019283", name: "Pixel Festivais & Cerveja", platform: "Meta", eventsCount: 3, isDefault: false, matchQuality: "9.2/10" },
    { id: "392182049182390", name: "Pixel Experiência Música e Natureza", platform: "Meta", eventsCount: 2, isDefault: false, matchQuality: "8.9/10" },
    { id: "772183904128471", name: "Pixel MPB & Shows Teatrais", platform: "Meta", eventsCount: 4, isDefault: false, matchQuality: "9.4/10" },
    { id: "661298401928341", name: "Pixel Stand Up & Comédia", platform: "Meta", eventsCount: 2, isDefault: false, matchQuality: "9.0/10" }
  ]
};
