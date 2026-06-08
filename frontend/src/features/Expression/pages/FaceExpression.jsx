import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { init, detect } from "../utils/utils";

const EMOJIS = {
  happy: "😊",
  sad: "😢",
  surprised: "😲",
  neutral: "😐",
};

export default function FaceExpression({ onClick = () => { } }) {
  const videoRef = useRef(null);
  const landmarkerRef = useRef(null);
  const streamRef = useRef(null);

  const [expression, setExpression] = useState(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        await init({ videoRef, landmarkerRef, streamRef });
      } catch (error) {
        console.error("Failed to initialize face landmarker:", error);
      }
    };

    initialize();

    return () => {
      if (landmarkerRef.current) landmarkerRef.current.close();
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  async function handleClick() {
    try {
      const result = await detect({ landmarkerRef, videoRef, setExpression });
      onClick(result.currentExpression, result.confidence);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="flex flex-col gap-2 sm:gap-3">

      {/* Title */}
      <p className="text-xs sm:text-sm text-white/40 uppercase tracking-widest font-medium">
        Expression Capture
      </p>

      {/* Hidden Camera */}
      <video ref={videoRef} autoPlay muted playsInline className="hidden" />

      {/* Emoji Card */}
      <div className="
        relative rounded-2xl sm:rounded-3xl overflow-hidden
        border border-white/10
        bg-gradient-to-br from-zinc-900 via-zinc-950 to-black
        min-h-[140px] sm:min-h-[180px] md:min-h-[200px] lg:min-h-[240px]
      ">

        {/* Glow */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-24 w-24 sm:h-32 sm:w-32 md:h-40 md:w-40 rounded-full bg-white/5 blur-3xl" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex h-full flex-col items-center justify-center gap-2 sm:gap-4 py-4 sm:py-6">

          {/* Emoji */}
          <div className="
            select-none
            text-[50px]
            sm:text-[70px]
            md:text-[80px]
            lg:text-[100px]
          ">
            {expression ? EMOJIS[expression] || "🎭" : "🎭"}
          </div>

          {/* Label */}
          <div className="text-center px-3 sm:px-4">
            <p className="
              font-semibold text-white capitalize
              text-sm
              sm:text-base
              md:text-lg
            ">
              {expression || "Ready to Detect"}
            </p>

            {!expression ? (
              <p className="
                text-white/50 mt-1
                text-xs
                sm:text-xs
                md:text-sm
                hidden sm:block
              ">
                Scan your face to capture your current emotion.
              </p>
            ) : (
              <p className="
                text-green-400 mt-1
                text-xs
                sm:text-sm
              ">
                Emotion detected ✓
              </p>
            )}
          </div>

        </div>
      </div>

      {/* Detect Button */}
      <button
        onClick={handleClick}
        className="
          w-full rounded-xl bg-white font-semibold text-black
          transition-all duration-300 hover:bg-white/80 active:scale-95
          py-2 text-sm
          sm:py-2.5 sm:text-base
          md:py-3
        "
      >
        Detect Emotion
      </button>

    </div>
  )
}

FaceExpression.propTypes = {
  onClick: PropTypes.func.isRequired,
};