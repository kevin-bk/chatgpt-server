import { ChatGPTAPI } from 'chatgpt'
import * as dotenv from 'dotenv';
dotenv.config();

class ChatGPTOfficial {
    constructor() {
        this.chatGptClient = new ChatGPTAPI({
            apiKey: process.env.OPENAI_API_PLUS_KEY
        });
    }

    async chat(message, userLabel = 'User', conversationInfo = {}) {
        try {
            const response = await this.chatGptClient.sendMessage(message, conversationInfo);

            return {
                response: response.text,
                conversationId: response.conversationId,
                messageId: response.id
            }; // { response: 'Hi! How can I help you today?', conversationId: '...', messageId: '...' }
        } catch (e) {
            console.log(e);

            return {
                response: 'hmm'
            };
        }
    }
}

export default ChatGPTOfficial;
