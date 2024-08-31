import { Button, Slider } from '@telegram-apps/telegram-ui';
import React, { useRef, useEffect, useState, useCallback } from 'react';

const MaskDrawing = () => {
    const displayCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const maskCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const [backgroundImage, setBackgroundImage] = useState<HTMLImageElement | null>(null);
    const [brushSize, setBrushSize] = useState(4);
    const [history, setHistory] = useState<ImageData[]>([]);
    const [currentStep, setCurrentStep] = useState(-1);

    const createCursorUrl = useCallback((size: number) => {
        const cursorSize = size * 10;
        const halfSize = cursorSize / 2;
        const cursorCanvas = document.createElement('canvas');
        cursorCanvas.width = cursorSize;
        cursorCanvas.height = cursorSize;
        const ctx = cursorCanvas.getContext('2d');
        if (ctx) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(halfSize, halfSize, halfSize - 1, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        }
        return `url(${cursorCanvas.toDataURL()}) ${halfSize} ${halfSize}, auto`;
    }, []);

    useEffect(() => {
        const displayCanvas = displayCanvasRef.current;
        const maskCanvas = maskCanvasRef.current;
        if (!displayCanvas || !maskCanvas) return;

        const displayCtx = displayCanvas.getContext('2d');
        const maskCtx = maskCanvas.getContext('2d');
        if (!displayCtx || !maskCtx) return;

        displayCtx.lineCap = maskCtx.lineCap = 'round';
        displayCtx.lineJoin = maskCtx.lineJoin = 'round';

        maskCtx.fillStyle = 'white';
        maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);

        const initialState = maskCtx.getImageData(0, 0, maskCanvas.width, maskCanvas.height);
        setHistory([initialState]);
        setCurrentStep(0);

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
        if (displayCanvas) {
            displayCanvas.style.cursor = createCursorUrl(brushSize);
        }
    }, [brushSize, createCursorUrl]);

    const drawMaskOnDisplay = useCallback((maskImageData: ImageData) => {
        const displayCanvas = displayCanvasRef.current;
        if (!displayCanvas || !backgroundImage) return;

        const displayCtx = displayCanvas.getContext('2d');
        if (!displayCtx) return;

        // Clear the display canvas
        displayCtx.clearRect(0, 0, displayCanvas.width, displayCanvas.height);

        // Draw the background image
        displayCtx.drawImage(backgroundImage, 0, 0, displayCanvas.width, displayCanvas.height);

        // Create a temporary canvas to hold the mask
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = displayCanvas.width;
        tempCanvas.height = displayCanvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        if (!tempCtx) return;

        // Put the mask image data on the temporary canvas
        tempCtx.putImageData(maskImageData, 0, 0);

        // Draw the mask on top of the background with 50% opacity
        displayCtx.globalAlpha = 0.5;
        displayCtx.globalCompositeOperation = 'source-over';
        displayCtx.drawImage(tempCanvas, 0, 0);
        displayCtx.globalAlpha = 1.0;
    }, [backgroundImage]);

    const handleTap = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        e.preventDefault();

        const maskCanvas = maskCanvasRef.current;
        if (!maskCanvas) return;

        const maskCtx = maskCanvas.getContext('2d');
        if (!maskCtx) return;

        const { x, y } = getCoordinates(e);

        maskCtx.fillStyle = 'black';
        maskCtx.beginPath();
        maskCtx.arc(x, y, 10*brushSize / 2, 0, 2 * Math.PI);
        maskCtx.fill();

        // Save the new state to history
        const newState = maskCtx.getImageData(0, 0, maskCanvas.width, maskCanvas.height);
        const newHistory = history.slice(0, currentStep + 1);
        newHistory.push(newState);
        setHistory(newHistory);
        setCurrentStep(currentStep + 1);

        // Update the display canvas
        drawMaskOnDisplay(newState);
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
        const maskCanvas = maskCanvasRef.current;
        if (!maskCanvas) return;

        const maskCtx = maskCanvas.getContext('2d');
        if (!maskCtx) return;

        maskCtx.fillStyle = 'white';
        maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);

        // Reset history
        const initialState = maskCtx.getImageData(0, 0, maskCanvas.width, maskCanvas.height);
        setHistory([initialState]);
        setCurrentStep(0);

        // Update the display canvas
        drawMaskOnDisplay(initialState);
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

    const handleBrushSizeChange = (value: number) => {
        setBrushSize(value);
    };

    const undo = () => {
        if (currentStep > 0) {
            const prevStep = currentStep - 1;
            const prevState = history[prevStep];

            // Update the mask canvas
            const maskCanvas = maskCanvasRef.current;
            if (maskCanvas) {
                const maskCtx = maskCanvas.getContext('2d');
                if (maskCtx) {
                    maskCtx.putImageData(prevState, 0, 0);
                }
            }

            // Update the display canvas
            drawMaskOnDisplay(prevState);

            setCurrentStep(prevStep);
        }
    };

    return (
        <div className="flex flex-col items-center">
            <div className="relative">
                <canvas
                    ref={displayCanvasRef}
                    width={375}
                    height={500}
                    className="border border-gray-300 touch-none"
                    onClick={handleTap}
                    onTouchStart={handleTap}
                />
                <canvas
                    ref={maskCanvasRef}
                    width={375}
                    height={500}
                    style={{ display: 'none' }}
                />
            </div>
            <div className="mt-4 w-full max-w-xs">
                <Slider
                    min={1}
                    max={4}
                    value={brushSize}
                    onChange={handleBrushSizeChange}
                />
                <p className="text-center mt-2">Размер кисти: {brushSize}</p>
            </div>
            <div className="mt-4 space-x-4">
                <Button onClick={undo} disabled={currentStep <= 0}>
                    Отменить
                </Button>
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
