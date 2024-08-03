import { useEffect, useRef } from "react";

type Props = {
    image: string;
}

function Highlighter(props: Props) {
    const canvas = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        if (canvas.current) {
            const context = canvas.current.getContext('2d');
    
            if (context) {
                const image = new Image();
                image.src = props.image;
                image.onload = () => {
                    // Draw the entire image with reduced opacity
                    context.globalAlpha = 0.1;
                    context.drawImage(image, 0, 0, canvas.current.width, canvas.current.height);
    
                    // Define the clipping region for the area with full opacity
                    context.globalAlpha = 1.0;
                    context.beginPath();
                    // Example: Rectangle clipping region
                    const clipX = 50; // X-coordinate of the top-left corner of the clipping area
                    const clipY = 50; // Y-coordinate of the top-left corner of the clipping area
                    const clipWidth = 100; // Width of the clipping area
                    const clipHeight = 100; // Height of the clipping area
                    context.rect(clipX, clipY, clipWidth, clipHeight);
                    context.clip();
    
                    // Draw the image in the clipping region with full opacity
                    context.drawImage(image, 0, 0, canvas.current.width, canvas.current.height);
    
                    // Reset the clipping region
                    context.restore();
                };
            }
        }
    }, [props.image]);

    return (
        <canvas ref={canvas} className="top-3 sticky z-10 p-5 rounded-md bg-base-200 hidden md:block w-full overflow-auto" />
    )
}

export default Highlighter;