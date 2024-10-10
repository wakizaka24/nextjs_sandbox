### ソース変更Step1
```
1. nextjs_sandbox/src/pages/index.tsx
--- 中身を上書き ---
import Head from "next/head";

const Index = () => {
    return <>
        <Head>
            <title>Hello React</title>
        </Head>
        <h3>Hello React</h3>

        <a href='./mark-game-v1'>まるばつゲーム(useStateで状態管理)</a><br />
        <a href='./mark-game-v2'>まるばつゲーム(useReducerで状態管理)</a><br />
        
        
    </>
  };
  
export default Index;
--- 中身を上書き ---
```

2. nextjs_sandbox/src/styles
```
フォルダごと削除する
```

3. nextjs_sandbox/src/pages/globals.css
```
--- 新規追加する ---
/* ダークモード */
@media (prefers-color-scheme: dark) {
    :root {
        --background: #0a0a0a;
        --foreground: #ededed;
    }
    html {
        color-scheme: dark;
    }
}

* {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
}
  
body {
    margin: 20px;
    display: flex;
    flex-direction: row;
}

p.desc {
    font-size: 8px;
}

div.small {
    font-size: 11px;
}
--- 新規追加する ---
```

4. nextjs_sandbox/src/pages/_app.tsx
```
--- 一部変更する ---
import "./globals.css"; // ここを変更する
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
--- 一部変更する ---
```

5. nextjs_sandbox/src/pages/_document.tsx
```
--- 一部変更する ---
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  // langをjpにする
  return (
    <Html lang="ja">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
--- 一部変更する ---
```

### ソース変更Step2
1. nextjs_sandbox/src/pages/mark-game-v1
```
フォルダを作成する
```

2. nextjs_sandbox/src/pages/mark-game-v1/index.tsx
```
--- 新規追加する ---
import { MarkGame } from "@/components/templates/MarkGame/MarkGameVersion1";

const MaskGameV1 = () => {
  return <>
    <MarkGame />
    <br />
    <a href='../'>戻る</a>
  </>
};

export default MaskGameV1;
--- 新規追加する ---
```

3. nextjs_sandbox/src/components
```
フォルダを作成する
```

4. nextjs_sandbox/src/components/templates
```
フォルダを作成する
```

5. nextjs_sandbox/src/components/templates/MarkGame
```
フォルダを作成する
```

6. nextjs_sandbox/src/components/templates/MarkGame/MarkGameVersion1.tsx
```
--- 新規追加する ---
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { GameBoard } from "@/components/ormanisms/MarkGameBoard";
import { GameStatus } from '@/components/ormanisms/MarkGameStatus';
import { GameState, Player, markGameTitle, isCellEmpty, getWinner } from './features';
import style from './style.module.css';

var initEffect = false;

export const MarkGame: React.FC = () => {
    var initGameState = {
        boardWidth: 3,
        boardData: ['', '', '', '', '', '', '', '', ''],
        currentPlayer: Player.Maru,
        winner: null,
        draw: false
    };
    // [!] useStateで行っていることは何か。
    // 
    const [gameState, setGameState] = useState<GameState>(initGameState);

    // [!] useEffectで行っているは何か。
    // 
    useEffect(() => {
        if (initEffect) {
            return;
        }
        initEffect = true;
        console.debug('useEffect!');
    }, []);

    return <>
        <Head>
            {// [!] タグの中の{}でHTML出力時に何が出力されるか。
             // 
            }
            <title>{markGameTitle()}</title>
        </Head>
        <p className='desc'>MarkGameVersion1.tsx</p>
        まるばつゲーム(useStateで状態管理)
        {// [!] classNameのfieldはどこに記載があるのか。
         // 
        }
        <div className={style.field}>
            {// [!] GameBoardタグの属性でTypeScriptから渡す値の型の指定方法
             // 
            }
            <GameBoard gameState={gameState} onGameBoardClick={
                (index) => {
                    console.debug('click index=' + index);
                    if (isCellEmpty(gameState, index) && gameState.winner == null) {
                        var boardData = gameState.boardData;
                        var currentPlayer = gameState.currentPlayer;
                        var boardWidth = gameState.boardWidth;
                        boardData[index] = currentPlayer;
                        if (currentPlayer == Player.Maru) {
                            currentPlayer = Player.Batsu;
                        } else {
                            currentPlayer = Player.Maru;
                        }
                        var winner = getWinner(gameState, index);
                        var draw = boardData.filter((cell)=>cell == '').length == 0;
                        setGameState({boardWidth, boardData, currentPlayer, winner, draw});                        
                    } else {
                        console.debug('invelid index!');
                    }
                }
            } />
            <GameStatus gameState={gameState} onGameResetClick={() => {
                setGameState(initGameState); 
            }} />
        </div>
    </>;
}
--- 新規追加する ---
```

