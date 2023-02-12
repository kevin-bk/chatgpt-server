import ConversationController from '../controllers/ConversationController.js';

export default function route(app) {
    app.use('/conversation/chat', ConversationController.chat);
}
