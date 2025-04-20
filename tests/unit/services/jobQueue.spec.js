import assert from 'assert';
import { JobQueue } from '../../../common/utils/jobQueue.js';

async function testEnqueueSuccess() {
    // 1) 내부에 사용될 비동기 함수 모킹
    const mockJob = async () => {
        return 1205;
    };
    // 2) jobQueue 생성 및 Enqueue 실행
    const jobQueue = new JobQueue();
    const result = await jobQueue.enqueue(mockJob);

    // 3) 반환 값 비교
    assert.strictEqual(result, 1205,"성공 시 반환 값이 1205 이여야함");

    console.log("testEnqueueSuccess: 통과");
}

async function testEnqueueSequence() {
    const order = [];
    // 1) jobQueue 생성 및 Enqueue 실행
    const jobQueue = new JobQueue();
    jobQueue.enqueue(async () => { order.push(1); });
    jobQueue.enqueue(async () => { order.push(2); });
    jobQueue.enqueue(async () => { order.push(3); });

    // 2) 큐가 모두 처리 되도록 잠깐 대기  
    await new Promise(resolve => setTimeout(resolve, 50));

    // 3) 반환 값 비교
    assert.deepStrictEqual(order, [1, 2, 3], '작업이 순서대로 실행되어야함');

    console.log("testEnqueueSequence: 통과");
}

async function testEnqueueFail() {
    let caughtError = null;
    const error = new Error('작업 에러');
    // 1) jobQueue 생성 및 Enqueue 실행
    try {
        const jobQueue = new JobQueue();
        await jobQueue.enqueue(async () => { throw error; });
    } catch (err) {
        caughtError = err;
    }

    // 2) 반환 값 비교
    assert.strictEqual(caughtError, error, '실패 시 에러가 정상적으로 전달되어야함');

    console.log("testEnqueueFail: 통과");
}

async function testMultipleEnqueue() {
    let order = [];
    // 1) jobQueue 생성 및 Enqueue 실행
    const jobQueue = new JobQueue();
    jobQueue.enqueue(async () => {
        order.push(1);
        // 2) 중간에 작업 대기  
        await new Promise(resolve => setTimeout(resolve, 10));
    });
    jobQueue.enqueue(async () => { order.push(2); });

    // 3) 잠시 대기 후 enqueue 추가 작업  
    await new Promise(resolve => setTimeout(resolve, 5));
    await jobQueue.enqueue(async () => { order.push(3); });

    // 4) 큐가 모두 처리 되도록 대기  
    await new Promise(resolve => setTimeout(resolve, 50));

    // 5) 반환 값 비교
    assert.deepStrictEqual(order, [1, 2, 3], '중간에 추가된 작업도 정상 처리되어야함');

    console.log("testMultipleEnqueue: 통과");
}

await Promise.all([
    testEnqueueSuccess(),
    testEnqueueSequence(),
    testEnqueueFail(),
    testMultipleEnqueue()
])

console.log("JobQueue 테스트 완료")