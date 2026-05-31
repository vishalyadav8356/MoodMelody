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
        const result = await detect({landmarkerRef, videoRef, setExpression})
        onClick(result.currentExpression, result.confidence)
    }

return (
  <div className="flex flex-col items-center gap-3 h-full">

    <p className="text-xs text-white/40 uppercase tracking-widest font-medium self-start">
      Expression Capture
    </p>

    {/* Camera — fixed height */}
  <div className="relative w-full rounded-xl overflow-hidden bg-black" style={{height: '200px'}}>
  <video
    ref={videoRef}
    autoPlay
    muted
    playsInline
    className="w-full h-full object-cover"
    style={{ transform: 'scaleX(-1)' }}
  />
</div>

    {/* Emotion display */}
    <div className="flex items-center justify-between w-full px-1">
      <div className="flex items-center gap-2">
        <span className="text-2xl">
          {expression === 'happy' ? '😊' :
           expression === 'sad' ? '😢' :
           expression === 'surprised' ? '😲' : '😐'}
        </span>
        <span className="text-sm text-white/70 capitalize">{expression}</span>
      </div>

      <button
        onClick={handleClick}
        className="px-4 py-2 bg-white/90 text-black text-sm font-medium rounded-lg hover:bg-white transition active:scale-95"
      >
        Detect
      </button>
    </div>

  </div>
)
}