import { ChatGPTClient } from '@waylaidwanderer/chatgpt-api';
import { KeyvFile } from 'keyv-file';
import * as dotenv from 'dotenv';
dotenv.config();

// use @waylaidwanderer/chatgpt-api package
class ChatGPT {
    constructor(conversationId, promptPrefix, chatGptLabel) {
        const clientOptions = {
            modelOptions: {
                model: process.env.CHATGPT_MODEL
            },
            promptPrefix: promptPrefix,
            chatGptLabel: chatGptLabel
        };

        const cacheOptions = {
            store: new KeyvFile({ filename: `./src/database/caches/${conversationId}-cache.json` })
        };

        this.chatGptClient = new ChatGPTClient(
            process.env.OPENAI_API_PLUS_KEY,
            clientOptions,
            cacheOptions
        );
    }

    async chat(message, userLabel, conversationInfo = {}) {
        try {
            this.chatGptClient.userLabel = userLabel;
            const response = await this.chatGptClient.sendMessage(message, conversationInfo);

            return response; // { response: 'Hi! How can I help you today?', conversationId: '...', messageId: '...' }
        } catch(e) {
            console.log(e);

            return {
                response: 'Some thing went wrong, please contact Kevin.'
            };
        }
    }
}

export default ChatGPT;
