import assert from 'assert';
import { UsersService } from '../../../registerServer/service/users.service.js';

// req 모킹
const mockReq = {
    body: { name: "test", address: "address" },
};
// parseJson 모킹
const mockParsJson = async (req, res) => {
    return
}
// usersRepository 모킹 
const mockUsersRepository = {
    createUser: () => {
        return;
    }
}

async function testCreateUserSuccess() {
    // 1) res 최소한 모킹
    let statusCode, headers, body;
    const mockRes = {
        writeHead: (code, headerObj) => {
            statusCode = code;
            headers = headerObj;
        },
        end: (responseBody) => {
            body = responseBody;
        }
    };
    // 2) JobQueue 모킹
    const mockJobQueue = {
        enqueue: async (job) => {
            return true;
        }
    }
    // 3) 서비스 생성 및 호출
    const usersService = new UsersService(mockUsersRepository, mockParsJson, mockJobQueue);
    await usersService.createUser(mockReq, mockRes);

    // 4) 성공 시 값 대조
    assert.strictEqual(statusCode, 200, "성공 시 statusCode는 200 이여야함");
    assert.deepStrictEqual(headers, { 'Content-Type': 'application/json' }, "성공 시 Content-Type 맞아야 함")
    assert.strictEqual(body, JSON.stringify({ results: 'Success' }), "성공 시 값 body 정확해야 함")

    console.log("testCreateUserSuccess: 통과");
}

async function testCreateUserError() {
    // 1) res 최소한 모킹
    let statusCode, headers, body;
    const mockRes = {
        writeHead: (code, headerObj) => {
            statusCode = code;
            headers = headerObj;
        },
        end: (responseBody) => {
            body = responseBody;
        }
    }; 
    // 2) JobQueue 모킹
    const mockJobQueue = {
        enqueue: async (job) => {
            return false;
        }
    }
    // 3) 서비스 생성 및 호출
    const userService = new UsersService(mockUsersRepository, mockParsJson, mockJobQueue);
    try {
        await userService.createUser(mockReq, mockRes);
    }catch (err) {
        console.error(err);
    }

    // 4) 오류 시 값이 없으므로 statusCode 등 정의 안 됨  
    assert.strictEqual(statusCode, undefined, "오류 시 statusCode는 설정 안 되어야 함");
    assert.strictEqual(body, undefined, "오류 시 body도 없어야 함");

    console.log("testCreateUserError: 통과");
}

await testCreateUserSuccess();
await testCreateUserError();
console.log("UsersService 테스트 완료")