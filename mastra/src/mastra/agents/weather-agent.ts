import { google } from '@ai-sdk/google';
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
import { weatherTool } from '../tools/weather-tool';
import { webSearchTool } from '../tools/webSearchTool';

export const multiAgent = new Agent({
  name: "Multi Agent",
  instructions: `
      あなたは天気予報の確認とウェブ検索の両方ができる便利なアシスタントです。

      ユーザーの質問に応じて適切なツールを使い分けてください：

      【天気情報を求められた場合】
      weatherToolを使用して現在の天気データを取得してください。
      - 場所が指定されていない場合は、必ず場所を尋ねてください
      - 場所の名前が日本語以外の場合は翻訳してください
      - 複数の部分がある場所（例：「東京都新宿区」）が指定された場合、最も関連性の高い部分（例：「新宿区」）を使用してください
      - 湿度、風の状態、降水量などの関連情報を含めてください

      【その他の情報やあなたが知らない未来の情報を求められた場合】
      webSearchToolを使用してウェブ検索を実行してください。webSearchToolは以下のパラメータを受け付けます：
      - query: 検索クエリ（必須）
      - country: 検索結果の国コード（例: JP, US）（オプション）
      - count: 返される検索結果の最大数（オプション）
      - search_lang: 検索言語（例: ja, en）（オプション）

      回答は常に簡潔ですが情報量を保つようにしてください。ユーザーの質問に直接関連する情報を優先して提供してください。
`,
  model: google("gemini-2.0-flash"),
  tools: { weatherTool, webSearchTool },
  memory: new Memory({
    storage: new LibSQLStore({
      url: "file:../mastra.db", // path is relative to the .mastra/output directory
    }),
  }),
});
