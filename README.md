[![Moleculer](https://badgen.net/badge/Powered%20by/Moleculer/0e83cd)](https://moleculer.services)

# point-demo
This is a [Moleculer](https://moleculer.services/)-based microservices project. Generated with the [Moleculer CLI](https://moleculer.services/docs/0.14/moleculer-cli.html).

## Usage
Start the project with `npm run dev` command. 
After starting, open the http://localhost:3000/ URL in your browser. 
On the welcome page you can test the generated services via API Gateway and check the nodes & services.

In the terminal, try the following commands:
- `nodes` - List all connected nodes.
- `actions` - List all registered service actions.
- `call greeter.hello` - Call the `greeter.hello` action.
- `call greeter.welcome --name John` - Call the `greeter.welcome` action with the `name` parameter.
- `call products.list` - List the products (call the `products.list` action).


## Services
- **api**: API Gateway services
- **greeter**: Sample service with `hello` and `welcome` actions.
- **products**: Sample DB service. To use with MongoDB, set `MONGO_URI` environment variables and install MongoDB adapter with `npm i moleculer-db-adapter-mongo`.

## Mixins
- **db.mixin**: Database access mixin for services. Based on [moleculer-db](https://github.com/moleculerjs/moleculer-db#readme)


## Useful links

* Moleculer website: https://moleculer.services/
* Moleculer Documentation: https://moleculer.services/docs/0.14/

## NPM scripts

- `npm run dev`: Start development mode (load all services locally with hot-reload & REPL)
- `npm run start`: Start production mode (set `SERVICES` env variable to load certain services)
- `npm run cli`: Start a CLI and connect to production. Don't forget to set production namespace with `--ns` argument in script
- `npm run ci`: Run continuous test mode with watching
- `npm test`: Run tests & generate coverage report
- `npm run dc:up`: Start the stack with Docker Compose
- `npm run dc:down`: Stop the stack with Docker Compose


Moleculer Database Examples
Default Database Endpoints
Services: articles.service.js, users.service.js
Even if there are no visible endpoints inside the services themselves (apart from additional ones), default CRUD actions (CREATE, GET, PUT, DELETE) are inherited through the [DbService] mixin.
Default actions
List all articles (with all fields)
GET /api/articles
List articles (with filtered fields & populated author)
GET /api/articles?fields=title,author&populate=author&pageSize=5
List Top 5 articles (most voted)
GET /api/articles?fields=title,votes&sort=-votes&pageSize=5
Create a new article (autogenerated id)
POST /api/articles
Body { "title": "Article title", "content": "Article content", "author": "0XVEhTgNcuopEvdi" }
Create a new article (hardcoded id)
POST /api/articles
Body { "_id": "DhEzwV4aEJopm75a", "title": "Article title", "content": "Article content", "author": "0XVEhTgNcuopEvdi" }
Get an article by ID (with all fields & populates)
GET /api/articles/DhEzwV4aEJopm75a?populate=author
Update an article by ID
PUT /api/articles/DhEzwV4aEJopm75a
Body { "title": "Modified article title", "content": "Modified article content" }
Additional actions (voting)
Vote an article
PUT /api/articles/DhEzwV4aEJopm75a/vote
Unvote an article
PUT /api/articles/DhEzwV4aEJopm75a/unvote
Remove an article
Remove an article by ID
DELETE /api/articles/DhEzwV4aEJopm75a
Official Documentation:
https://moleculer.services/docs/0.13/moleculer-db.html

###JWT:

echo -e "# Don't add passphrase"
ssh-keygen -t rsa -b 4096 -m PEM -E SHA512 -f jwtRS512.key -N ""
# Don't add passphrase
openssl rsa -in jwtRS512.key -pubout -outform PEM -out jwtRS512.key.pub