7. nextjs_sandbox/src/components/templates/MarkGame/features.ts
```
--- 新規追加する ---
// [!] exportで何ができるのか。
// 
export enum Player {
    Maru = '⭕️',
    Batsu = '❌'
}

export interface GameState {
    boardWidth: number;
    boardData: string[];
    currentPlayer: Player;
    winner: Player | null;
    draw: boolean;
}

// [!] 変数にはどのような値が入っているのか
// 
export const markGameTitle = () => {
    return 'まるばつゲーム';
}

export function isCellEmpty(gameState: GameState, index: number) {
    return gameState.boardData[index] == '';
}

export function convertMarkGameCols(boardWidth: number, boardData: string[]) {
    // 各行の列ごとの値を格納した配列にする
    // ['1','2','3','4','5','6','7','8','9']
    // ↓
    // [['1','2','3'], ['4','5','6'], ['7','8','9']]
    var cols: Array<Array<string>> = [];
    for (var colIdx = 0; colIdx < boardWidth; colIdx++) {
        var col: Array<string> = [];
        for (var rowIdx = 0; rowIdx < boardWidth; rowIdx++) {
            col.push(boardData[colIdx * boardWidth + rowIdx]);
        }
        cols.push(col);
    }
    return cols;
}

export function getWinner(gameState: GameState, index: number) {
    var boardWidth = gameState.boardWidth;
    var boardData = gameState.boardData;
    var cols = convertMarkGameCols(boardWidth, boardData);
    var rowIdx = Math.floor(index / boardWidth);
    var colIdx = index % boardWidth;
    console.debug('rowIdx=' + rowIdx + ' colIdx=' + colIdx);
    console.debug(cols);
    var player = cols[rowIdx][colIdx];

    // 右下方向のチェック
    var currentRowIdx = 0;
    var currentColIdx = 0;
    while (currentRowIdx < boardWidth) {
        if (cols[currentRowIdx][currentColIdx] != player) {
            break;
        }

        currentRowIdx++;
        currentColIdx++;
    }
    var crossLine1 = currentRowIdx == boardWidth;

    // 左下方向のチェック
    currentRowIdx = 2;
    currentColIdx = 0;
    while (currentRowIdx >= 0) {        
        if (cols[currentRowIdx][currentColIdx] != player) {
            break;
        }

        currentRowIdx--;
        currentColIdx++;
    }
    var crossLine2 = currentRowIdx < 0;

    // 縦方向のチェック
    currentRowIdx = rowIdx;
    currentColIdx = 0;
    while (currentColIdx < boardWidth) {        
        if (cols[currentRowIdx][currentColIdx] != player) {
            break;
        }

        currentColIdx++;
    }
    var holizontalLine = currentColIdx == boardWidth;

    // 横方向のチェック
    currentRowIdx = 0;
    currentColIdx = colIdx;
    while (currentRowIdx < boardWidth) {
        if (cols[currentRowIdx][currentColIdx] != player) {
            break;
        }

        currentRowIdx++;
    }
    var varticalLine = currentRowIdx == boardWidth;

    var playerType = null;
    if (player == Player.Maru) {
        playerType = Player.Maru;
    } else if (player == Player.Batsu) {
        playerType = Player.Batsu;
    } 

    return crossLine1 || crossLine2 || holizontalLine || varticalLine
        ? playerType : null;
}
--- 新規追加する ---
```

8. nextjs_sandbox/src/components/templates/MarkGame/style.module.css
```
--- 新規追加する ---
.field {
    display: flex;
}
--- 新規追加する ---
```

9. nextjs_sandbox/src/components/ormanisms
```
フォルダを作成する
```

10. nextjs_sandbox/src/components/ormanisms/MarkGameBoard
```
フォルダを作成する
```

