import assert from 'assert';
import { UsersRepository } from '../../../common/database/repository/users.repository.js';

async function testCreateUserSuccess() {
    let result = false;
    let errorCalled = false;
    // 1) database 모킹
    const mockDatabase = {
        prepare: () => {
            return { run : async () => { return  { changes : 1 }} }
        }
    }
    // 2) Repository 생성 및 호출
    const usersRepository = new UsersRepository(mockDatabase);
    try {
        result = await usersRepository.createUser("name", "address");
    } catch (err) {
        errorCalled = true;
    }
    // 3) 성공 시 값 대조
    assert.strictEqual(result, true, "성공 시 반환 값이 true 여야함");
    assert.strictEqual(errorCalled, false, "성공 시 에러가 호출되지 않았어야함");

    console.log("testCreateUserSuccess: 통과")
}

async function testCreateUserFail() {
    let result = false;
    let errorCalled = false;
    // 1) database 모킹
    const mockDatabase = {
        prepare: () => {
            return { run: async () => { throw new Error; } }
        }
    }
    // 2) Repository 생성 및 호출
    try {
        result = await usersRepository.createUser("name", "address");
    } catch (err) {
        errorCalled = true;
    }
    // 3) 실패 시 값 대조
    assert.strictEqual(result, false, "실패 시 반환 값이 false 여야함");
    assert.strictEqual(errorCalled, true, "실패 시 에러가 호출되었어야함");

    console.log("testCreateUserFail: 통과")
}

async function testFindUserSuccess() {
    let result = false;
    let errorCalled = false;
    // 1) database 모킹
    const mockDatabase = {
        prepare: () => {
            return { get: async () => { return "result" } }
        }
    }
    // 2) Repository 생성 및 호출
    const usersRepository = new UsersRepository(mockDatabase);
    try {
        result = await usersRepository.findUser("name");
    } catch (err) {
        errorCalled = true;
    }
    
    // 3) 성공 시 값 대조
    assert.strictEqual(result, "result", "성공 시 반환 값이 result 이여야함");
    assert.strictEqual(errorCalled, false, "성공 시 에러가 호출되지 않았어야함");

    console.log("testFindUserSuccess: 통과")
}

async function testFindUserFail() {
    let result = false;
    let errorCalled = false;
    // 1) database 모킹
    const mockDatabase = {
        prepare: () => {
            return { get: async () => { throw new Error;  } }
        }
    }
    // 2) Repository 생성 및 호출
    const usersRepository = new UsersRepository(mockDatabase);
    try {
        result = await usersRepository.findUser("name");
    } catch (err) {
        errorCalled = true;
    }

    // 3) 실패 시 값 대조
    assert.strictEqual(result, false, "실패 시 반환 값이 false 여야함");
    assert.strictEqual(errorCalled, true, "실패 시 에러가 호출되었어야함");

    console.log("testFindUserFail: 통과")
}

async function testGetWinnerSuccess() {
    let result = false;
    let errorCalled = false;
    // 1) database 모킹
    const mockDatabase = {
        prepare: () => {
            return { all: async () => { return "result" } }
        }
    }
    // 2) Repository 생성 및 호출
    const usersRepository = new UsersRepository(mockDatabase);
    try {
        result = await usersRepository.getWinner();
    } catch (err) {
        errorCalled = true;
    }

    // 3) 성공 시 값 대조
    assert.strictEqual(result, "result", "성공 시 반환 값이 result 이여야함");
    assert.strictEqual(errorCalled, false, "성공 시 에러가 호출되지 않았어야함");

    console.log("testGetWinnerSuccess: 통과")
}

async function testGetWinnerFail() {
    let result = false;
    let errorCalled = false;
    // 1) database 모킹
    const mockDatabase = {
        prepare: () => {
            return { all: async () => { throw new Error; } }
        }
    }
    // 2) Repository 생성 및 호출
    const usersRepository = new UsersRepository(mockDatabase);
    try {
        result = await usersRepository.getWinner();
    } catch (err) {
        errorCalled = true;
    }

    // 3) 실패 시 값 대조
    assert.strictEqual(result, false, "실패 시 반환 값이 false 여야함");
    assert.strictEqual(errorCalled, true, "실패 시 에러가 호출되었어야함");

    console.log("testGetWinnerFail: 통과")
}


async function testUpdateCountSuccess() {
    let result = false;
    let errorCalled = false;
    // 1) database 모킹
    const mockDatabase = {
        prepare: () => {
            return { run: async () => { return { changes: 1 } } }
        }
    }
    // 2) Repository 생성 및 호출
    const usersRepository = new UsersRepository(mockDatabase);
    try {
        result = await usersRepository.updateCount(0, 0, 0);
    } catch (err) {
        errorCalled = true;
    }

    // 3) 성공 시 값 대조
    assert.strictEqual(result, true, "성공 시 반환 값이 true 여야함");
    assert.strictEqual(errorCalled, false, "성공 시 에러가 호출되지 않았어야함");

    console.log("testUpdateCountSuccess: 통과")
}

async function testUpdateCountFail() {
    let result = false;
    let errorCalled = false;
    // 1) database 모킹
    const mockDatabase = {
        prepare: () => {
            return { run: async () => { throw new Error; } }
        }
    }
    // 2) Repository 생성 및 호출
    const usersRepository = new UsersRepository(mockDatabase);
    try {
        result = await usersRepository.updateCount(0, 0, 0);
    } catch (err) {
        errorCalled = true;
    }

    // 3) 실패 시 값 대조
    assert.strictEqual(result, false, "실패 시 반환 값이 false 여야함");
    assert.strictEqual(errorCalled, true, "실패 시 에러가 호출되었어야함");

    console.log("testUpdateCountFail: 통과")
}

await Promise.all([
    testCreateUserSuccess,
    testCreateUserFail,
    testFindUserSuccess,
    testFindUserFail,
    testGetWinnerSuccess,
    testGetWinnerFail,
    testUpdateCountSuccess,
    testUpdateCountFail
])

console.log("UsersRepository 테스트 완료")