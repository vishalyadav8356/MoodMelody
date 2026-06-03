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
        await init({
          videoRef,
          landmarkerRef,
          streamRef,
        });
      } catch (error) {
        console.error(
          "Failed to initialize face landmarker:",
          error
        );
      }
    };

    initialize();

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

  async function handleClick() {
    try {
      const result = await detect({
        landmarkerRef,
        videoRef,
        setExpression,
      });

      onClick(
        result.currentExpression,
        result.confidence
      );
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="flex flex-col h-full gap-2">
      <p className="text-sm text-white/40 uppercase tracking-widest font-medium">
        Expression Capture
      </p>

      {/* Hidden Camera (required for detection) */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="hidden"
      />

      {/* Emoji Card */}
      <div className="relative flex-1 min-h-[180px] md:min-h-[220px] rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black">

        {/* Glow */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-40 w-40 rounded-full bg-white/5 blur-3xl" />
        </div>

        {/* Emoji */}
        <div
          key={expression}
          className="relative z-10 flex h-full flex-col items-center justify-center gap-4"
        >
          <div className="select-none text-[70px] md:text-[100px]">
            {expression
              ? EMOJIS[expression] || "🎭"
              : "🎭"}
          </div>

          <div className="text-center px-4">
            <p className="text-lg font-semibold text-white capitalize">
              {expression || "Ready to Detect"}
            </p>

            {!expression ? (
              <p className="text-xs md:text-sm text-white/50 mt-1 mb-1">
                Scan your face to capture your current emotion and get personalized music recommendations.
              </p>
            ) : (
              <p className="text-xs md:text-sm text-green-400 mt-1 mb-1">
                Emotion detected successfully
              </p>
            )}
          </div>


        </div>
      </div>

      {/* Detect Button */}
      <button
        onClick={handleClick}
        className="rounded-xl bg-white px-2 py-1 font-semibold text-black transition-all duration-300 hover:bg-white/80 active:scale-95"
      >
        Detect Emotion
      </button>
    </div>
  );
}

FaceExpression.propTypes = {
  onClick: PropTypes.func.isRequired,
};