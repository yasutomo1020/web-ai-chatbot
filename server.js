//import { Configuration, OpenAIApi } from "openai";
import {
    Configuration,
    OpenAIApi,
    ChatCompletionRequestMessageRoleEnum,
} from "openai";
import express from 'express'; // expressをインポートします。
import bodyParser from 'body-parser'; // body-parserをインポートします。

const app = express();
app.use(bodyParser.text());
//app.use(express.text()); // JSONのパースを有効にします。
const configuration = new Configuration({
    organization: "org-O3dmbCRpQmzrQHvcwVlAMI0I",
    apiKey: process.env.OPENAI_API_KEY,
});
if (process.env.OPENAI_API_KEY === undefined) {
    console.log("環境変数OPENAI_API_KEYが設定されていません。");
}
console.log(process.env.OPENAI_API_KEY);
const openai = new OpenAIApi(configuration);
//const response = await openai.listEngines();

app.post('/chat', async (req, res) => {
    const content = req.body;
    console.log(content);
    const response = await openai.createChatCompletion({
        model: "gpt-4",
        messages: [{ role: ChatCompletionRequestMessageRoleEnum.User, content }],
    });
    console.log(response.data.choices[0].message?.content);
    res.send(response.data.choices[0].message?.content);
    //  stop: null,
    //   temperature: 0.7
});

app.use(express.static('public')); // 静的ファイル（この場合はHTML）を提供するための設定です。
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server running on port ${port}`));
app.get('/', (req, res) => res.sendFile(__dirname + '/public/index.html')); // ルートパスへのリクエストに対してindex.htmlを返すように設定します。
