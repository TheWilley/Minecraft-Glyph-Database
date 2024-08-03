import { useEffect, useRef } from "react";
import { Texture } from "../global/types";

type Props = {
    texture: Texture;
    highlightedArea: number[];
}

function Highlighter(props: Props) {
    const canvas = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (canvas.current) {
            const context = canvas.current.getContext('2d');

            if (context) {
                // We don't want the texture to appear blury
                context.imageSmoothingEnabled = false;
                const image = new Image();
                image.src = props.texture.base64Image;
                image.onload = () => {
                    // Draw the entire image with reduced opacity
                    context.globalAlpha = 0.3;
                    context.drawImage(image, 0, 0, props.texture.size[0], props.texture.size[1]);

                    // Define the clipping region for the area with full opacity
                    context.globalAlpha = 1.0;
                    context.beginPath();

                    // Calculate the scaling factors
                    const scaleX = props.texture.size[0] / props.texture.dimensions[0];
                    const scaleY = props.texture.size[1] / props.texture.dimensions[1];

                    // Calculate the clipping region
                    const clipX = props.highlightedArea[0] * scaleX;
                    const clipY = props.highlightedArea[1] * scaleY;
                    const clipWidth = scaleX;
                    const clipHeight = scaleY;
                    context.rect(clipX, clipY, clipWidth, clipHeight);
                    context.clip();

                    // Draw the image in the clipping region with full opacity
                    context.drawImage(image, 0, 0, props.texture.size[0], props.texture.size[1]);

                    // Reset the clipping region
                    context.restore();
                };
            }
        }
    }, [props.highlightedArea]);

    return (
        <canvas ref={canvas} width={props.texture.size[0]} height={props.texture.size[1]} className="top-3 sticky z-10 p-5 rounded-md bg-base-200 hidden md:block w-full overflow-auto" />
    )
}

export default Highlighter;