export const USERS_QUERIES = {
    CREATE_USER: 'INSERT INTO users (name, address) VALUES (?,?)',
    UPDATE_COUNT: 'UPDATE users SET click_count = ?, last_click = ? WHERE id = ?',
    FIND_USER: 'SELECT id FROM users WHERE name = ?',
    GET_WINNER: 'SELECT * FROM users WHERE click_count > 0 ORDER BY click_count DESC, last_click ASC LIMIT 1'
}