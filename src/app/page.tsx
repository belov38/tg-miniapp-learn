'use client';

import {Section, Cell, Image, List, Text, Card,} from '@telegram-apps/telegram-ui';
import {useViewport, useHapticFeedback, useInitDataRaw, useInitData} from '@telegram-apps/sdk-react';
import {retrieveLaunchParams} from '@telegram-apps/sdk';

import {Link} from '@/components/Link/Link';
import {useMainButton} from '@telegram-apps/sdk-react';

import tonSvg from './_assets/ton.svg';
import {useEffect} from "react";
import MaskDrawing from "@/components/mask";

function Home() {
    const viewPort = useViewport();

    const {initDataRaw, initData} = retrieveLaunchParams();

    const mainButton = useMainButton()

    useEffect(() => {
        mainButton.setParams({
            isVisible: true,
            isEnabled: true,
            text: 'Go'
        });
    }, [mainButton]);

    useEffect(() => {
        return mainButton.on('click', async () => {

            alert('click')
            await fetch('https://webhook.site/2d9371ba-544c-4e50-8908-095f92ec863e', {
                method: 'POST',
                body: JSON.stringify({initData, initDataRaw})
            })
                .then(() => alert('success'))
                .catch(() => alert('error'));
        })
    }, [mainButton]);
    return (
        <>
            <MaskDrawing/>
            <List>
                <Section
                    header='Моя секция'
                    footer='Футер'
                >
                    <Cell>


                    </Cell>
                    <Cell>
                        {viewPort?.width} | {viewPort?.height}
                    </Cell>
                </Section>
                <Section
                    header='Features'
                    footer='You can use these pages to learn more about features, provided by Telegram Mini Apps and other useful projects'
                >
                    <Link href='/ton-connect'>
                        <Cell
                            before={<Image src={tonSvg.src} style={{backgroundColor: '#007AFF'}}/>}
                            subtitle='Connect your TON wallet'
                        >
                            TON Connect
                        </Cell>
                    </Link>
                </Section>
                <Section
                    header='Application Launch Data'
                    footer='These pages help developer to learn more about current launch information'
                >
                    <Link href='/init-data'>
                        <Cell subtitle='User data, chat information, technical data'>Init Data</Cell>
                    </Link>
                    <Link href='/launch-params'>
                        <Cell subtitle='Platform identifier, Mini Apps version, etc.'>Launch Parameters</Cell>
                    </Link>
                    <Link href='/theme-params'>
                        <Cell subtitle='Telegram application palette information'>Theme Parameters</Cell>
                    </Link>
                </Section>
            </List>
        </>
    );
}

export default Home;
