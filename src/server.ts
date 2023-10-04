import { createServer, Server, IncomingMessage, ServerResponse } from 'http'
import { findOffers } from './scripts/findOffers'

const PORT = process.env.PORT || 4200

const server: Server = createServer(async (request: IncomingMessage, response: ServerResponse) => {
    if (request.url?.startsWith("/offers/")) {
        try {
            const searchValue = request.url.split("/")[2]; 
            const limit = new URL(request.url, `http://${request.headers.host}`).searchParams.get('limit') || '10';
            
            const offers = await findOffers(searchValue, Number(limit));
            response.writeHead(200, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify(offers));
        } catch (error) {
            console.error("Error while fetching offers:", error);
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