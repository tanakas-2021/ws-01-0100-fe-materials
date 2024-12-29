
## バックエンド + Web API (Nest.js + TypeScript + MySQL + TypeORM)

下記、API仕様をもとに Web API を実装してください。

### API 仕様
https://nest-web-api.netlify.app/api/v1/spec

### 技術スタック

- Nest.js
- MySQL

## 認証について

/auth/signup でユーザ登録
/auth/login でログインで認証を行うように実装してください。

それぞれのエンドポイントでは jwt トークンを発行して各エンドポイントでは、
Authorization ヘッダー内のトークンを検証して、トークンが不正な場合は 401 Unauthorized で返すように実装してください。

## 課題で身に着けること

- データベースの基本
- MVC(Model View Controller)
- SQLでのCRUD
- ORMの基礎
- ORMでのCRUD
- マイグレーションとシード
- JWTを使用した認証・認可
- Nest.jsを利用したWeb APIの実装

## 課題の進め方

#### 1. 課題の最終ゴールを確認する

デモを確認したり、メンターに確認してこの課題で達成すべき内容を確認してください。

#### 2. 必要な概念を確認する

課題でやる全体像を把握した上で課題に必要な概念を学んで取り組んでください。
この課題ではリポジトリをフォークするのではなく、自分のリポジトリを作成して取り組んでください。

[参考資料](./docs/documents.md)

#### 3. 実装に取り組む

実装量が多いので適切なタイミングでメンターに方向性のチェックを依頼するようにしてください。

Hint: 方向性のチェックを行う際は、プルリクエストを使用して現時点のコードを共有しながら進めましょう。

- [プルリクエストを出す上での注意点](https://lab.ver-1-0.net/posts/pr-points/)
- [動画|プルリクエストを作るときに考えること。各ステップでのNG行動と意識すること](https://www.youtube.com/watch?v=bFSHeY7_Igw))

#### 4. 実装が完了したら、Github Pages にアップロードする。

#### 5. メンターに最終レビューを依頼する

