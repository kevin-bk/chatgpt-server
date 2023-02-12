import { ChatGPTClient } from '@waylaidwanderer/chatgpt-api';
import { KeyvFile } from 'keyv-file';
import * as dotenv from 'dotenv';
dotenv.config();

class ChatGPT {
    constructor(conversationId, promptPrefix, chatGptLabel) {
        const clientOptions = {
            // (Optional) Support for a reverse proxy for the completions endpoint (private API server).
            // Warning: This will expose your `openaiApiKey` to a third-party. Consider the risks before using this.
            reverseProxyUrl: 'https://chatgpt.pawan.krd/api/completions', // or https://chat.duti.tech/completions
            // (Optional) Parameters as described in https://platform.openai.com/docs/api-reference/completions
            modelOptions: {
                // You can override the model name and any other parameters here.
                model: process.env.CHATGPT_MODEL,
            },
            // (Optional) Set custom instructions instead of "You are ChatGPT...".
            promptPrefix: promptPrefix,
            // (Optional) Set a custom name for the user
            // userLabel: 'User',
            // (Optional) Set a custom name for ChatGPT
            chatGptLabel: chatGptLabel,
            // (Optional) Set to true to enable `console.debug()` logging
            // debug: false,
        };

        const cacheOptions = {
            // Options for the Keyv cache, see https://www.npmjs.com/package/keyv
            // This is used for storing conversations, and supports additional drivers (conversations are stored in memory by default)
            // For example, to use a JSON file (`npm i keyv-file`) as a database:
            store: new KeyvFile({ filename: `./src/database/caches/${conversationId}-cache.json` }),
        };

        this.chatGptClient = new ChatGPTClient(
            process.env.OPENAI_ACCESS_TOKEN,
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
                response: 'hmm'
            };
        }
    }
}

export default ChatGPT;
