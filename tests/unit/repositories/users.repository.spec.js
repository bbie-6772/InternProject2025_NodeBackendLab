import assert from 'assert';
import { UsersRepository } from '../../../common/database/repository/users.repository.js';

async function testCreateUserSuccess() {
    // 1) database 모킹
    const mockDatabase = {
        prepare: () => {
            return { run : async () => { return  { changes : 1 }} }
        }
    }
    // 2) Repository 생성 및 호출
    const usersRepository = new UsersRepository(mockDatabase);
    const result = await usersRepository.createUser("name", "address");

    // 3) 성공 시 값 대조
    assert.strictEqual(result, true, "성공 시 반환 값이 true 여야함");

    console.log("testCreateUserSuccess: 통과")
}

async function testCreateUserFail() {
    // 1) database 모킹
    const mockDatabase = {
        prepare: () => {
            return { run: async () => { return { changes: 0 } } }
        }
    }
    // 2) Repository 생성 및 호출
    const usersRepository = new UsersRepository(mockDatabase);
    const result = await usersRepository.createUser("name", "address");

    // 3) 성공 시 값 대조
    assert.strictEqual(result, false, "실패 시 반환 값이 false 여야함");

    console.log("testCreateUserFail: 통과")
}

async function testFindUserSuccess() {
    // 1) database 모킹
    const mockDatabase = {
        prepare: () => {
            return { get: async () => { return "result" } }
        }
    }
    // 2) Repository 생성 및 호출
    const usersRepository = new UsersRepository(mockDatabase);
    const result = await usersRepository.findUser("name");

    // 3) 성공 시 값 대조
    assert.strictEqual(result, "result", "성공 시 반환 값이 result 이여야함");

    console.log("testFindUserSuccess: 통과")
}

async function testFindUserFail() {
    // 1) database 모킹
    const mockDatabase = {
        prepare: () => {
            return { get: async () => { return undefined  } }
        }
    }
    // 2) Repository 생성 및 호출
    const usersRepository = new UsersRepository(mockDatabase);
    const result = await usersRepository.findUser("name");

    // 3) 실패 시 값 대조
    assert.strictEqual(result, undefined, "실패 시 반환 값이 undefined 여야함");

    console.log("testFindUserFail: 통과")
}

async function testGetWinnerSuccess() {
    // 1) database 모킹
    const mockDatabase = {
        prepare: () => {
            return { all: async () => { return "result" } }
        }
    }
    // 2) Repository 생성 및 호출
    const usersRepository = new UsersRepository(mockDatabase);
    const result = await usersRepository.getWinner();

    // 3) 성공 시 값 대조
    assert.strictEqual(result, "result", "성공 시 반환 값이 result 이여야함");

    console.log("testGetWinnerSuccess: 통과")
}

async function testGetWinnerFail() {
    // 1) database 모킹
    const mockDatabase = {
        prepare: () => {
            return { all: async () => { return undefined } }
        }
    }
    // 2) Repository 생성 및 호출
    const usersRepository = new UsersRepository(mockDatabase);
    const result = await usersRepository.getWinner();

    // 3) 성공 시 값 대조
    assert.strictEqual(result, undefined, "실패 시 반환 값이 undefined 여야함");

    console.log("testGetWinnerFail: 통과")
}


async function testUpdateCountSuccess() {
    // 1) database 모킹
    const mockDatabase = {
        prepare: () => {
            return { run: async () => { return { changes: 1 } } }
        }
    }
    // 2) Repository 생성 및 호출
    const usersRepository = new UsersRepository(mockDatabase);
    const result = await usersRepository.updateCount(0, 0, 0);

    // 3) 성공 시 값 대조
    assert.strictEqual(result, true, "성공 시 반환 값이 true 여야함");

    console.log("testUpdateCountSuccess: 통과")
}

async function testUpdateCountFail() {
    // 1) database 모킹
    const mockDatabase = {
        prepare: () => {
            return { run: async () => { return { changes: 0 } } }
        }
    }
    // 2) Repository 생성 및 호출
    const usersRepository = new UsersRepository(mockDatabase);
    const result = await usersRepository.updateCount(0, 0, 0);

    // 3) 성공 시 값 대조
    assert.strictEqual(result, false, "실패 시 반환 값이 false 여야함");

    console.log("testUpdateCountFail: 통과")
}

await testCreateUserSuccess();
await testCreateUserFail();
await testFindUserSuccess();
await testFindUserFail();
await testGetWinnerSuccess();
await testGetWinnerFail();
await testUpdateCountSuccess();
await testUpdateCountFail();
console.log("UsersRepository 테스트 완료")