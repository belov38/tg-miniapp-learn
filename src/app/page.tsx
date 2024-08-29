'use client'

import {useTelegram} from "@/providers/telegram-provider";

export default function Home() {
    const {webApp, user} = useTelegram()
    webApp?.MainButton.show();
    return (
        <main>
            <h1>TG WEB App</h1>
        </main>
    );
}
