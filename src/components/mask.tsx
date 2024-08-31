import {Button} from '@telegram-apps/telegram-ui';


import React, { useRef, useEffect, useState } from 'react';

const MaskDrawing = () => {
    const displayCanvasRef = useRef(null);
    const maskCanvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const lastPositionRef = useRef({ x: 0, y: 0 });
    const [backgroundImage, setBackgroundImage] = useState(null);

    useEffect(() => {
        const displayCanvas = displayCanvasRef.current;
        const maskCanvas = maskCanvasRef.current;
        const displayCtx = displayCanvas.getContext('2d');
        const maskCtx = maskCanvas.getContext('2d');

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
        if (backgroundImage) {
            const displayCanvas = displayCanvasRef.current;
            const displayCtx = displayCanvas.getContext('2d');
            displayCtx.drawImage(backgroundImage, 0, 0, displayCanvas.width, displayCanvas.height);
        }
    }, [backgroundImage]);

    const startDrawing = (e) => {
        setIsDrawing(true);
        const { x, y } = getCoordinates(e);
        lastPositionRef.current = { x, y };
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const draw = (e) => {
        if (!isDrawing) return;

        const displayCanvas = displayCanvasRef.current;
        const maskCanvas = maskCanvasRef.current;
        const displayCtx = displayCanvas.getContext('2d');
        const maskCtx = maskCanvas.getContext('2d');
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

    const getCoordinates = (e) => {
        const canvas = displayCanvasRef.current;
        const rect = canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    };

    const clearMask = () => {
        const displayCanvas = displayCanvasRef.current;
        const maskCanvas = maskCanvasRef.current;
        const displayCtx = displayCanvas.getContext('2d');
        const maskCtx = maskCanvas.getContext('2d');

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
                    className="border border-gray-300 cursor-crosshair"
                    onMouseDown={startDrawing}
                    onMouseUp={stopDrawing}
                    onMouseMove={draw}
                    onMouseLeave={stopDrawing}
                />
                <canvas
                    ref={maskCanvasRef}
                    width={500}
                    height={500}
                    className="hidden"
                />
            </div>
            <div className="mt-4 space-x-4">
                <Button onClick={clearMask} variant="secondary">
                    Очистить маску
                </Button>
                <Button onClick={saveMask} variant="default">
                    Сохранить маску
                </Button>
            </div>
        </div>
    );
};

export default MaskDrawing;
