import ConversationModel from '../model/ConversationModel.js';
import ChatGPT from '../model/ChatGPTModel.js';
import ChatGPTUnofficial from '../model/ChatGPTUnofficialModel.js';
import ConversationConstant from '../constant/ConversationConstant.js';
import ChatGPTOfficial from '../model/ChatGPTOfficialModel.js';
import * as dotenv from 'dotenv';
dotenv.config();

const DEFAULT_ROLE_PLAY_INTRODUCTION = ConversationConstant.DEFAULT_ROLE_PLAY_INTRODUCTION;
const DEDAULT_BOT_NAME = ConversationConstant.DEDAULT_BOT_NAME;
const USE_MODEL = process.env.USE_MODEL;

class ConversationService {
    constructor() {
        this.conversations = {};
    }

    // return chatGPT Model for this conversation id
    getChatGPTModel(conversationId, promptPrefix = DEFAULT_ROLE_PLAY_INTRODUCTION) {
        if (!this.conversations[conversationId]) {
            switch (USE_MODEL) {
                case 'proxy':
                    console.log('Using chatgpt-unofficial proxy model');
                    this.conversations[conversationId] = new ChatGPTUnofficial();
                    break;
                case 'official':
                    console.log('Using chatgpt-official model');
                    this.conversations[conversationId] = new ChatGPTOfficial();
                    break;
                default:
                    console.log('Using waylaid model');
                    this.conversations[conversationId] = new ChatGPT(conversationId, promptPrefix, DEDAULT_BOT_NAME);
                    break;
            }
        }

        return this.conversations[conversationId];
    }

    // chat with ChatGPT Model
    async chat(conversationId, message, userLabel) {
        if (!ConversationModel.getConversationById(conversationId)) {
            await ConversationModel.createConversation(conversationId, DEFAULT_ROLE_PLAY_INTRODUCTION);
        }

        let conversationInfo = ConversationModel.getConversationById(conversationId);
        let chatGPTConversationInfo = {};

        // Assign before data of conversation
        if (conversationInfo.chatgpt_parent_message_id) {
            chatGPTConversationInfo = {
                conversationId: conversationInfo.chatgpt_conversations_id,
                parentMessageId: conversationInfo.chatgpt_parent_message_id,
                rolePlay_introduction: conversationInfo.roleplay_introduction
            };
        }

        const ChatGPTClient = chatGPTConversationInfo ? 
            this.getChatGPTModel(conversationId, chatGPTConversationInfo.rolePlay_introduction) : 
            this.getChatGPTModel(conversationId);

        console.log(`${userLabel}: ${message}`);
        const response = await ChatGPTClient.chat(message, userLabel, chatGPTConversationInfo);

        if (response.response) {
            ConversationModel.updateConversationParentMessageId(
                conversationId,
                response.conversationId,
                response.messageId
            );
        }

        return response.response;
    }
}

export default new ConversationService;
