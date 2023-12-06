import AssistantService from "../service/AssistantService.js";

class AssistantController {
    async chat(req, res, next) {
        AssistantService.chat(req.body.conversationId, req.body.message, req.body.fromUser)
            .then(response => {
                res.json(response);
            });
    }
}

export default new AssistantController;
