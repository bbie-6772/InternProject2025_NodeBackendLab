import assert from 'assert';
import { UsersController } from '../../../registerServer/controller/users.controller.js';

async function testCreateUserSuccess() {
    // 1) req, res 최소한 모킹
    const mockReq = {};
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
    // 2) usersService의 createUser 모킹  
    const mockUsersService = {
        createUser: async (req, res) => {
            // 성공 케이스, 아무 것도 안 함  
            return;
        }
    };
    // 3) 컨트롤러 생성 및 호출  
    const usersController = new UsersController(mockUsersService);
    await usersController.createUser(mockReq, mockRes);

    // 4) 성공 시 값이 없으므로 statusCode 등 정의 안 됨  
    assert.strictEqual(statusCode, undefined, "성공 시 statusCode는 설정 안 되어야 함");
    assert.strictEqual(body, undefined, "성공 시 body도 없어야 함");

    console.log("testUsersControllerCreateUserSuccess: 통과");
} 

async function testCreateUserError() {
    // 1) req, res 최소한 모킹
    const mockReq = {};
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
    // 2) usersService의 createUser 모킹 
    const mockUsersService = {
        createUser: async (req, res) => {
            throw new Error; 
        }
    };
    // 3) 컨트롤러 생성 및 호출  
    const usersController = new UsersController(mockUsersService);
    await usersController.createUser(mockReq, mockRes);

    // 4) 성공 시 값 대조
    assert.strictEqual(statusCode, 400, "오류 시 statusCode는 400 이여야함");
    assert.deepStrictEqual(headers, { 'Content-Type': 'application/json' }, "오류 시 Content-Type 맞아야 함");
    assert.strictEqual(body, JSON.stringify({ error: 'Bad Request' }), "오류 시 값 body 정확해야 함");

    console.log("testCreateUserError: 통과");
} 

await Promise.all([
    testCreateUserError(),
    testCreateUserSuccess(),
])

console.log("UsersController 테스트 완료")