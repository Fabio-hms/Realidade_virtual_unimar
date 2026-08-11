// src/server.ts
import express, { Express, Request, Response } from 'express';
import path from 'path';
const app: Express = express();
const port: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
// Servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, '../public')));
// Rota principal que serve o index.html
app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
