import React, { ReactNode } from "react";
import { createContext } from "react";

interface FirebaseContext {
    initFirestoreGameState: (gameState: MarkGameState) => void,
    applyFirestoreGameState: (gameState: MarkGameState) => void
}
const FirebaseContext = createContext({} as FirebaseContext);
export const useFirebase = () => React.useContext(FirebaseContext);

import { FirebaseApp, initializeApp } from "firebase/app";
import { collection, doc, getFirestore, onSnapshot, CollectionReference, updateDoc,
    Firestore, getDoc } from "firebase/firestore";
import { MarkGameState, setMarkGameState } from "./MarkGameProvider";

const FIRESTORE_COLLECTION_NAME = 'mark_game';
const FIRESTORE_DOCUMENT_NAME = 'mark_game_state';

export const FirebaseProvider: React.FC<{children: ReactNode}> = ({
    children
}) => {
    var firestore: Firestore | null = null;
    var firestoreRef: CollectionReference | null = null;
    // Firestoreにゲームステータス(mark_game_stage)がない場合、
    // 引数の値で初期化する。
    const initFirestoreGameState = async (firstGameState: MarkGameState) => {
        // Firebaseの設定値で値を置き換える。
        // Web上に公開される情報のため、現状では誰でも閲覧や改ざんができる情報になる。
        // 閲覧や改ざんできないようにするには、Firebaseの認証サービスに認証済みのユーザーのみ、
        // アクセスできるようにCloud Firestoreのルールを設定する必要がある。
        const firebaseConfig = {
            apiKey: "AIzaSyBJX6eFSihU3tXiE7-cJHiu3j1WBbmGQVo",
            authDomain: "firestore-6adc1.firebaseapp.com",
            projectId: "firestore-6adc1",
            storageBucket: "firestore-6adc1.appspot.com",
            messagingSenderId: "881730943789",
            appId: "1:881730943789:web:78b1421e0becbb662cb1a4",
            measurementId: "G-5B801G3ENN"
        };
        const firebaseApp: FirebaseApp = initializeApp(firebaseConfig);
        firestore = getFirestore(firebaseApp);
        firestoreRef = collection(firestore, FIRESTORE_COLLECTION_NAME);
        // Firestoreからのリアルタイム更新を反映するイベントを登録する。
        onSnapshot(doc(firestoreRef, FIRESTORE_DOCUMENT_NAME), (doc) => {
            var gameState = doc.data() as MarkGameState;
            // console.debug('onSnapshot', gameState);
            // データがない場合はスキップする。
            if (gameState.boardData != undefined) {
                // データに変更があった場合ゲームに反映する。
                setMarkGameState(gameState);
            }
        });

        // Firestoreの現在の値を取得する。
        var snap = await getDoc(doc(firestore!!, FIRESTORE_COLLECTION_NAME,
            FIRESTORE_DOCUMENT_NAME));
        var gameState = snap.data() as MarkGameState;
        if (gameState.boardData != undefined) {
            // データが存在した場合ゲームに反映する。
            setMarkGameState(gameState);
        } else {
            // Firebaseの値を変更する。
            await updateDoc(doc(firestoreRef!!, FIRESTORE_DOCUMENT_NAME), {
                ...firstGameState
            });
        }
    };
    // Firestoreにゲームステータスの変更を適用する。
    const applyFirestoreGameState = async (gameState: MarkGameState) => {
        // console.debug('applyGameStates', gameState);
        // Firebaseの値を変更する。
        await updateDoc(doc(firestoreRef!!, FIRESTORE_DOCUMENT_NAME), {
            ...gameState
        });
    };
    return <FirebaseContext.Provider value={{
        initFirestoreGameState, applyFirestoreGameState
    }}>
    {children}
    </FirebaseContext.Provider>;
}