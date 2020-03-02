import firebase from "firebase";
import {firestoreConfig} from "./firestoreConfig";

export const db = firebase.initializeApp(firestoreConfig).firestore();