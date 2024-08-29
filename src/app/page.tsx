'use client'

import {useTelegram} from "@/providers/telegram-provider";

export default function Home() {
    const {webApp, user} = useTelegram()

    webApp?.MainButton.show();
    webApp?.initDataUnsafe
    return (
        <main>
            <h1>TG WEB App</h1>
            <div>{user?.id}</div>
        </main>
    );
}
