export const PACKET_TYPE_BYTE = 2;
export const PAYLOAD_LENGTH_BYTE = 4;

export const PACKET_TYPE = {
    // 첫 접속 
    C_LOGIN_REQUEST : 1001,
    
    // 클릭 이벤트 
    C_CLICK_REQUEST : 2001,

    // 에러
    S_ERROR_NOTIFICATION : 5001,
}