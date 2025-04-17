import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(__dirname,'../../../.env');
const evnFile = fs.readFileSync(envPath, {encoding : 'utf-8'});

const env = {};
evnFile.split('\n').forEach((line) => {
    const [name, rest] = line.split('=');
    if (!name || name.length <= 1) return;

    // trim 공백 + \r 제거  
    const value = rest.trim().replace(/\r/g, '');

    // 환경변수를 env에 넣기  
    env[name.trim()] = value;
})

export const LOGIN_SERVER_HOST = env.LOGIN_SERVER_HOST || '0.0.0.0'
export const LOGIN_SERVER_PORT = env.LOGIN_SERVER_PORT || 5555;

export const EVENT_SERVER_HOST = env.EVENT_SERVER_HOST || '0.0.0.0'
export const EVENT_SERVER_PORT = env.EVENT_SERVER_PORT || 5556;