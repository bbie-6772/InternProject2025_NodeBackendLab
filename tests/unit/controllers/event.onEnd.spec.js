import assert from 'assert';
import { onEnd } from '../../../eventServer/events/onEnd.js';

async function testOnEndSuccess () {
    let endCalled = false;
    let destroyCalled = false;
    let userDeleteCalled = false;
    // 1) socket 모킹
    const mockSocket = {
        end : () => {
            endCalled = true;
        },
        destroy : () => {
            destroyCalled = true;
        },
        id : 1
    }   
    // 2) userSession 모킹
    const mockUserSession = {
        deleteUserById : () => { userDeleteCalled = true; }
    }
    // 3) onEnd 실행
    await onEnd(mockSocket,mockUserSession)();
    // 4) 반환 값 비교
    assert.strictEqual(userDeleteCalled, true, "성공 시 deleteUserById 가 실행되었어야함")
    assert.strictEqual(endCalled, true, "성공 시 end 가 실행되었어야함")
    assert.strictEqual(destroyCalled, true, "성공 시 destroy 가 실행되었어야함")

    console.log("testOnEndSuccess: 통과")
}

async function testOnEndFailToNoId() {
    let endCalled = false;
    let destroyCalled = false;
    let userDeleteCalled = false;
    // 1) socket 모킹
    const mockSocket = {
        end: () => { endCalled = true; },
        destroy: () => { destroyCalled = true; },
        id: undefined  
    };
    // 2) userSession 모킹
    const mockUserSession = {
        deleteUserById: () => { userDeleteCalled = true; }
    };
    // 3) onEnd 실행
    await onEnd(mockSocket, mockUserSession)();
    // 4) 반환 값 비교
    assert.strictEqual(userDeleteCalled, false, "id 없으면 deleteUserById 호출 없어야 함");
    assert.strictEqual(endCalled, true, "end 호출되어야 함");
    assert.strictEqual(destroyCalled, true, "destroy 호출되어야 함");

    console.log("testOnEndFailToNoId: 통과");
}  

await Promise.all([
    testOnEndSuccess(),
    testOnEndFailToNoId(),
])

console.log("onEnd 테스트 완료 ")