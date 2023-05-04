const path = require('path');
const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const cors = require('cors');
const { json } = require('body-parser');
const { loadFilesSync } = require('@graphql-tools/load-files');
const { makeExecutableSchema } = require('@graphql-tools/schema');

const typesArray = loadFilesSync(path.join(__dirname, '**/*.graphql'));
const resolversArray = loadFilesSync(path.join(__dirname, '**/*.resolvers.js'));

async function startApolloServer() {
  const app = express();

  const schema = makeExecutableSchema({
    typeDefs: typesArray,
    resolvers: resolversArray,
  });

  const server = new ApolloServer({ schema });

  await server.start();
  app.use('/graphql', cors(), json(), expressMiddleware(server));

  app.listen(3000, () => {
    console.log('Running GraphQL server...');
  });
}

startApolloServer();
