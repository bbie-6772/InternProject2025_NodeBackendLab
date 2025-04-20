import assert from 'assert';
import { ClusterQueue } from './ClusterQueue.js';

async function testSendRequestSendsMessage() {
    // 1) process 모킹
    const sentMessages = [];
    const mockProcess = {
        send: (msg) => sentMessages.push(msg),
        on: () => { },
    };

    // 2) ClusterQueue 인스턴스 생성 및 요청 전송  
    const queue = new ClusterQueue(mockProcess);
    await queue.sendRequestToMaster({ action: 'foo' });
    await queue.sendRequestToMaster({ action: 'bar' });

    // 3) 보낸 메시지 개수 및 내용 검증  
    assert.strictEqual(sentMessages.length, 2, '2개의 메시지를 보내야함');
    assert.strictEqual(sentMessages[0].id, 0, '첫 번째 메시지 id는 0이어야함');
    assert.strictEqual(sentMessages[0].action, 'foo', '첫 번째 메시지 action 검증');
    assert.strictEqual(sentMessages[1].id, 1, '두 번째 메시지 id는 1이어야함');
    assert.strictEqual(sentMessages[1].action, 'bar', '두 번째 메시지 action 검증');

    console.log('testSendRequestSendsMessage: 통과');
}

async function testProcessMessageResolves() {
    // 1) 모킹 process 생성
    const mockProcess = {
        send: () => { },
        on: () => { },
    };

    // 2) ClusterQueue 생성 후 요청 보내기  
    const queue = new ClusterQueue(mockProcess);
    const promise = queue.sendRequestToMaster({ test: true });

    // 3) processMessage 메서드로 성공 결과 전달하여 프로미스 성공 처리 시뮬레이션  
    queue.processMessage({ id: 0, result: 'success' });

    // 4) 프로미스 결과 검증  
    const result = await promise;
    assert.strictEqual(result, 'success', '성공 시 반환 결과가 정상이어야 함');

    console.log('testProcessMessageResolves: 통과');
}

async function testProcessMessageRejects() {
    // 1) 모킹 process 생성 
    const mockProcess = {
        send: () => { },
        on: () => { },
    };

    // 2) ClusterQueue 생성 및 요청 실행  
    const queue = new ClusterQueue(mockProcess);
    const promise = queue.sendRequestToMaster({ test: true });
    const errorMsg = '에러 메시지';

    // 3) processMessage 호출로 에러 응답 시뮬레이션  
    queue.processMessage({ id: 0, error: errorMsg });

    // 4) 프로미스가 reject 되는지 확인  
    try {
        await promise;
        assert.fail('에러가 발생해야함');
    } catch (err) {
        assert.strictEqual(err.message, errorMsg, '에러 메시지가 정상 전달되어야 함');
    }

    console.log('testProcessMessageRejects: 통과');
}

async function testProcessMessageIgnoresUnknownId() {
    // 1) 모킹 process와 ClusterQueue 생성  
    const mockProcess = {
        send: () => { },
        on: () => { },
    };
    const queue = new ClusterQueue(mockProcess);

    // 2) 존재하지 않는 ID로 메시지를 전달해도 에러 없이 무시되어야 함  
    queue.processMessage({ id: 999, result: 'unused' });

    console.log('testProcessMessageIgnoresUnknownId: 통과');
}

// 여러 테스트를 병렬로 실행  
await Promise.all([
    testSendRequestSendsMessage(),
    testProcessMessageResolves(),
    testProcessMessageRejects(),
    testProcessMessageIgnoresUnknownId(),
]);

console.log('ClusterQueue 테스트 완료');  