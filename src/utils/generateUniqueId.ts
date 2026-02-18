// idGenerator.js
import { v4 as uuidv4 } from 'uuid';

export function generateUniqueId() {
  return uuidv4(); // e.g., "3f29c6d6-ecb2-45a5-b65f-981f38ce4c4d"
}
