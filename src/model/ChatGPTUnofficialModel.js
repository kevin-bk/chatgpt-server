import { ChatGPTUnofficialProxyAPI } from 'chatgpt'
import * as dotenv from 'dotenv';
dotenv.config();

class ChatGPTUnofficial {
    constructor() {
        this.chatGptClient = new ChatGPTUnofficialProxyAPI({
            accessToken: process.env.OPENAI_PLUS_ACCESS_TOKEN,
            apiReverseProxyUrl: process.env.PROXY_SERVER
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

export default ChatGPTUnofficial;
