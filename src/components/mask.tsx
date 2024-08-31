import { Button } from '@telegram-apps/telegram-ui';
import React, { useRef, useEffect, useState } from 'react';

const MaskDrawing = () => {
    const displayCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const maskCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const [backgroundImage, setBackgroundImage] = useState<HTMLImageElement | null>(null);

    useEffect(() => {
        const displayCanvas = displayCanvasRef.current;
        const maskCanvas = maskCanvasRef.current;
        if (!displayCanvas || !maskCanvas) return;

        const displayCtx = displayCanvas.getContext('2d');
        const maskCtx = maskCanvas.getContext('2d');
        if (!displayCtx || !maskCtx) return;

        displayCtx.lineCap = maskCtx.lineCap = 'round';
        displayCtx.lineJoin = maskCtx.lineJoin = 'round';
        displayCtx.lineWidth = maskCtx.lineWidth = 20; // Увеличил размер кисти для удобства тапов
        displayCtx.globalAlpha = 0.5;

        // Заполняем маску белым цветом
        maskCtx.fillStyle = 'white';
        maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);

        // Load a random image from Picsum
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.onload = () => {
            setBackgroundImage(img);
            displayCtx.drawImage(img, 0, 0, displayCanvas.width, displayCanvas.height);
        };
        img.src = "https://picsum.photos/500/500";
    }, []);

    useEffect(() => {
        const displayCanvas = displayCanvasRef.current;
        if (!displayCanvas || !backgroundImage) return;

        const displayCtx = displayCanvas.getContext('2d');
        if (!displayCtx) return;

        displayCtx.drawImage(backgroundImage, 0, 0, displayCanvas.width, displayCanvas.height);
    }, [backgroundImage]);

    const handleTap = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        e.preventDefault(); // Предотвращаем скролл и другие действия по умолчанию

        const displayCanvas = displayCanvasRef.current;
        const maskCanvas = maskCanvasRef.current;
        if (!displayCanvas || !maskCanvas) return;

        const displayCtx = displayCanvas.getContext('2d');
        const maskCtx = maskCanvas.getContext('2d');
        if (!displayCtx || !maskCtx) return;

        const { x, y } = getCoordinates(e);

        // Рисуем на отображаемом canvas
        displayCtx.beginPath();
        displayCtx.arc(x, y, 10, 0, 2 * Math.PI);
        displayCtx.fill();

        // Рисуем на маске
        maskCtx.globalAlpha = 1;
        maskCtx.fillStyle = 'black';
        maskCtx.beginPath();
        maskCtx.arc(x, y, 10, 0, 2 * Math.PI);
        maskCtx.fill();
    };

    const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        const canvas = displayCanvasRef.current;
        if (!canvas) return { x: 0, y: 0 };

        const rect = canvas.getBoundingClientRect();
        let clientX, clientY;

        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    };

    const clearMask = () => {
        const displayCanvas = displayCanvasRef.current;
        const maskCanvas = maskCanvasRef.current;
        if (!displayCanvas || !maskCanvas) return;

        const displayCtx = displayCanvas.getContext('2d');
        const maskCtx = maskCanvas.getContext('2d');
        if (!displayCtx || !maskCtx) return;

        displayCtx.clearRect(0, 0, displayCanvas.width, displayCanvas.height);
        if (backgroundImage) {
            displayCtx.drawImage(backgroundImage, 0, 0, displayCanvas.width, displayCanvas.height);
        }

        // Очищаем маску (заполняем белым)
        maskCtx.fillStyle = 'white';
        maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
    };

    const saveMask = () => {
        const maskCanvas = maskCanvasRef.current;
        if (!maskCanvas) return;

        const image = maskCanvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
        const link = document.createElement('a');
        link.download = 'mask.png';
        link.href = image;
        link.click();
    };

    return (
        <div className="flex flex-col items-center">
            <div className="relative">
                <canvas
                    ref={displayCanvasRef}
                    width={500}
                    height={500}
                    className="border border-gray-300 touch-none"
                    onClick={handleTap}
                    onTouchStart={handleTap}
                />
                <canvas
                    ref={maskCanvasRef}
                    width={500}
                    height={500}
                    style={{ display: 'none' }}
                />
            </div>
            <div className="mt-4 space-x-4">
                <Button onClick={clearMask}>
                    Очистить маску
                </Button>
                <Button onClick={saveMask}>
                    Сохранить маску
                </Button>
            </div>
        </div>
    );
};

export default MaskDrawing;
