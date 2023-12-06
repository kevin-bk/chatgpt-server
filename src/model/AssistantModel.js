import OpenAI from 'openai';
import * as dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const ASSISTANT_ID = process.env.ASSISTANT_ID;

class Assistant {
    constructor(assistantId = null, threadId = null) {
        this.threadId = threadId;
        this.assistantId = assistantId ? assistantId : ASSISTANT_ID;

        this.asisstant = openai.beta.assistants.retrieve(ASSISTANT_ID);
        if (threadId) {
            this.thread = openai.beta.threads.retrieve(threadId);
        } else {
            this.thread = openai.beta.threads.create();
        }
    }

    async getThreadId() {
        return (await this.thread).id;
    }

    async getAssistantId() {
        return (await this.asisstant).id;
    }

    async chat(message, userLabel) {
        const threadId = (await this.thread).id;
        const assistantId = (await this.asisstant).id;

        // Pass in the user message into the existing thread
        await openai.beta.threads.messages.create(threadId, {
            role: 'user',
            content: `${userLabel}: ${message}`,
        });

        // Use runs to wait for the assistant response and then retrieve it
        const run = await openai.beta.threads.runs.create(threadId, {
            assistant_id: assistantId,
        });

        let runStatus = await openai.beta.threads.runs.retrieve(
            threadId,
            run.id
        );

        // Polling mechanism to see if runStatus is completed
        // This should be made more robust.
        while (runStatus.status !== 'completed') {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
        }

        // Get the last assistant message from the messages array
        const messages = await openai.beta.threads.messages.list(threadId);

        // Find the last message for the current run
        const lastMessageForRun = messages.data
            .filter(
                (message) => message.run_id === run.id && message.role === 'assistant'
            )
            .pop();

        // If an assistant message is found, return it
        if (lastMessageForRun) {
            return {
                message: lastMessageForRun.content[0].text.value,
                thread_id: threadId,
                assistant_id: assistantId
            }
        } else {
            return {
                message: 'Something went wrong. Please try again.',
                thread_id: threadId,
                assistant_id: assistantId
            }
        }
    }
}

export default Assistant;
