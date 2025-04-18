import assert from 'assert';
import { User } from '../../../eventServer/classes/models/user.class.js';

async function testAddCountSuccess() {
    // 1) userSession 모킹
    const mockUserSession = {
        isOpen : true
    }
    // 2) User 생성 및 addCount 호출
    const user = new User(mockUserSession);
    user.addCount();
    // 3) 성공 시 값 대조
    assert.strictEqual(user.clickCounts, 1, "성공 시 카운트가 1 이여야함");
    assert.strictEqual(user.hasFailed, false, "성공 시 실격 여부가 false 여야함");
    assert.notStrictEqual(user.lastClick, null, "성공 시 lastClick이 null이 아니여야함");

    console.log("testAddCountSuccess: 통과");
}

async function testAddCountTooManyClick() {
    // 1) userSession 모킹
    const mockUserSession = {
        isOpen: true
    }
    // 2) User 생성 및 addCount 반복 호출
    const user = new User(mockUserSession);
    for (let i=0; i < 5;i++) {
        user.addCount();
    }
    // 3) 성공 시 값 대조
    assert.strictEqual(user.clickCounts, 4, "실패 시 카운트가 4 이여야함");
    assert.strictEqual(user.hasFailed, true, "실패 시 실격 여부가 true 여야함");
    assert.notStrictEqual(user.lastClick, null, "실패 시 lastClick이 null이 아니여야함");

    console.log("testAddCountTooManyClick: 통과");
}

async function testAddCountTooSlowClick() {
    // 1) userSession 모킹
    const mockUserSession = {
        isOpen: true
    }
    // 2) User 생성 및 addCount 호출
    const user = new User(mockUserSession);
    user.addCount();

    // 3) 10 초 뒤 값 대조
    await new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                assert.strictEqual(user.clickCounts, 1, "실패 시 카운트가 1 이여야함");
                assert.strictEqual(user.hasFailed, true, "실패 시 실격 여부가 true 여야함");
                assert.notStrictEqual(user.lastClick, null, "실패 시 lastClick이 null이 아니여야함");
            } catch (err) {
                reject(err);
            }
        
            console.log("testAddCountTooSlowClick: 통과");
            resolve();
        }, 10000)
    });
}

await Promise.all([
    testAddCountSuccess,
    testAddCountTooManyClick,
    testAddCountTooSlowClick
])

console.log("User Class 테스트 완료");