export const parseJson = async (req, res) => {
    return await new Promise((resolve, reject) => {
        if (req.headers['content-type'] !== 'application/json')
            throw new Error("Json 파싱 실패");

        let body = '';

        req.on('data', chuck => {
            body += chuck.toString();
        })
        req.on('end', () => {
            req.body = JSON.parse(body);  // JSON으로 디코딩  
            resolve();
        })
    })
}