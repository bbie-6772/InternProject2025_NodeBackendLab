import assert from 'assert';
import { UserSession } from '../../../eventServer/classes/session/userSession.class.js';

// hour 및 minute 모킹
const now = new Date();
now.setMinutes(now.getMinutes() + 1);
const mockHour = now.getHours();
const mockMinutes = now.getMinutes();

// userRepository 모킹 
const mockUserRepository = {
    updateCount: async () => { return;},
    getWinner: async () => { return; }
}

// id 모킹
const mockId = 1

async function testTimeStartSuccess() {
    // 1) jobQueue 모킹
    const mockJobQueue = { enqueue : () => {} }
    // 2) UserSession 생성(+ 자동호출)
    const userSession = new UserSession(mockHour, mockMinutes, mockJobQueue, mockUserRepository);
    // 3) 성공 시 값 비교 
    const newNow = new Date();
    const delay = now - newNow;
    await new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                assert.strictEqual(userSession.isOpen, true, "실행 시 1분 내에는 isOpen이 true 여야함");
                assert.notStrictEqual(userSession.timer, null, "실행 시 timer는 null이 아니여야함");
            } catch (err) {
                reject(err);
            }
            
            resolve();
        }, delay);
    });
    // 4) 1분 뒤 값 비교
    await new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                assert.strictEqual(userSession.isOpen, false, "실행 후 1분 후엔 isOpen이 false 여야함");
            } catch (err) {
                reject(err);
            }
        
            console.log("testTimeStartSuccess: 통과");
            resolve();
        }, 60000)
    });
}

async function testAddUserSuccess() {
    // 1) jobQueue 모킹
    const mockJobQueue = { enqueue: () => { } }
    // 2) UserSession 생성 및 addUser 호출
    const userSession = new UserSession(mockHour, mockMinutes, mockJobQueue, mockUserRepository);
    userSession.addUser(mockId);
    // 3) 성공 시 값 비교
    assert.strictEqual(userSession.users.size, 1 , "성공 시 유저 수가 1 이여야함 ");
    assert.notStrictEqual(userSession.users.get(1), undefined, "성공 시 key가 1 인 유저가 존재 하여야함 ");

    console.log("testAddUserSuccess: 통과");
}

async function testGetUserByIdSuccess() {
    // 1) jobQueue 모킹
    const mockJobQueue = { enqueue: () => { } }
    // 2) UserSession 생성 및 addUser + getUserById 호출
    const userSession = new UserSession(mockHour, mockMinutes, mockJobQueue, mockUserRepository);
    userSession.addUser(mockId);
    const user = userSession.getUserById(mockId);
    // 3) 성공 시 값 비교
    assert.notStrictEqual(user, undefined, "user 가 존재 하여야함 ");

    console.log("testGetUserByIdSuccess: 통과");
}

async function testDeleteUserByIdSuccess() {
    // 1) jobQueue 모킹
    const mockJobQueue = { enqueue: () => { } }
    // 2) UserSession 생성 및 addUser + deleteUserById 호출
    const userSession = new UserSession(mockHour, mockMinutes, mockJobQueue, mockUserRepository);
    userSession.addUser(mockId);
    userSession.deleteUserById(mockId);
    // 3) 성공 시 값 비교
    assert.strictEqual(userSession.users.size, 0, "성공 시 유저 수가 0 이여야함 ");
    assert.strictEqual(userSession.users.get(1), undefined, "성공 시 key가 1 인 유저가 존재하지 않아야함 ");

    console.log("testDeleteUserByIdSuccess: 통과");
}

