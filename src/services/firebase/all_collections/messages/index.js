/**
 * Subcolección: messages
 * Ref: arquitectura/firebase/messages.md
 */

export * from "./messagesConfig.js";
export {
  messageRef,
  messagesRef,
  getMessage,
  listMessages,
  addMessage,
  setMessage,
} from "./messagesService.js";
