import { createServer, Server, IncomingMessage, ServerResponse } from 'http'
import { findOffers } from './scripts/findOffers'

const PORT = process.env.PORT || 4200

const server: Server = createServer(async (request: IncomingMessage, response: ServerResponse) => {
    if (request.url === "/scrape") {
        try {
            const searchTerm = new URL(request.url, `http://${request.headers.host}`).searchParams.get('searchValue') || 'front-end-developer';
            const offers = await findOffers(searchTerm);
            response.writeHead(200, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify(offers));
        } catch (error) {
            console.error("Error while scraping:", error);
            response.writeHead(500, { 'Content-Type': 'text/plain' });
            response.end('Internal Server Error');
        }
    } else {
        response.writeHead(200, { 'Content-Type': 'text/plain' });
        response.end('Hello World!\n');
    }
})

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`)
})