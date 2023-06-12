import {
    Configuration,
    OpenAIApi,
    ChatCompletionRequestMessageRoleEnum,
} from "openai";// OpenAIのライブラリをインポートします。
import fs from 'fs'; // fsをインポートします。


const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function uploadFile() {
    try {
        const f = await openai.createFile(
            fs.createReadStream("tune.jsonl"),
            "fine-tune"
        );
        console.log(`File ID ${f.data.id}`);
        return f.data.id;
    }
    catch (err) {
        console.log('err uploadfile: ', err);
    }
}
uploadFile();