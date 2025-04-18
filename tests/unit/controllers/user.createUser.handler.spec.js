import assert from 'assert';
import { createUserHandler } from "../../../eventServer/handlers/user/createUser.handler.js";
import { parsePacket } from "../../../eventServer/utils/packet/parsePacket.js"

async function testCreateUserHandlerSuccess () {
    let errorMessage = null;
    let errorCalled = false;
    let addUserCalled = false;
    // 1) socket 모킹
    const mockSocket = {
        write : async (packet) => {
            errorMessage = parsePacket(packet);
        },
        id : 1
    }
    // 2) payload 모킹
    const MockPayload = { name: "name"};
    // 3) deps 모킹
    const MockDeps = {
        userRepository : {
            findUser : async (name) => {
                return;
            }
        },
        userSession : {
            jobQueue: {
                enqueue: async () => {
                    return { id : 10 };
                }
            },
            addUser: (socket) => {
                addUserCalled = true;
            }
        }
    };
    // 4) createUserHandler 실행
    try {
        await createUserHandler(mockSocket, MockPayload, MockDeps);
    } catch (err) {
        errorCalled = true;
        console.error(err);
    }
    
    assert.strictEqual(errorMessage, null, "성공 시 오류 메시지는 null 이여야함");
    assert.strictEqual(errorCalled, false, "성공 시 오류는 호출되지 않았어야함");
    assert.strictEqual(mockSocket.id, 10, "성공 시 socket의 id 는 10 이어야함");
    assert.strictEqual(addUserCalled, true, "성공 시 addUser는 호출되었어야함");

    console.log("testCreateUserHandlerSuccess: 통과");
}

async function testCreateUserHandlerFailToSearch() {
    let errorMessage = null;
    let errorCalled = false;
    let addUserCalled = false;
    // 1) socket 모킹
    const mockSocket = {
        write: async (packet) => {
            errorMessage = parsePacket(packet);
        },
        id: 1
    }
    // 2) payload 모킹
    const MockPayload = { name: "name" };
    // 3) deps 모킹
    const MockDeps = {
        userRepository: {
            findUser: async (name) => {
                return;
            }
        },
        userSession: {
            jobQueue: {
                enqueue: async () => {
                    return undefined;
                }
            },
            addUser: (socket) => {
                addUserCalled = true;
            }
        }
    };
    // 4) createUserHandler 실행
    try {
        await createUserHandler(mockSocket, MockPayload, MockDeps);
    } catch (err) {
        errorCalled = true;
        console.error(err);
    }

    assert.deepStrictEqual(errorMessage, { error: "User not found" }, "실패 시 오류 메시지는 { error: User not found} 이여야함");
    assert.strictEqual(errorCalled, true, "실패 시 오류는 호출되어야함");
    assert.strictEqual(mockSocket.id, 1, "실패 시 socket의 id 는 1 이어야함");
    assert.strictEqual(addUserCalled, false, "성공 시 addUser는 호출되지 않았어야함");

    console.log("testCreateUserHandlerFailToSearch: 통과");
}

await testCreateUserHandlerSuccess();
await testCreateUserHandlerFailToSearch();
console.log("createUserHandler 테스트 완료");