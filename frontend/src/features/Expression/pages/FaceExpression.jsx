import { useEffect, useRef, useState } from "react";
import { init, detect } from "../utils/utils";

export default function FaceExpression({ onClick = () => {} }) {
    const videoRef = useRef(null);
    const landmarkerRef = useRef(null);
    const streamRef = useRef(null);

    const [expression, setExpression] = useState("Detecting...");

    useEffect(() => {
        const initalize = async () => {
            try {
                await init({ videoRef, landmarkerRef, streamRef });
            } catch (error) {
                console.error("Failed to initialize face landmarker:", error);
            }
        };

        initalize();

        return () => {
            if (landmarkerRef.current) {
                landmarkerRef.current.close();
            }
            if (videoRef.current?.srcObject) {
                videoRef.current.srcObject
                    .getTracks()
                    .forEach((track) => track.stop());
            }
        };
    }, []);

    async function handleClick(){
        const expression = await detect({landmarkerRef, videoRef, setExpression})
        onClick(expression)
    }

    return (
        <div style={{ textAlign: "center" }}>
            <video
                ref={videoRef}
                autoPlay
                muted
                    style={{
        width: "400px",
        borderRadius: "12px",
        transform: "scaleX(-1)"
    }}
                playsInline
            />
            <h2>{expression}</h2>
            <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleClick}>Detect Expression</button>
        </div>
    );
}