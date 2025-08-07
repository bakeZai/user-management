export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
}

let users: User[] = [
  { id: '1', name: 'Admin', email: 'admin@example.com', password: 'admin123', role: 'admin' },
  { id: '2', name: 'User', email: 'user@example.com', password: 'user123', role: 'user' },
]; // Тестовые пользователи

export function getUsers() {
  return [...users]; // Копия для чтения
}

export function getUsersRef() {
  return users; // Ссылка для мутации
}


export function addUser(user: User) {
  users.push(user);
}



export function updateUser(user: User): void {
  const index = users.findIndex((u) => u.id === user.id);
  if (index !== -1) users[index] = user;
}

export function deleteUser(id: string): void {
  users = users.filter((u) => u.id !== id);
}