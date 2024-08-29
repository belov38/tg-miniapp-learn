'use client'

import {useTelegram} from "@/providers/telegram-provider";
import { Button } from '@telegram-apps/telegram-ui';
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
                <button onClick={() => webApp?.showAlert("Ура")}>Alert</button>
            </div>
            <div>
                <button onClick={() => webApp?.showPopup({
                    title: "Pop up",
                    message: "hello world",

                }, () => {

                })}>Pop up
                </button>
            </div>
            <Button>Click me</Button>
        </main>
    );
}
