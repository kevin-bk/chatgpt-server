import ConversationModel from '../model/ConversationModel.js';
import ChatGPT from '../model/ChatGPTModel.js';
import ConversationConstant from '../constant/ConversationConstant.js';
import * as dotenv from 'dotenv';
import fs from "fs";
dotenv.config();

const DEFAULT_ROLE_PLAY_INTRODUCTION = ConversationConstant.DEFAULT_ROLE_PLAY_INTRODUCTION;
const DEDAULT_BOT_NAME = ConversationConstant.DEDAULT_BOT_NAME;

class ConversationService {
    constructor() {
        this.conversations = {};
    }

    // return chatGPT Model for this conversation id
    getChatGPTModel(conversationId, promptPrefix = DEFAULT_ROLE_PLAY_INTRODUCTION) {
        if (!this.conversations[conversationId]) {
            console.log(`Create new AI model for conversation ${conversationId} with prompt: ${promptPrefix}`);
            this.conversations[conversationId] = new ChatGPT(conversationId, promptPrefix, DEDAULT_BOT_NAME);
        }

        return this.conversations[conversationId];
    }

    async setConversationPrompt(conversationId, newPrompt) {
        // delete AI model from cache
        if (this.conversations[conversationId]) {
            delete this.conversations[conversationId];
        }

        // set new prompt and save to db
        await ConversationModel.setConversationPrompt(conversationId, newPrompt);

        fs.unlink(`./src/database/caches/${conversationId}-cache.json`, (err) => {
            if (err) {
                console.log(err);
            }
        });
    }

    // chat with ChatGPT Model
    async chat(conversationId, message, userLabel) {
        if (!ConversationModel.getConversationById(conversationId)) {
            console.log(`Create new conversation with id: ${conversationId}`);
            await ConversationModel.createConversation(conversationId, DEFAULT_ROLE_PLAY_INTRODUCTION);
        }

        let conversationInfo = ConversationModel.getConversationById(conversationId);
        let chatGPTConversationInfo = {};

        // Assign before data of conversation
        if (conversationInfo.chatgpt_parent_message_id != 0) {
            chatGPTConversationInfo = {
                conversationId: conversationInfo.chatgpt_conversations_id,
                parentMessageId: conversationInfo.chatgpt_parent_message_id,
                rolePlay_introduction: conversationInfo.rolePlay_introduction
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
