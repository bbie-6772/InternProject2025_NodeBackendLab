export const USERS_QUERIES = {
    CREATE_USER: 'INSERT INTO users (name, password) VALUES (?,?)',
    FIND_USER: 'SELECT id FROM users WHERE name = ?'
}