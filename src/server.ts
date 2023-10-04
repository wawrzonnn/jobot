import { createServer, Server, IncomingMessage, ServerResponse } from 'http'
import { findOffers } from './scripts/findOffers'

const PORT = process.env.PORT || 4200;

let cache = {
    data: null,
    lastScraped: null
};

const server: Server = createServer(async (request: IncomingMessage, response: ServerResponse) => {
    if (request.url?.startsWith("/offers/")) {
        const currentTime = new Date().getTime();
        
        if (cache.data && cache.lastScraped && (currentTime - cache.lastScraped.getTime()) < 2 * 60 * 60 * 1000) {
            response.writeHead(200, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify(cache.data));
            return;
        }

        try {
            const searchValue = request.url.split("/")[2]; 
            const limit = new URL(request.url, `http://${request.headers.host}`).searchParams.get('limit') || '10';
            
            const offers = await findOffers(searchValue, Number(limit));

            cache.data = offers;
            cache.lastScraped = new Date();

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
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});