import Authenticator from "openai-authenticator";

export default getOpenAIKey = async () => {
    const authenticator = new Authenticator();
    const openAIKey = await authenticator.login(process.env.CHATGPT_USERNAME, process.env.CHATGPT_PASSWORD);

    return openAIKey;
}
