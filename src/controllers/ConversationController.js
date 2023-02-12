import ConversationService from "../service/ConversationService.js";

class ConversationController {
    async chat(req, res, next) {
        ConversationService.chat(req.body.conversationId, req.body.message, req.body.userLabel)
            .then(response => {
                res.json({
                    message: response
                });
            });
    }
}

export default new ConversationController;
