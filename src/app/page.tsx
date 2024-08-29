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
    webApp?.MainButton.onClick(() => {
        webApp?.sendData('/somecommand2')
    });
    return (
        <main>
            <h1>TG WEB App</h1>
            <pre>{JSON.stringify(user, null, 2)}</pre>
            <div className="card">
                <button onClick={() => webApp?.showAlert("Ура")}>Send command</button>
            </div>
        </main>
);
}
