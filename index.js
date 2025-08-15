import http from "http";
import { v4 } from "uuid";

const port = 3000;

const grades = [];

const server = http.createServer((request, response) => {
  // funções do backend

  // Extrai o método e a URL da requisição
  const { method, url } = request;
  // Recebe os dados do corpo da requisição e transforma em string
  let body = "";
  // Evento que recebe os dados do corpo da requisição
  request.on("data", (chunk) => {
    // Converte o chunk recebido em string e adiciona ao body
    body += chunk.toString();
  });
  // Evento que é chamado quando não há mais dados a serem recebidos
  request.on("end", () => {
    // Extrai o id da rota, que é a terceira parte do caminho
    const id = url.split("/")[2];

    // Verifica se a rota é /grades e os métodos
    if (url === "/grades" && method === "GET") {
      // Responde com o array de objetos
      response.writeHead(200, { "Content-type": "application/json" });
      // Converte o array grades em JSON e envia na resposta
      response.end(JSON.stringify(grades));
    } else if (url === "/grades" && method === "POST") {
      // Recebe os dados do corpo da requisição e transforma em objeto
      const { studentName, subject, grade } = JSON.parse(body);
      const newGrade = { id: v4(), studentName, subject, grade };
      grades.push(newGrade);
      // Responde com o novo objeto criado
      response.writeHead(201, { "Content-type": "application/json" });
      response.end(JSON.stringify(newGrade));
    } else if (url.startsWith("/grades/") && method === "PUT") {
      const { studentName, subject, grade } = JSON.parse(body); // recebe os dados do corpo da requisição
      // itera sobre o array para encontrar o objeto com o id igual ao da rota
      const gradesToUpdate = grades.find((g) => g.id === id);
      // se encontrou, atualiza o objeto
      if (gradesToUpdate) {
        gradesToUpdate.studentName = studentName;
        gradesToUpdate.subject = subject;
        gradesToUpdate.grade = grade;
        // responde com o objeto atualizado
        response.writeHead(200, { "Content-type": "application/json" });
        response.end(JSON.stringify(gradesToUpdate));
      } else {
        response.writeHead(404, { "Content-type": "application/json" });
        response.end(JSON.stringify({ message: "Grade not found" }));
      }
    } else if (url.startsWith("/grades/") && method === "DELETE") {
      // itera sobre o array para encontrar o objeto com o id igual ao da rota
      const index = grades.findIndex((g) => g.id === id);
      // se encontrou, remove o objeto do array
      if (index !== -1 /*-1 pq esse item nao existe no array*/) {
        grades.splice(
          index,
          1 /*posição 1, se for 2 apaga esse e mais e -1 esse e o anterior*/
        );
        response.writeHead(204); // No content, pois não há resposta a ser enviada
        response.end();
      }
    } else {
      response.writeHead(404, { "Content-type": "application/json" });
      response.end(JSON.stringify({ message: "Route not found" }));
    }
  });
});

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
