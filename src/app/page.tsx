'use client'

import {useTelegram} from "@/providers/telegram-provider";

export default function Home() {
    const {webApp, user} = useTelegram()

    webApp?.enableClosingConfirmation();
    webApp?.BackButton.show();
    webApp?.SettingsButton.show();
    webApp?.BackButton.onClick(() => {
        webApp?.BackButton.hide();
        webApp?.sendData('/somecommand')
    });
    webApp?.MainButton.show();
    webApp?.MainButton.onClick(() => {webApp?.close()});
    return (
        <main>
            <h1>TG WEB App</h1>
            <>{JSON.stringify(user, null, 2)}</>
        </main>
    );
}
