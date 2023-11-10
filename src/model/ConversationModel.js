import db from '../data/db.js';
import ConversationConstant from '../constant/ConversationConstant.js';

const CONVERSATION = ConversationConstant.CONVERSATION;

class ConversationModel {
    // create new conversation
    createConversation(conversationId, rolePlayIntroduction = ConversationConstant.DEFAULT_ROLE_PLAY_INTRODUCTION) {
        const newConversation = {
            conversations_id: conversationId,
            rolePlay_introduction: rolePlayIntroduction
        };

        db.get(CONVERSATION).push(newConversation).write();
    }

    // Get all conversation in database
    getAllConversations() {
        return db.get(CONVERSATION).cloneDeep().value();
    }

    // Get conversation by id
    getConversationById(conversationId) {
        return db.get(CONVERSATION).cloneDeep().find({ conversations_id: conversationId }).value();
    }

    // Update chatGPT parent message id in conversation
    updateConversationParentMessageId(conversationId, chatGPTConversationId, newParentMessageId) {
        db.get(CONVERSATION)
            .find({ conversations_id: conversationId })
            .assign({ 
                chatgpt_conversations_id: chatGPTConversationId,
                chatgpt_parent_message_id: newParentMessageId
            })
            .write();
    }

    // set prompt in conversation
    setConversationPrompt(conversationId, newPrompt) {
        db.get(CONVERSATION)
            .find({ conversations_id: conversationId })
            .assign({
                rolePlay_introduction: newPrompt,
                chatgpt_conversations_id: null,
                chatgpt_parent_message_id: null
            })
            .write();
    }
}

export default new ConversationModel;
