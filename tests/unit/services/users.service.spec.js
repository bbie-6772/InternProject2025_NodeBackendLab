import assert from 'assert';
import { UsersService } from '../../../registerServer/service/users.service.js';

async function testCreateUserSuccess() {
    // 1) req, res 최소한 모킹
    const req = {
        body: { name: "test", address: "address" },
    };
    let statusCode, headers, body;
    const res = {
        writeHead: (code, headerObj) => {
            statusCode = code;
            headers = headerObj;
        },
        end: (responseBody) => {
            body = responseBody;
        }
    };
    // 2) usersRepository 모킹 
    const mockUsersRepository = {
        enqueue : async (method, ...args) => {
            return true;
        },
        createUser : () => {
            return;
        }
    }
    // 3) parseJson 모킹
    const mockParsJson = async (req, res) => {
        return
    }
    // 4) 서비스 생성 및 호출
    const userService = new UsersService(mockUsersRepository, mockParsJson);
    await userService.createUser(req, res);

    // 5) 성공 시 응답 대조
    assert.strictEqual(statusCode, 200, "성공 시 statusCode는 200 이여야함");
    assert.deepStrictEqual(headers, { 'Content-Type': 'application/json' }, "성공 시 Content-Type 맞아야 함")
    assert.strictEqual(body, JSON.stringify({ results: 'Success' }), "성공 시 응답 body 정확해야 함")

    console.log("testCreateUserSuccess: 통과");
}

async function testCreateUserError() {
    // 1) req, res 최소한 모킹
    const req = {
        body: { name: "test", address: "address" },
    };
    let statusCode, headers, body;
    const res = {
        writeHead: (code, headerObj) => {
            statusCode = code;
            headers = headerObj;
        },
        end: (responseBody) => {
            body = responseBody;
        }
    };
    // 2) usersRepository 모킹 
    const mockUsersRepository = {
        enqueue: async (method, ...args) => {
            return false;
        },
        createUser: () => {
            return;
        }
    }
    // 3) parseJson 모킹
    const mockParsJson = async (req, res) => {
        return
    }
    // 4) 서비스 생성 및 호출
    const userService = new UsersService(mockUsersRepository, mockParsJson);
    try {
        await userService.createUser(req, res);
    }catch (err) {
        console.error(err);
    }

    // 5) 성공 시 응답 대조
    assert.strictEqual(statusCode, undefined, "오류 시 statusCode는 설정 안 되어야 함");
    assert.strictEqual(body, undefined, "오류 시 body도 없어야 함");

    console.log("testCreateUserError: 통과");
}

await testCreateUserError();
await testCreateUserSuccess();
console.log("UserService 테스트 완료")