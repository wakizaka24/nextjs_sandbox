import Head from 'next/head';
import { useEffect } from 'react';
import { GameBoard } from "@/components/ormanisms/MarkGameBoard";
import { GameStatus } from '@/components/ormanisms/MarkGameStatus';
import { useMarkGame } from '@/providers/MarkGameProvider';
import { markGameTitle } from './features';
import style from './style.module.css';

var initEffect = false;

export const MarkGame: React.FC = () => {
    const { gameState, initMarkGameState, onGameBoardClick, resetMarkGameState } = useMarkGame();

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
                resetMarkGameState(); 
            }} />
        </div>
    </>;
}