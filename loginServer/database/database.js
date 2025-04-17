import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sqlite from 'node:sqlite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 데이터베이스 열기 (없으면 새로 생성) 
export const db = new sqlite.DatabaseSync('./database.sqlite',{ open: true });

const executeSqlFile = async (filePath) => {
    // 지정 경로의 파일을 읽음
    const sql = fs.readFileSync(filePath, 'utf8');

    // ';' 기준으로 배열 생성 후 존재하는 쿼리 부분만 'filter' 처리
    const queries = sql
        .split(';')
        .map((query) => query.trim())
        .filter((query) => query.length > 0);

    // 쿼리 실행
    for (const query of queries)
        db.exec(query);
};

export const createSchemas = async () => {
    const sqlDir = path.join(__dirname, './sql');
    try {
        await executeSqlFile(path.join(sqlDir, 'database.sql'));
        console.log('DB 테이블이 성공적으로 생성되었습니다.');
    } catch (error) {
        console.error('DB 테이블 생성 중 오류가 발생했습니다: ', error);
    }
};