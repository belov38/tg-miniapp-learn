'use client'
import {AppRoot, List} from '@telegram-apps/telegram-ui';
import {useTelegram} from "@/providers/telegram-provider";
import {Button} from '@telegram-apps/telegram-ui';
import {useState} from "react";

export default function Home() {
    const {webApp, user} = useTelegram()

    const [contact, setContact] = useState("---")
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
        <AppRoot>
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
                        webApp?.requestContact((success, res)=>{
                            if(success){
                                setContact(JSON.stringify(res, null, 2))
                            }
                        })
                    })}>Pop up
                    </button>
                </div>
                <Button>Click me</Button>
                <div>{contact}</div>
            </main>
        </AppRoot>
    );
}
