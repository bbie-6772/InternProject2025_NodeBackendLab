import http from 'http';
import net from 'net';
import assert from 'assert';
import { config } from '../../common/config/config.js';

class Client {
    constructor (name, address, registerHost, registerPort, eventHost, eventPort) {
        // HTTP 통신
        this.registerHost = registerHost;
        this.registerPort = registerPort;

        this.name = name;
        this.address = address;
        this.token = null;

        // TCP 통신
        this.eventHost = eventHost;
        this.eventPort = eventPort;

        this.socket = new net.Socket();
        this.socket.connect(this.eventPort, this.eventHost, this.onConnections);
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
        await this.httpRequestTest('/register', 'POST', 200, expectedResponse, data);
        console.log('Register response passed');  
    }

    onConnections = async () => {
        this.socket.buffer = Buffer.alloc(0);
        console.log("TCP 서버와 연결되었습니다.")
        this.socket.on('end', this.onEnd);
        this.socket.on('data', this.onData);
        this.socket.on('error', this.onError)
    }

    onData = async (data) => {
        this.socket.buffer = Buffer.concat([this.socket.buffer, data]);
        const packetTypeByte = config.header.packetTypeByte;
        const payloadLengthByte = config.header.payloadLengthByte;
        let payloadByte = 0;
        const defaultLength = packetTypeByte + payloadLengthByte

        try {
            while (this.socket.buffer.length >= defaultLength) {
                try {
                    payloadByte = this.socket.buffer.readUInt32BE(packetTypeByte);
                } catch (err) {
                    onEnd(socket)();
                    break;
                }

                if (this.socket.buffer.length < defaultLength + payloadByte) break;
                const packet = this.socket.buffer.subarray(0, defaultLength + payloadByte);
                this.socket.buffer = this.socket.buffer.subarray(defaultLength + payloadByte);

                const packetType = packet.readUInt16BE(0);
                const payloadBuffer = packet.subarray(defaultLength, defaultLength + payloadByte);
                const payloadString = payloadBuffer.toString('utf8');
                const payload = JSON.parse(payloadString);

                console.log(payload);
            }
        } catch (err) {
            console.error(err);
        }
    }

    onError = async (err) => {
        console.error(err);
    }

    onEnd = async () => {
        console.log("TCP 서버와의 연결이 끊어졌습니다.")
    }

    sendPacket = (packetType, payload) => {
        const payloadString = JSON.stringify(payload);
        const payloadBuffer = Buffer.from(payloadString, 'utf8');

        const packetTypeBuffer = Buffer.alloc(2);
        packetTypeBuffer.writeUInt16BE(packetType);

        const payloadLengthBuffer = Buffer.alloc(4);
        payloadLengthBuffer.writeUInt32BE(payloadBuffer.length);

        const packet = Buffer.concat([
            packetTypeBuffer,
            payloadLengthBuffer,
            payloadBuffer
        ])

        this.socket.write(packet);
    }

    createUser = async () => {
        const payload = { name : this.name }
        this.sendPacket(config.header.packetType.C_LOGIN_REQUEST, payload);
    }

    click = async () => {
        const payload = {};
        this.sendPacket(config.header.packetType.C_CLICK_REQUEST, payload);

        setTimeout(this.click, Math.random() * 11000 )
    }
}

// 커스텀
const customTest = async (client_count = 1, next = 0) => {
    await Promise.all(
        Array.from({ length: client_count }, async (__, idx) => {
            const name = `dummy${next * client_count + idx}`;
            const address = 'Republic of Korea';

            const client = new Client(
                name,
                address,
                config.server.register.host,
                config.server.register.port,
                config.server.event.host,
                config.server.event.port
            );

            // 메서드 적용
            // await client.registerRequest();
            await client.createUser();
            await client.click();
        }),
    );
};

// 부하 테스트 실행문
for (let i = 0; i < 5; i++) {
    await customTest(5, i);
    await new Promise((resolve) => setTimeout(() => resolve(), 1000));
}
