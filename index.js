import http from "http";
import { v4 } from "uuid";

const port = 3000;

const grades = [];

const server = http.createServer((request, response) => {
  // funções do backend
  const { method, url } = request;

  // Recebe os dados do corpo da requisição e transforma em string
  let body = "";
  request.on("data", (chunk) => {
    body += chunk.toString();
  });

  request.on("end", () => {
    // Verifica se a rota é /grades e os métodos
    if (url === "/grades" && method === "GET") {
      response.writeHead(200, { "Content-type": "application/json" });
      response.end(JSON.stringify(grades));
    } else if (url === "/grades" && method === "POST") {
      const { studentName, subject, grade } = JSON.parse(body);
      const newGrade = { id: v4(), studentName, subject, grade };
      grades.push(newGrade);

      // Responde com o novo objeto criado
      response.writeHead(201, { "Content-type": "application/json" });
      response.end(JSON.stringify(newGrade));
    } else {
      response.writeHead(404, { "Content-type": "application/json" });
      response.end(JSON.stringify({ message: "Route not found" }));
    }
  });
});

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
