import ConversationModel from '../model/ConversationModel.js';
import AssistantModel from '../model/AssistantModel.js';
import ConversationConstant from '../constant/ConversationConstant.js';
import * as dotenv from 'dotenv';
dotenv.config();

const DEFAULT_ROLE_PLAY_INTRODUCTION = ConversationConstant.DEFAULT_ROLE_PLAY_INTRODUCTION;

class AssistantService {
    constructor() {
        this.assistants = {};
    }

    // chat with ChatGPT Model
    async chat(conversationId, message, userLabel) {
        let Assistant;

        if (!this.assistants[conversationId]) {
            let conversationInfo = ConversationModel.getConversationById(conversationId);
            let assistantId = (conversationInfo && conversationInfo.assistant_id) ?
                conversationInfo.assistant_id : null;

            let threadId = (conversationInfo && conversationInfo.thread_id) ?
                conversationInfo.thread_id : null;

            Assistant = new AssistantModel(assistantId, threadId);
            assistantId = await Assistant.getAssistantId();
            threadId = await Assistant.getThreadId();

            if (conversationInfo) {
                ConversationModel.updateConversationAssistant(conversationId, assistantId, threadId);
            } else {
                ConversationModel.createConversation(
                    conversationId,
                    DEFAULT_ROLE_PLAY_INTRODUCTION,
                    assistantId,
                    threadId
                );
            }

            this.assistants[conversationId] = Assistant;
        } else {
            Assistant = this.assistants[conversationId];
        }

        return await Assistant.chat(message, userLabel);
    }
}

export default new AssistantService;
