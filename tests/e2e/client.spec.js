import http from 'http';
import assert from 'assert';
import { config } from '../../common/config/config.js';

class Client {
    constructor (name, address, registerHost, registerPort, eventHost, eventPort) {
        this.registerHost = registerHost;
        this.registerPort = registerPort;
        this.eventHost = eventHost;
        this.eventPort = eventPort;

        this.name = name;
        this.address = address;
        this.token = null;
    }

    httpRequestTest = async (path, method, expectedStatus, expectedBody, data = '') => {
        return new Promise((resolve, reject) => {
            const options = {
                hostname: this.registerHost,
                port: this.registerPort,
                path,
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(data),
                }, 
            }

            const req = http.request(options, (res) => {
                let body = '';
                res.on('data', chunk => {
                    body += chunk;
                })
                res.on('end', () => {
                    try {
                        assert.strictEqual(res.statusCode, expectedStatus);
                        assert.strictEqual(body, expectedBody);
                        resolve();
                    } catch (err) {
                        console.error(err);
                        console.log(body);
                        reject();
                    }
                })
            })

            req.on('error', (err) => reject(err));
            req.write(data);
            req.end();
        })
    }

    registerRequest = async () => {
        const expectedResponse = JSON.stringify({ results: 'Success' });
        const data = JSON.stringify({ name: this.name, address: this.address });
        const results = await this.httpRequestTest('/register', 'POST', 200, expectedResponse, data);
        console.log('Register response passed');  
    }
}

// 커스텀
const customTest = async (client_count = 1, next = 0) => {
    await Promise.all(
        Array.from({ length: client_count }, async (__, idx) => {
            const name = `dummy${next * client_count + idx}`;
            const password = 'Republic of Korea';

            const client = new Client(
                name,
                password,
                config.REGISTER_SERVER.host,
                config.REGISTER_SERVER.port,
                config.EVENT_SERVER.host,
                config.EVENT_SERVER.port
            );

            // 로그인 이후 사용할 메서드 적용
            await client.registerRequest();
        }),
    );
};

// 부하 테스트 실행문
for (let i = 0; i < 1; i++) {
    await customTest(1, i);
    await new Promise((resolve) => setTimeout(() => resolve(), 10000));
}
