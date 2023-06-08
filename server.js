import {
    Configuration,
    OpenAIApi,
    ChatCompletionRequestMessageRoleEnum,
} from "openai";// OpenAIのライブラリをインポートします。
import express from 'express'; // expressをインポートします。
import bodyParser from 'body-parser'; // body-parserをインポートします。

// expressを初期化します。
const app = express();
// body-parserを初期化します。
app.use(bodyParser.text());

// OpenAIのAPIを利用するための設定を行います。
const configuration = new Configuration({
    organization: "org-O3dmbCRpQmzrQHvcwVlAMI0I",
    apiKey: process.env.OPENAI_API_KEY,
});

// 環境変数OPENAI_API_KEYが設定されているかを確認します。
if (process.env.OPENAI_API_KEY === undefined) {
    console.log("環境変数OPENAI_API_KEYが設定されていません。");
}

// 環境変数確認
console.log(process.env.OPENAI_API_KEY);

// 初期化
const openai = new OpenAIApi(configuration);
//const response = await openai.listEngines();

// クライアントからのリクエストを受け取り、OpenAIのAPIを利用して応答を返します。
app.post('/chat', async (req, res) => {
    const content = req.body;
    console.log(content);
    const response = await openai.createChatCompletion({
        model: "gpt-4",
        messages: [{ role: ChatCompletionRequestMessageRoleEnum.User, content }],
    });
    console.log(response.data.choices[0].message?.content);
    res.send(response.data.choices[0].message?.content);
}, (error) => {
    console.log(error);


    //  stop: null,
    //   temperature: 0.7
});

// 静的ファイル（この場合はHTML）を提供するための設定です。
app.use(express.static('public'));

// サーバーを起動します。
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server running on port ${port}`));

// ルートパスへのリクエストに対してindex.htmlを返すように設定します。
app.get('/', (req, res) => res.sendFile(__dirname + '/public/index.html')); 
