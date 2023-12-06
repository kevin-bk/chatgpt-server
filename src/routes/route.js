import ConversationController from '../controllers/ConversationController.js';
import AssistantController from '../controllers/AssistantController.js';

export default function route(app) {
    app.use('/conversation/chat', ConversationController.chat);
    app.use('/conversation/setPrompt', ConversationController.setConversationPrompt);
    app.use('/assistant/chat', AssistantController.chat);
}
