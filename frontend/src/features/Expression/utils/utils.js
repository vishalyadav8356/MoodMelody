import {FaceLandmarker, FilesetResolver} from "@mediapipe/tasks-vision";

{/*init function to initialize the face landmarker */}
export const init = async ({ videoRef, landmarkerRef, streamRef }) => {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",
  );
  landmarkerRef.current = await FaceLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task",
    },
    outputFaceBlendshapes: true,
    runningMode: "VIDEO",
    numFaces: 1,
  });
  streamRef.current = await navigator.mediaDevices.getUserMedia({ video: true });
  videoRef.current.srcObject = streamRef.current;
  await videoRef.current.play();
};

{/*detect function to detect the facial expression */}
export const detect = ({landmarkerRef, videoRef, setExpression}) => {
  if (!landmarkerRef.current || !videoRef.current) return;
  const results = landmarkerRef.current.detectForVideo(
    videoRef.current,
    performance.now(),
  );
  let currentExpression = "Neutral";
  let confidence = 0;
  
  if (results.faceBlendshapes?.length > 0) {
    const blendshapes = results.faceBlendshapes[0].categories;
    const getScore = (name) =>
      blendshapes.find((b) => b.categoryName === name)?.score || 0;
    const smileLeft = getScore("mouthSmileLeft");
    const smileRight = getScore("mouthSmileRight");
    const jawOpen = getScore("jawOpen");
    const browUp = getScore("browInnerUp");
    const frownLeft = getScore("mouthFrownLeft");
    const frownRight = getScore("mouthFrownRight");
    if (smileLeft > 0.5 && smileRight > 0.5) {
      currentExpression = "happy";
      confidence = (smileLeft + smileRight) / 2;
    } else if (jawOpen > 0.01 && browUp > 0.01) {
      currentExpression = "surprised";
      confidence = (jawOpen + browUp) / 2;
    } else if (frownLeft > 0.01 && frownRight > 0.01) {
      currentExpression = "sad";
      confidence = (frownLeft + frownRight) / 2;
    }
    confidence = Math.round(confidence * 100) / 100
    setExpression(currentExpression);
  }

  return {currentExpression, confidence};

};
