import { ANON_SAVE_KEY } from "./constants";

export function jprint(value: any) {
    console.log(JSON.stringify(value));
}

export function generateName() {
    const uuid = crypto.randomUUID();
    return "Anon" + uuid.slice(0, 7);
}

export function saveNameToLocal(name: string) {
    if (name.trim().length > 0) {
        localStorage.setItem(ANON_SAVE_KEY, name);
    }
}

export function fetchNameFromLocal() {
    const name = localStorage.getItem(ANON_SAVE_KEY);
    return name;
}

