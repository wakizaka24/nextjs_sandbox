import Head from 'next/head';
import { useEffect, useState } from 'react';
import { GameBoard } from "@/components/ormanisms/GameBoard";
import { GameStatus } from '@/components/ormanisms/GameStatus';
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
    // 描画の中で値を保持することができる。
    // 状態の取得変数とセッターのセットになる。
    const [gameState, setGameState] = useState<GameState>(initGameState);

    // [!] useEffectで行っているは何か。
    // useEffectは初回か配列の値が変更される
    // たびに指定したメソッドを呼び出す。
    // Reactのstructモードでは2回呼ばれるため、
    // 2回目の処理を無効化する処理を入れる。
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
             // {}の中ではTypeScriptの処理を動かすことができ、
             // 文字を返すことができる。
            }
            <title>{markGameTitle()}</title>
        </Head>
        <p className='desc'>MarkGameVersion1.tsx</p>
        まるばつゲーム(useStateで状態管理)
        {// [!] classNameのfieldはどこに記載があるのか。
         // style変数のインポート先にある。
        }
        <div className={style.field}>
            {// [!] GameBoardタグの属性でTypeScriptから渡す値の型の指定方法
             // React.FCのジェネリクスで指定できる。
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