11. nextjs_sandbox/src/components/ormanisms/MarkGameBoard/index.ts
```
--- 新規追加する ---
export * from './MarkGameBoard';
--- 新規追加する ---
```

12. nextjs_sandbox/src/components/ormanisms/MarkGameBoard/MarkGameBoard.tsx
```
--- 新規追加する ---
import { GameState, convertMarkGameCols } from '@/components/templates/MarkGame/features';
import style from './style.module.css';

type SquareProps = {
    children: string,
    onSquareClick: Function
}

const Square: React.FC<SquareProps> = ({children, onSquareClick}) => {
    return (
        <td className={style.square} onClick={() => {onSquareClick();}}>
            {children}
        </td>
    )
}

export type MarkGameBoardProps = {
    gameState: GameState,
    onGameBoardClick: (index: number) => void;
}

export const GameBoard: React.FC<MarkGameBoardProps> = ({gameState, onGameBoardClick}) => {
    const boardWidth = gameState.boardWidth;
    var boardData = gameState.boardData;
    var cols = convertMarkGameCols(boardWidth, boardData);

    return <div>
        <p className='desc'>MarkGameBoard.tsx</p>
        <table>
        {
        // 各行を出力する
        cols.map((col, colIdx) =>
            <tbody key={'board-tbody-' + colIdx}>
            <tr key={'board-tr-' + colIdx}>
            {
            // 各行ごとの値を出力する
            col.map((cell, rowIdx) => 
                <Square key={'board-tr-' + colIdx * boardWidth + rowIdx} onSquareClick={
                    () => {onGameBoardClick(colIdx * boardWidth + rowIdx);}}>{cell}</Square>
            )}
            </tr>
            </tbody>
        )}
        </table>
    </div>;
}
--- 新規追加する ---
```

13. nextjs_sandbox/src/components/ormanisms/MarkGameBoard/style.module.css
```
--- 新規追加する ---
.square {
    border: 1px solid #999;
    height: 32px;
    width: 32px;
    text-align: center;
}
--- 新規追加する ---
```

14. nextjs_sandbox/src/components/ormanisms/MarkGameStatus
```
フォルダを作成する
```

15. nextjs_sandbox/src/components/ormanisms/MarkGameStatus/index.ts
```
--- 新規追加する ---
export * from './MarkGameStatus';
--- 新規追加する ---
```

16. nextjs_sandbox/src/components/ormanisms/MarkGameStatus/MarkGameStatus.tsx
```
--- 新規追加する ---
import { GameState, Player } from '@/components/templates/MarkGame/features';

export type MarkGameStatusProps = {
    gameState: MarkGameState,
    onGameResetClick: () => void;
}

export const GameStatus: React.FC<MarkGameStatusProps> = ({gameState, onGameResetClick}) => {
    var currentPlayer = gameState.currentPlayer;
    var winner = gameState.winner;
    var draw = gameState.draw;

    return <div>
        <p className='desc'>MarkGameStatus.tsx</p>
        <div className='small'>
            {// [!] タグの中で条件と&&でHTML出力がどうなるのか。
             // 
            winner == null && !draw
                && <>現在のプレイヤー：{currentPlayer == Player.Maru
                ? <>⭕️(まる)</> : <>❌(ばつ)</>}<br /></>}
            {winner != null && <>{winner}が勝ちました。<br /></>}
            <div onClick={() => {onGameResetClick();}}>リセット</div>
        </div>
    </div>;
}
--- 新規追加する ---
```

### ソース変更Step3
1. nextjs_sandbox/src/pages/mark-game-v2
```
フォルダを作成する
```

2. nextjs_sandbox/src/pages/mark-game-v2/index.tsx
```
--- 新規追加する ---
import { MarkGame } from "@/components/templates/MarkGame/MarkGameVersion2";

const MaskGameV2 = () => {
  return <>
    <MarkGame />
    <br />
    <a href='../'>戻る</a>
  </>
};

export default MaskGameV2;
--- 新規追加する ---
```

