import { Button } from '@telegram-apps/telegram-ui';
import React, { useRef, useEffect, useState } from 'react';

const MaskDrawing = () => {
    const displayCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const maskCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const lastPositionRef = useRef({ x: 0, y: 0 });
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
        displayCtx.lineWidth = maskCtx.lineWidth = 10;
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

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        setIsDrawing(true);
        const { x, y } = getCoordinates(e);
        lastPositionRef.current = { x, y };
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return;

        const displayCanvas = displayCanvasRef.current;
        const maskCanvas = maskCanvasRef.current;
        if (!displayCanvas || !maskCanvas) return;

        const displayCtx = displayCanvas.getContext('2d');
        const maskCtx = maskCanvas.getContext('2d');
        if (!displayCtx || !maskCtx) return;

        const { x, y } = getCoordinates(e);

        // Рисуем на отображаемом canvas
        displayCtx.beginPath();
        displayCtx.moveTo(lastPositionRef.current.x, lastPositionRef.current.y);
        displayCtx.lineTo(x, y);
        displayCtx.stroke();

        // Рисуем на маске
        maskCtx.globalAlpha = 1;
        maskCtx.strokeStyle = 'black';
        maskCtx.beginPath();
        maskCtx.moveTo(lastPositionRef.current.x, lastPositionRef.current.y);
        maskCtx.lineTo(x, y);
        maskCtx.stroke();

        lastPositionRef.current = { x, y };
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
        <div className="flex flex-col items-center w-fit">
            <div className="relative">
                <canvas
                    ref={displayCanvasRef}
                    width={500}
                    height={500}
                    className="border border-gray-300 cursor-crosshair touch-none"
                    onMouseDown={startDrawing}
                    onMouseUp={stopDrawing}
                    onMouseMove={draw}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={(e) => {
                        e.preventDefault();
                        draw(e);
                    }}
                    onTouchEnd={stopDrawing}
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
