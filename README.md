# 힘내라💪 클릭 대회

- http / tcp 통신을 이용해 클릭 대회를 구현한 프로젝트 입니다.

- HH시 00분 부터 1분 간 가장 많이 클릭한 사용자를 찾아내는 것이 목표입니다.

## 참여 규칙

1. **1분**은 *00초*부터 *59.999999초*를 의미하며, **시간 범위**에 **들어오지 않은 클릭은 세지 말아야합**니다.

2. 어떠한 연속된 **1초 구간 내**에 **클릭 횟수가 4회를 초과**하면 **실격 처리**됩니다.  
( 초당 4회를 초과 시, 부정행위자로 간주하고 누적 클릭량에 관계 없이 실격 처리 )

3. **회원가입**하지 **않은 유저는 참여 할 수 없습**니다.

4. 첫 클릭은 참여로 간주됩니다.

5. 참여한 유저가 **10초간 클릭하지 않는다면 자동 실격 처리**됩니다. 즉, 이후의 요청을 세지 말아야합니다.

6. 각종 사유로 **실격한 참여자는 재참여 할 수 없습**니다.

7. 클릭 수가 동일한 선두가 생길 경우, 1 마이크로초라도 **빠르게 클릭수에 도달한 유저가 우승자**가 됩니다.

## 요구 사항

- 클릭 요청은 TCP 통신을, 회원가입은 HTTP 서버로 구현

- 이벤트 종료 후, 우승자의 아이디 / 주소지 / 클릭 횟수 를 출력할 수 있어야 함

- e2e(End To End) 테스트 및 유닛 테스트 구현

- 클러스터 모드로 실행되도록 설계

- 어떠한 외부 소스 없이 구현

## 실행 방법

### 클러스터 모드

1. Repository를 복제하여 IDE로 폴더를 연다.

2. eventServer/session.js 파일로 들어가 시간 설정을 해준다.

    ```jsx
    // 이벤트 시작 시간 hour(0~23):minute(0~59)
    const hour = 6;
    const minute = 58;
    ```

3. 아래의 명령어를 터미널에 입력하여 클러스터 모드로 실행해준다.

    ```bash
    node common/clustering/cluster.js
    ```

4. 아래의 명령어를 추가 터미널에 입력하여 더미 클라이언트를 실행해준다.

    ```bash
    node tests/e2e/client.spec.js
    ```

5. 설정된 시간을 기준으로 1분 이후 우승자 결과가 cluster 터미널 화면에 확인된다!

![Image](https://github.com/user-attachments/assets/9433b265-a5fa-4c29-acc7-8352f19369db)

### 일반 모드

1. Repository를 복제하여 IDE로 폴더를 연다.

2. eventServer/session.js 파일로 들어가 시간 설정을 해준다.

    ```jsx
    // 이벤트 시작 시간 hour(0~23):minute(0~59)
    const hour = 6;
    const minute = 58;
    ```

3. 터미널을 2개를 실행하여 각각 아래의 명령어들을 입력해준다

    ```bash
    # TCP 서버 
    node eventServer/server.js

    # HTTP 서버
    node registerServer/server.js
    ```

4. 더미 클라이언트 파일을 연다 tests/e2e/client.spec.js

5. 맨 아래에 있는 실행문에서 주석처리를 아래와 같이 변경해준다

    ```jsx
    // 부하 테스트 실행문
    for (let i = 0; i < 5; i++) {
        // 일반 테스트
        await defaultTest(5, i);
        // 클러스터 테스트
        //await clusterTest(5, i);
        await new Promise((resolve) => setTimeout(() => resolve(), 1000));
    }
    ```

6. 아래의 명령어를 추가 터미널에 입력하여 더미 클라이언트를 실행해준다.

    ```bash
    node tests/e2e/client.spec.js
    ```

### 단위 테스트

- tests/unit 폴더에 있는 각각의 파일들을 단일로 실행시켜 준다.

    ```bash
    # 예시
    node tests/unit/controllers/event.onData.spec.js
    ```

### API 명세서

![Image](https://github.com/user-attachments/assets/dc5875f7-d62b-4616-9cde-8f97d218fb9d)

### ERD

![Image](https://github.com/user-attachments/assets/0bc26c7c-89da-4ffa-a3ab-402861564910)

### 패킷 명세서

![Image](https://github.com/user-attachments/assets/9dcc74ae-7def-4891-9073-f79fe56c754b)