async function testCountUploadSuccess() {
    let jobQueueCalled = false;
    let errorCalled = false;
    // 1) jobQueue 모킹
    const mockJobQueue = { enqueue: () => { jobQueueCalled = true; }};
    // 2) UserSession 생성 및 addUser + getUserById 및 user.addCount 호출 (시뮬레이션)
    const userSession = new UserSession(mockHour, mockMinutes, mockJobQueue, mockUserRepository);
    userSession.addUser(mockId);
    const user = userSession.getUserById(mockId);

    const newNow = new Date();
    const delay = now - newNow;
    await new Promise((resolve, reject) => {
        setTimeout(() => {
            user.addCount();
            resolve();
        }, delay);
    });
    
    // 3) countUpload 실행
    try {
        await userSession.countUpload();
    } catch (err) {
        errorCalled = true;
    }
    
    // 4) 성공 시 값 비교
    assert.strictEqual(jobQueueCalled, true, "성공 시 jobQueue 의 enqueue가 호출 되여야함 ");
    assert.strictEqual(errorCalled, false, "성공 시 오류가 호출되지 않아야함 ");

    console.log("testCountUploadSuccess: 통과");
}

async function testCountUploadFail() {
    let jobQueueCalled = false;
    let errorCalled = false;
    // 1) jobQueue 모킹
    const mockJobQueue = { enqueue: () => { throw new Error; }};
    // 2) UserSession 생성 및 addUser + getUserById 및 user.addCount 호출 (시뮬레이션)
    const userSession = new UserSession(mockHour, mockMinutes, mockJobQueue, mockUserRepository);
    userSession.addUser(mockId);
    const user = userSession.getUserById(mockId);

    const newNow = new Date();
    const delay = now - newNow;
    await new Promise((resolve, reject) => {
        setTimeout(() => {
            user.addCount();
            resolve();
        }, delay);
    });

    // 3) countUpload 실행
    try {
        await userSession.countUpload();
    } catch (err) {
        errorCalled = true;
    }
    // 4) 실패 시 값 비교
    assert.strictEqual(jobQueueCalled, false, "실패 시 jobQueue 의 enqueue가 호출되지 않아야함 ");
    assert.strictEqual(errorCalled, true, "실패 시 오류가 호출되어야함 ");

    console.log("testCountUploadFail: 통과");
}

async function testGetWinnerSuccess() {
    let result = null;
    let jobQueueCalled = false;
    let errorCalled = false;
    // 1) jobQueue 모킹
    const mockJobQueue = { enqueue: () => { 
        jobQueueCalled = true;  
        return { test : "success" };
    } };
    // 2) UserSession 생성
    const userSession = new UserSession(mockHour, mockMinutes, mockJobQueue, mockUserRepository);
    // 3) getWinner 실행
    try {
        result = await userSession.getWinner();
    } catch (err) {
        errorCalled = true;
    }

    // 4) 성공 시 값 비교
    assert.deepStrictEqual(result, { test: "success" }, "성공 시 result가 { test: success } 이어야함 ");
    assert.strictEqual(jobQueueCalled, true, "성공 시 jobQueue 의 enqueue가 호출 되여야함 ");
    assert.strictEqual(errorCalled, false, "성공 시 오류가 호출되지 않아야함 ");

    console.log("testGetWinnerSuccess: 통과");
}

async function testGetWinnerFail() {
    let result = null;
    let jobQueueCalled = false;
    let errorCalled = false;
    // 1) jobQueue 모킹
    const mockJobQueue = {
        enqueue: () => {
            jobQueueCalled = true;
            throw new Error;
        }
    };
    // 2) UserSession 생성
    const userSession = new UserSession(mockHour, mockMinutes, mockJobQueue, mockUserRepository);
    // 3) getWinner 실행
    try {
        result = await userSession.getWinner();
    } catch (err) {
        errorCalled = true;
    }

    // 4) 성공 시 값 비교
    assert.deepStrictEqual(result, null, "실패 시 result가 null 이어야함 ");
    assert.strictEqual(jobQueueCalled, true, "실패 시 jobQueue 의 enqueue가 호출 되여야함 ");
    assert.strictEqual(errorCalled, true, "실패 시 오류가 호출되어야함 ");

    console.log("testGetWinnerFail: 통과");
}

await Promise.all([   
    testTimeStartSuccess(),
    testAddUserSuccess(),
    testGetUserByIdSuccess(),
    testDeleteUserByIdSuccess(),
    testCountUploadSuccess(),
    testCountUploadFail(),
    testGetWinnerSuccess(),
    testGetWinnerFail()
])

console.log("UserSession Class 테스트 완료")