export const accountRouter = {
    '/register': (req, res) => {
        const { id, password } = req.body

        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Success');
    }
}; 