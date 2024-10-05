import { getWinner, isCellEmpty } from "@/components/templates/MarkGame/features";
import React, { useReducer } from "react";
import { createContext, ReactNode } from "react";
import { useFirebase } from "./FirebaseProvider";

export enum Player {
    Maru = '⭕️',
    Batsu = '❌'
}

export interface MarkGameState {
    boardWidth: number;
    boardData: string[];
    currentPlayer: Player;
    winner: Player | null;
    draw: boolean;
}
interface MarkGameContext {
    gameState: MarkGameState,
    // Firestoreの初期化とFirestoreにデータがない場合データを初期化する。
    initMarkGameState: () => void,
    onGameBoardClick: (index: number) => void
    // Firestoreのデータを初期化する。
    resetMarkGameState: () => void,
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

export var setMarkGameState: (gameState: MarkGameState) => void;

export const MarkGameProvider: React.FC<{children: ReactNode}> = ({
    children
}) => {
    const { initFirestoreGameState, applyFirestoreGameState } = useFirebase();

    var firstGameState: MarkGameState = {
        boardWidth: 3,
        boardData: ['', '', '', '', '', '', '', '', ''],
        currentPlayer: Player.Maru,
        winner: null,
        draw: false
    };
    const initMarkGameState = async () => {
        // dispatch({type: ActionType.updateGameState, payload: {
        //     gameState: firstGameState
        // }});
        initFirestoreGameState(firstGameState);
    };
    setMarkGameState = ((gameState: MarkGameState) => {
        dispatch({type: ActionType.updateGameState, payload: {
            gameState: gameState
        }});
    });
    const onGameBoardClick = async (index: number) => {
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
            // dispatch({type: ActionType.updateGameState, payload: {
            //     gameState: {boardWidth, boardData, currentPlayer, winner, draw}
            // }});
            applyFirestoreGameState({boardWidth, boardData, currentPlayer, winner, draw});               
        } else {
            console.debug('invelid index!');
        }
    }
    const resetMarkGameState = async () => {
        applyFirestoreGameState(firstGameState);
    }
    const reducer = (_: MarkGameState, action: Action): MarkGameState => {
        switch (action.type) {
            case ActionType.updateGameState:
                return action.payload.gameState;
        }
    }
    const [gameState, dispatch] = useReducer(reducer, firstGameState);
    return <MarkGameContext.Provider value={{
        gameState, initMarkGameState, onGameBoardClick, resetMarkGameState
    }}>
    {children}
    </MarkGameContext.Provider>;
}