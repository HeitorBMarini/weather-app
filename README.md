# 🌤️ Weather App

Previsão do tempo para a **sua localização** ou **qualquer cidade**, com dados da [OpenWeather](https://openweathermap.org/api).

## 🔗 Acesse online
👉 https://weather-app-git-dev-heitorbmarinis-projects.vercel.app/

## ✨ Funcionalidades

- **Clima agora** com fundo que muda conforme a condição e se é dia ou noite
- **Próximas 24 horas**: temperatura, sensação térmica e chance de chuva
- **Próximos 5 dias** com barra de amplitude de temperatura
- **Busca de cidades** (Ctrl + K), com histórico e favoritos; a cidade fica na URL para compartilhar
- **Horários no fuso da cidade** consultada (nascer e pôr do sol, previsão)
- Sem permissão de localização, abre em São Paulo em vez de travar numa tela de erro
- Tema claro e escuro com um clique

## 🔒 Chave da API

A chave da OpenWeather fica **só no servidor**: o navegador chama a rota `/api/weather`, que consulta a OpenWeather e guarda as respostas em cache por 10 minutos.

```
OPENWEATHER_API_KEY=sua_chave   # .env.local
```

## 🛠️ Tecnologias

- **Next.js 15** (App Router) e **TypeScript**
- **Tailwind CSS** e **shadcn/ui**
- **TanStack Query** para cache e estados de carregamento
- **Recharts** para os gráficos
- **OpenWeather API**

## 🚀 Rodando localmente

```bash
npm install
npm run dev
```