3. nextjs_sandbox/src/components/templates/MarkGame/MarkGameVersion2.tsx
```
--- 新規追加する ---
import Head from 'next/head';
import { useEffect } from 'react';
import { GameBoard } from "@/components/ormanisms/MarkGameBoard";
import { GameStatus } from '@/components/ormanisms/MarkGameStatus';
import { useMarkGame } from '@/providers/MarkGameProvider';
import { markGameTitle } from './features';
import style from './style.module.css';

var initEffect = false;

export const MarkGame: React.FC = () => {
    const { gameState, initMarkGameState, onGameBoardClick } = useMarkGame();

    useEffect(() => {
        if (initEffect) {
            return;
        }
        initEffect = true;
        initMarkGameState();
        console.debug('useEffect!');
    }, []);

    return <>
        <Head>
            <title>{markGameTitle()}</title>
        </Head>
        <p className='desc'>MarkGameVersion2.tsx</p>
        まるばつゲーム(useReducerで状態管理)
        <div className={style.field}>
            <GameBoard gameState={gameState} onGameBoardClick={
                (index) => onGameBoardClick(index)
            } />
            <GameStatus gameState={gameState} onGameResetClick={() => {
                initMarkGameState(); 
            }} />
        </div>
    </>;
}
--- 新規追加する ---
```

4. nextjs_sandbox/src/providers
```
フォルダを作成する
```

5. nextjs_sandbox/src/providers/MarkGameProvider.tsx
```
--- 新規追加する ---
import { getWinner, isCellEmpty, Player } from "@/components/templates/MarkGame/features";
import React, { useReducer } from "react";
import { createContext, ReactNode } from "react";

interface MarkGameState {
    boardWidth: number;
    boardData: string[];
    currentPlayer: Player;
    winner: Player | null;
    draw: boolean;
}
interface MarkGameContext {
    gameState: MarkGameState,
    initMarkGameState: () => void,
    onGameBoardClick: (index: number) => void
}
const MarkGameContext = createContext({} as MarkGameContext);
export const useMarkGame = () => React.useContext(MarkGameContext);

enum ActionType {
    updateGameState,
}
// typeで別の連想配列を|で指定できるようにして
// typeごとの更新情報の型(payload)を可変にできるようにする。
type Action =
{
    type: ActionType.updateGameState,
    payload: {
        gameState: MarkGameState
    }
};

export const MarkGameProvider: React.FC<{children: ReactNode}> = ({
    children
}) => {
    var firstGameState: MarkGameState = {
        boardWidth: 3,
        boardData: ['', '', '', '', '', '', '', '', ''],
        currentPlayer: Player.Maru,
        winner: null,
        draw: false
    };
    const initMarkGameState = (() => {
        dispatch({type: ActionType.updateGameState, payload: {
            gameState: firstGameState
        }});
    });
    const onGameBoardClick = (index: number) => {
        console.debug('click index=' + index);
        if (isCellEmpty(gameState, index) && gameState.winner == null) {
            var boardData = gameState.boardData;
            var currentPlayer = gameState.currentPlayer;
            var boardWidth = gameState.boardWidth;
            boardData[index] = currentPlayer;
            if (currentPlayer == Player.Maru) {
                currentPlayer = Player.Batsu;
            } else {
                currentPlayer = Player.Maru;
            }
            var winner = getWinner(gameState, index);
            var draw = boardData.filter((cell)=>cell == '').length == 0;
            dispatch({type: ActionType.updateGameState, payload: {
                gameState: {boardWidth, boardData, currentPlayer, winner, draw}
            }});                    
        } else {
            console.debug('invelid index!');
        }
    }
    const reducer = (_: MarkGameState, action: Action): MarkGameState => {
        switch (action.type) {
            case ActionType.updateGameState:
                return action.payload.gameState;
        }
    }
    const [gameState, dispatch] = useReducer(reducer, firstGameState);
    return <MarkGameContext.Provider value={{
        gameState, initMarkGameState, onGameBoardClick
    }}>
    {children}
    </MarkGameContext.Provider>;
}
--- 新規追加する ---
```

6. nextjs_sandbox/src/pages/_app.tsx
```
--- 一部変更する ---
import { MarkGameProvider } from "@/providers/MarkGameProvider";
import "./globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  // ここを変更する
  return <MarkGameProvider>
      <Component {...pageProps} />
  </MarkGameProvider>;
}
--- 一部変更する ---
```

### ソース変更Step4
https://github.com/wakizaka24/nextjs_sandbox/pull/1