'use client';

import {Section, Cell, Image, List, Text} from '@telegram-apps/telegram-ui';

import { Link } from '@/components/Link/Link';
import { useMainButton } from '@telegram-apps/sdk-react';

import tonSvg from './_assets/ton.svg';
import {useEffect} from "react";
import MaskDrawing from "@/components/mask";

function Home() {
  const mainButton = useMainButton()
    useEffect(() => {
        mainButton.setParams({
            isVisible: true,
            isEnabled: true,
            text: 'Text'
        });
    }, [mainButton]);

    useEffect(() => {
        return mainButton.on('click',() => console.log('click'))
    }, [mainButton]);
  return (
      <>
          <MaskDrawing />
    <List>
        <Section
            header='Моя секция'
            footer='Футер'
        >
        <Cell>

            <Text>
                Длинный текст в ячейке. Пример сообщения от бота. И еще одно сообщение от бота. А это третье сообщение от бота.
            </Text>
        </Cell>
        </Section>
      {/*<Section*/}
      {/*  header='Features'*/}
      {/*  footer='You can use these pages to learn more about features, provided by Telegram Mini Apps and other useful projects'*/}
      {/*>*/}
      {/*  <Link href='/ton-connect'>*/}
      {/*    <Cell*/}
      {/*      before={<Image src={tonSvg.src} style={{ backgroundColor: '#007AFF' }}/>}*/}
      {/*      subtitle='Connect your TON wallet'*/}
      {/*    >*/}
      {/*      TON Connect*/}
      {/*    </Cell>*/}
      {/*  </Link>*/}
      {/*</Section>*/}
      {/*<Section*/}
      {/*  header='Application Launch Data'*/}
      {/*  footer='These pages help developer to learn more about current launch information'*/}
      {/*>*/}
      {/*  <Link href='/init-data'>*/}
      {/*    <Cell subtitle='User data, chat information, technical data'>Init Data</Cell>*/}
      {/*  </Link>*/}
      {/*  <Link href='/launch-params'>*/}
      {/*    <Cell subtitle='Platform identifier, Mini Apps version, etc.'>Launch Parameters</Cell>*/}
      {/*  </Link>*/}
      {/*  <Link href='/theme-params'>*/}
      {/*    <Cell subtitle='Telegram application palette information'>Theme Parameters</Cell>*/}
      {/*  </Link>*/}
      {/*</Section>*/}
    </List>
      </>
  );
}

export default  Home;
