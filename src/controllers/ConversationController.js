import ConversationService from "../service/ConversationService.js";

class ConversationController {
    async chat(req, res, next) {
        ConversationService.chat(req.body.conversationId, req.body.message, req.body.fromUser)
            .then(response => {
                res.json({
                    message: response
                });
            });
    }

    setConversationPrompt(req, res) {
        ConversationService.setConversationPrompt(req.body.conversationId, req.body.newPrompt)
            .then(() => {
                res.send(true);
            });
    }
}

export default new ConversationController;
