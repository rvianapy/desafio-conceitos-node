const express = require("express");
const cors = require("cors");

const {uuid, isUuid} = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateId (request, response, next) {
  const {id} = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({error: 'Invalid repository ID.'});
  }

  next();

}


// 
// R O T A S
//

app.get("/repositories", (request, response) => {
  
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  return response.json(repository);

});

app.put("/repositories/:id", validateId, (request, response) => {
  const {id} = request.params;
  const {title, url, techs} = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id == id);

  if (repositoryIndex < 0) {
    return response.status(400).json({error: 'Repository not found!'});
  }

  const likes = repositories[repositoryIndex].likes;
  
  const repository = {
    id,
    title,
    url,
    techs,
    likes,
  };

  repositories[repositoryIndex] = repository;

  return response.json(repository);

});

app.delete("/repositories/:id", validateId, (request, response) => {
  const {id} = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id == id);

  if (repositoryIndex < 0) {
    return response.status(400).json({error: 'Repository not found!'});
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();

});

app.post("/repositories/:id/like", validateId, (request, response) => {
  const {id} = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id == id);

  const repository = repositories.find(repository => repository.id == id);

  if(!repository) {
    return response.status(400).json({error: 'Repository not found!'});
  }

  repository.likes = repository.likes + 1;

  repositories[repositoryIndex] = repository;

  return response.status(204).send();


});

module.exports = app;
