### デプロイ先
https://nextjs-sandbox-5zhpjhy9e-wakizaka24s-projects.vercel.app

### Nodeのバージョン合わせ(Mac)
```
% brew upgrade nodebrew
% brew install nodebrew

% nodebrew -v          
nodebrew 1.2.0

Nodebrewのパスを通す(Mac)
% nodebrew setup
% vi ~/.zshrc
export PATH=$HOME/.nodebrew/current/bin:$PATH
% source ~/.zshrc
```

### 対象バージョンのインストール(Mac)
```
インストール可能なNode.js一覧
% nodebrew ls-remote
対象のNode.jsをインストールする
% nodebrew install-binary v22.9.0
ローカルのインストール一覧
% nodebrew list
使用するNodeを切り替える(今回は最新版にする)
% nodebrew use v22.9.0
% nodebrew ls
% node -v
v22.9.0
```

### Nodeのバージョン合わせ(Windows)
```
ガイド
https://zenn.dev/y_2_k/articles/e419bcf729e82d

最新版のnvm-setup.zipをダウンロードする
https://github.com/coreybutler/nvm-windows/releases

インストール可能なNode.js一覧
> nvm ls-remote
対象のNode.jsをインストールする
> nvm install v22.9.0
使用するNodeを切り替える(今回は最新版にする)
> nvm use v22.9.0
```

### プロジェクト作成(プロジェクトチェックアウト時はスキップ)
```
% cd ~/pc_data/project
% npx create-next-app@latest nextjs_sandbox
✔ Would you like to use TypeScript? … No / Yes -> Yes
✔ Would you like to use ESLint? … No / Yes -> No
✔ Would you like to use Tailwind CSS? … No / Yes -> No
✔ Would you like to use `src/` directory? … No / Yes -> Yes
✔ Would you like to use App Router? (recommended) … No / Yes -> No
✔ Would you like to customize the default import alias (@/*)? … No / Yes -> No
```

### プロジェクトチェックアウト時(プロジェクト作成時はスキップ)
```
% cd ~/pc_data/project/nextjs_sandbox 
% npm install
```

### 実行方法
```
% cd ~/pc_data/project/nextjs_sandbox 
% npm run dev
```

### デバック設定
```
% cd ~/pc_data/project/nextjs_sandbox 
% vi package.json
  "scripts": {
    "debug": "set NODE_OPTIONS='--inspect' && next dev",

% cd ~/pc_data/project/nextjs_sandbox 
% mkdir .vscode
% vi .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
      {
          "type": "chrome",
          "request": "launch",
          "name": "Next.js Client",
          "url": "http://localhost:3000/",
          "webRoot": "${workspaceFolder}",
          "resolveSourceMapLocations": [
            "${workspaceFolder}/**",
            "!**/node_modules/**"
          ]
      }
  ],
}
```

### デバック方法
```
% cd ~/pc_data/project/nextjs_sandbox 
% npm run debug

VSCodeの実行ボタンを押す。
```

### Vercelサービスの設定
```
1.Vercelサービスにアクセスする。
https://vercel.com

2.Start Deployingボタンを押す。
3.Coutinue with Githubボタンを押す。
4.Githubアカウントでサインインする。
5.Authorize Vercelボタンを押す。
6.Import Repositoryボタンを押す。
7.Import Git Repositoryで対象のリポジトリをインポートする。
8.Deployボタンを押す。
9.Continue to Dashboardボタンを押す。
10.Overview>Projects>nextjs-sandbox>Settings>Domains>Editを押す。
11.Git BranchをGitからPush時に自動デプロイしたいブランチに変更する。
```

### Firestoreのサービスの設定
```
1.Googleアカウントを作成し、Firebaseサービスにアクセスする。
https://console.firebase.google.com

2.Firebaseプロジェクトを作成する。
3.設定ボタン>アプリの追加からWebアプリを追加する。
4.設定情報をコピーする。
const firebaseConfig = {
  apiKey: "AIzaSyBJX6eFSihU3tXiE7-cJHiu3j1WBbmGQVo",
  authDomain: "firestore-6adc1.firebaseapp.com",
  projectId: "firestore-6adc1",
  storageBucket: "firestore-6adc1.appspot.com",
  messagingSenderId: "881730943789",
  appId: "1:881730943789:web:78b1421e0becbb662cb1a4",
  measurementId: "G-5B801G3ENN"
};

5.構築>Firestore Databaseを選択する。
6.データベースを本番用で作成する。
7.データタブを選択し、コレクションにmark_game、そのドキュメントにmark_game_stateを追加する。
8.ルールタブを選択し、ルールを設定する。
(セキュリティ上誰でも閲覧、改ざんできるデータとして利用すること)
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}

(Firebaseサービスに認証したユーザーのみアクセス可能にする場合は以下)
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}

9.プロジェクトでnpmでFirebaseをインストールする。
% npm install firebase
```