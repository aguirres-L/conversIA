/**
 * Subcolección: conversations
 * Ref: arquitectura/firebase/conversations.md
 */

export * from "./conversationsConfig.js";
export {
  conversationRef,
  conversationsRef,
  getConversation,
  listConversations,
  createConversation,
  updateConversation,
  updateConversationHandoff,
  updateLastMessage,
} from "./conversationsService.js";
