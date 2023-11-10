import ConversationController from '../controllers/ConversationController.js';

export default function route(app) {
    app.use('/conversation/chat', ConversationController.chat);
    app.use('/conversation/setPrompt', ConversationController.setConversationPrompt);
}
