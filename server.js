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
const sessions = {};

app.post('/chat', async (req, res) => {
    // ユーザーのセッションIDを取得します。セッションIDはクライアントから送られてくるものとします。
    const sessionId = req.headers['x-session-id'];
    // ユーザーのメッセージを取得します。
    const userMessage = req.body;
    console.log('セッションID：' + sessionId);
    console.log('ユーザーメッセージ：' + userMessage);

    // 以前のメッセージの履歴を取得します。
    let history = sessions[sessionId];
    console.log(history);
    if (!history) {
        history = [];
        sessions[sessionId] = history;
    }

    // ユーザーのメッセージを履歴に追加します。
    history.push({ role: ChatCompletionRequestMessageRoleEnum.User, content: userMessage });

    const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: history,
    });

    // AIの応答を履歴に追加します。
    history.push({ role: ChatCompletionRequestMessageRoleEnum.System, content: response.data.choices[0].message?.content });

    console.log(response.data.choices[0].message?.content);
    res.send(response.data.choices[0].message?.content);
}, (error) => {
    console.log(error);
});


// 静的ファイル（この場合はHTML）を提供するための設定です。
app.use(express.static('public'));

// サーバーを起動します。
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server running on port ${port}`));

// ルートパスへのリクエストに対してindex.htmlを返すように設定します。
app.get('/', (req, res) => res.sendFile(__dirname + '/public/index.html')); 
