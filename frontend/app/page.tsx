"use client";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { VRMLoaderPlugin, VRM, VRMUtils } from "@pixiv/three-vrm";
import { getDetailedPhonemeInfo } from "../utils/phoneme-mapping";
import type { PhonemeInfo } from "../utils/phoneme-mapping";

export default function Home() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");
  const currentVrmRef = useRef<VRM | undefined>(undefined);

  // 改良されたリップシンク状態管理
  const lipSyncRef = useRef({
    isActive: false,
    startTime: 0,
    phonemes: [] as PhonemeInfo[],
    currentIndex: 0,
    previousViseme: { viseme: "", intensity: 0 },
    transitionSpeed: 8.0, // 遷移速度
  });

  // テキストを音素に変換
  const textToPhonemes = (text: string): PhonemeInfo[] => {
    const phonemes: PhonemeInfo[] = [];

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const phonemeInfo = getDetailedPhonemeInfo(char);

      // 文字種別による調整
      if (phonemeInfo.type === "vowel") {
        phonemeInfo.visemeData.duration *= 1.2; // 母音は少し長く
      } else if (phonemeInfo.type === "consonant") {
        phonemeInfo.visemeData.duration *= 0.9; // 子音は少し短く
      } else if (phonemeInfo.type === "pause") {
        phonemeInfo.visemeData.duration *= 1.5; // 休止は長く
      }

      phonemes.push(phonemeInfo);
    }

    return phonemes;
  };

  // スムーズな遷移を持つ口形素の適用
  const applyVisemeWithTransition = (
    targetViseme: string,
    targetIntensity: number,
    blendData?: { viseme: string; ratio: number }[],
    deltaTime: number = 0.016
  ) => {
    if (!currentVrmRef.current?.expressionManager) return;

    const transitionSpeed = lipSyncRef.current.transitionSpeed;
    const expressionManager = currentVrmRef.current.expressionManager;

    // 全ての口形素の現在値を取得
    const currentValues = {
      aa: expressionManager.getValue("aa") || 0,
      ih: expressionManager.getValue("ih") || 0,
      ou: expressionManager.getValue("ou") || 0,
      ee: expressionManager.getValue("ee") || 0,
      oh: expressionManager.getValue("oh") || 0,
    };

    // ターゲット値を計算
    const targetValues = { aa: 0, ih: 0, ou: 0, ee: 0, oh: 0 };

    if (targetViseme && targetIntensity > 0) {
      targetValues[targetViseme as keyof typeof targetValues] = targetIntensity;

      // ブレンド処理
      if (blendData) {
        blendData.forEach((blend) => {
          if (blend.viseme in targetValues) {
            targetValues[blend.viseme as keyof typeof targetValues] =
              targetIntensity * blend.ratio;
          }
        });
      }
    }

    // スムーズな遷移を適用
    Object.keys(currentValues).forEach((viseme) => {
      const current = currentValues[viseme as keyof typeof currentValues];
      const target = targetValues[viseme as keyof typeof targetValues];
      const diff = target - current;

      let newValue = current;
      if (Math.abs(diff) > 0.01) {
        newValue = current + diff * transitionSpeed * deltaTime;
        // 値を0-1の範囲に制限
        newValue = Math.max(0, Math.min(1, newValue));
      } else {
        newValue = target;
      }

      expressionManager.setValue(viseme, newValue);
    });

    expressionManager.update();
  };

  const startLipSync = (text: string) => {
    const phonemes = textToPhonemes(text);

    lipSyncRef.current = {
      isActive: true,
      startTime: performance.now(),
      phonemes: phonemes,
      currentIndex: 0,
      previousViseme: { viseme: "", intensity: 0 },
      transitionSpeed: 8.0,
    };
    setIsPlaying(true);

    console.log("リップシンク開始:", phonemes.length, "音素");
  };

  const stopLipSync = () => {
    lipSyncRef.current.isActive = false;
    setIsPlaying(false);

    // 口を自然に閉じる（スムーズな遷移）
    if (currentVrmRef.current?.expressionManager) {
      applyVisemeWithTransition("", 0);
    }

    console.log("リップシンク停止");
  };

  const sendMessage = async (text: string) => {
    setIsLoading(true);
    setError("");
    setResponse("");

    try {
      const response = await fetch(
        "http://localhost:4111/api/agents/mcpAgent/stream",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: [text],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullResponse = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.trim()) {
              try {
                if (line.startsWith("f:")) {
                  const metaData = JSON.parse(line.substring(2));
                  console.log("Metadata:", metaData);
                } else if (line.startsWith("0:")) {
                  const textContent = JSON.parse(line.substring(2));
                  fullResponse += textContent;
                  setResponse(fullResponse);
                } else if (line.startsWith("e:")) {
                  const endData = JSON.parse(line.substring(2));
                  console.log("End data:", endData);
                } else if (line.startsWith("d:")) {
                  const additionalData = JSON.parse(line.substring(2));
                  console.log("Additional data:", additionalData);
                }
              } catch (parseError) {
                console.warn("Failed to parse line:", line, parseError);
              }
            }
          }
        }

        if (fullResponse.trim()) {
          startLipSync(fullResponse.trim());
        }
      } else {
        const data = await response.text();
        setResponse(data);
        if (data.trim()) {
          startLipSync(data.trim());
        }
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "エラーが発生しました";
      setError(errorMessage);
      console.error("API Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (
    e?: React.FormEvent<HTMLFormElement> | React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e) e.preventDefault();
    if (message.trim() && !isLoading && !isPlaying) {
      await sendMessage(message.trim());
    }
  };

  useEffect(() => {
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    canvasRef.current?.appendChild(renderer.domElement);

    renderer.setClearColor(0xffffff, 1.0);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      30.0,
      window.innerWidth / window.innerHeight,
      0.1,
      20.0
    );
    camera.position.set(0.0, 1.1, -0.6);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.screenSpacePanning = true;
    controls.target.set(0.0, 1.2, 0.0);
    controls.update();

    const light = new THREE.DirectionalLight(0xffffff, Math.PI);
    light.position.set(1.0, 1.0, -1.0).normalize();
    scene.add(light);

    const gridHelper = new THREE.GridHelper(10, 10);
    scene.add(gridHelper);

    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    const loader = new GLTFLoader();

    loader.register((parser) => new VRMLoaderPlugin(parser));
    loader.load(
      "/models/LimeVtuber.vrm",
      (gltf) => {
        const vrm = gltf.userData.vrm as VRM;

        VRMUtils.removeUnnecessaryVertices(gltf.scene);
        VRMUtils.combineSkeletons(gltf.scene);
        VRMUtils.combineMorphs(vrm);

        vrm.scene.traverse((obj) => {
          obj.frustumCulled = false;
        });

        currentVrmRef.current = vrm;
        scene.add(vrm.scene);

        console.log("VRMモデル読み込み完了");
        console.log(
          "利用可能な表情:",
          Object.keys(vrm.expressionManager?.expressionMap || {})
        );
      },
      undefined,
      (error) => console.error("VRM読み込みエラー:", error)
    );

    const clock = new THREE.Clock();

    const animate = () => {
      requestAnimationFrame(animate);

      const deltaTime = clock.getDelta();

      if (currentVrmRef.current) {
        // 基本表情設定
        currentVrmRef.current.expressionManager?.setValue("neutral", 1.0);

        // 腕の位置設定
        const rightUpperArm =
          currentVrmRef.current.humanoid?.getNormalizedBoneNode(
            "rightUpperArm"
          );
        if (rightUpperArm) rightUpperArm.rotation.z = -0.9;

        const leftUpperArm =
          currentVrmRef.current.humanoid?.getNormalizedBoneNode("leftUpperArm");
        if (leftUpperArm) leftUpperArm.rotation.z = 0.9;

        // 改良されたリップシンク処理
        if (
          lipSyncRef.current.isActive &&
          lipSyncRef.current.phonemes.length > 0
        ) {
          const currentTime = performance.now();
          const elapsed = currentTime - lipSyncRef.current.startTime;

          // 現在の音素を計算
          let totalDuration = 0;
          let currentPhonemeIndex = -1;

          for (let i = 0; i < lipSyncRef.current.phonemes.length; i++) {
            const phoneme = lipSyncRef.current.phonemes[i];
            if (
              elapsed >= totalDuration &&
              elapsed < totalDuration + phoneme.visemeData.duration
            ) {
              currentPhonemeIndex = i;
              break;
            }
            totalDuration += phoneme.visemeData.duration;
          }

          if (
            currentPhonemeIndex >= 0 &&
            currentPhonemeIndex < lipSyncRef.current.phonemes.length
          ) {
            const currentPhoneme =
              lipSyncRef.current.phonemes[currentPhonemeIndex];
            const phonemeStartTime =
              totalDuration - currentPhoneme.visemeData.duration;
            const phonemeProgress =
              (elapsed - phonemeStartTime) / currentPhoneme.visemeData.duration;

            // 音素内での強度調整（自然な動きのため）
            let adjustedIntensity = currentPhoneme.visemeData.intensity;

            if (currentPhoneme.type === "vowel") {
              // 母音: 中央が強く、両端が弱い
              adjustedIntensity *=
                0.7 + 0.3 * Math.sin(phonemeProgress * Math.PI);
            } else if (currentPhoneme.type === "consonant") {
              // 子音: 前半が強い
              adjustedIntensity *= 1.0 - 0.3 * phonemeProgress;
            } else if (currentPhoneme.type === "pause") {
              // 休止: 徐々に口を閉じる
              adjustedIntensity *= Math.max(0, 1.0 - phonemeProgress * 2);
            }

            // 微細な振動を加える（より自然に）
            const vibration =
              0.05 * Math.sin(elapsed * 0.01) * Math.sin(elapsed * 0.017);
            adjustedIntensity += vibration;
            adjustedIntensity = Math.max(0, Math.min(1, adjustedIntensity));

            // 口形素を適用
            applyVisemeWithTransition(
              currentPhoneme.visemeData.viseme,
              adjustedIntensity,
              currentPhoneme.visemeData.blendWith,
              deltaTime
            );

            // 次の音素への遷移を予測（スムーズな切り替えのため）
            if (
              phonemeProgress > 0.7 &&
              currentPhonemeIndex < lipSyncRef.current.phonemes.length - 1
            ) {
              const nextPhoneme =
                lipSyncRef.current.phonemes[currentPhonemeIndex + 1];
              const transitionRatio = (phonemeProgress - 0.7) / 0.3;

              // 次の音素との中間値を計算
              if (
                nextPhoneme.visemeData.viseme !==
                currentPhoneme.visemeData.viseme
              ) {
                const blendIntensity =
                  adjustedIntensity * (1 - transitionRatio) +
                  nextPhoneme.visemeData.intensity * transitionRatio * 0.3;

                if (nextPhoneme.visemeData.viseme) {
                  currentVrmRef.current.expressionManager?.setValue(
                    nextPhoneme.visemeData.viseme,
                    Math.max(0, Math.min(0.3, blendIntensity))
                  );
                }
              }
            }
          } else {
            // 再生終了
            console.log("リップシンク完了");
            stopLipSync();
          }
        } else if (!lipSyncRef.current.isActive) {
          // リップシンクが非アクティブの場合、口を自然な状態に
          applyVisemeWithTransition("", 0, [], deltaTime);
        }

        // 表情の更新
        currentVrmRef.current.expressionManager?.update();
        currentVrmRef.current.update(deltaTime);
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      if (
        canvasRef.current &&
        renderer.domElement.parentNode === canvasRef.current
      ) {
        canvasRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-screen h-screen m-0">
      <div ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />

      {/* レスポンス表示エリア */}
      {(response || error) && (
        <div className="absolute top-5 left-5 right-5 bg-white/95 rounded-xl p-4 shadow-lg max-h-60 overflow-y-auto">
          {error && (
            <div className="text-red-600 font-semibold mb-2">
              エラー: {error}
            </div>
          )}
          {response && (
            <div className="text-gray-800 whitespace-pre-wrap">{response}</div>
          )}
        </div>
      )}

      {/* デバッグ情報表示 */}
      {lipSyncRef.current.isActive && (
        <div className="absolute top-5 right-5 bg-black/80 text-white rounded-lg p-3 text-sm font-mono">
          <div>音素数: {lipSyncRef.current.phonemes.length}</div>
          <div>現在位置: {lipSyncRef.current.currentIndex}</div>
          <div>
            現在の音素:{" "}
            {lipSyncRef.current.currentIndex <
            lipSyncRef.current.phonemes.length
              ? lipSyncRef.current.phonemes[lipSyncRef.current.currentIndex]
                  ?.char || "N/A"
              : "完了"}
          </div>
        </div>
      )}

      {/* メッセージ入力フォーム */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-white/95 rounded-xl p-4 shadow-lg min-w-[400px] max-w-[600px]">
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="メッセージを入力してください... (ひらがな、カタカナ、英語対応)"
            disabled={isLoading || isPlaying}
            onKeyDown={(e) => {
              if (
                e.key === "Enter" &&
                message.trim() &&
                !isLoading &&
                !isPlaying
              ) {
                handleSubmit(e);
              }
            }}
            className="flex-1 p-2 border-2 border-gray-300 rounded-md text-base outline-none text-black focus:border-blue-500"
          />
          <button
            onClick={() => handleSubmit()}
            disabled={!message.trim() || isLoading || isPlaying}
            className={`px-5 py-2 rounded-md text-base text-white font-semibold transition-colors duration-150 ${
              isLoading || isPlaying
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
            }`}
          >
            {isLoading ? "送信中..." : isPlaying ? "再生中..." : "送信"}
          </button>
          {isPlaying && (
            <button
              onClick={stopLipSync}
              className="px-4 py-2 rounded-md text-base text-white font-semibold bg-red-600 hover:bg-red-700 cursor-pointer"
            >
              停止
            </button>
          )}
        </div>

        {/* テスト用ボタン */}
        <div className="mt-3 flex gap-2 flex-wrap">
          <button
            onClick={() => startLipSync("こんにちは")}
            disabled={isLoading || isPlaying}
            className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
          >
            テスト: こんにちは
          </button>
          <button
            onClick={() => startLipSync("ありがとうございます")}
            disabled={isLoading || isPlaying}
            className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
          >
            テスト: ありがとう
          </button>
          <button
            onClick={() => startLipSync("Hello World")}
            disabled={isLoading || isPlaying}
            className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
          >
            テスト: Hello World
          </button>
          <button
            onClick={() => startLipSync("今日は良い天気ですね！")}
            disabled={isLoading || isPlaying}
            className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
          >
            テスト: 長文
          </button>
        </div>

        {/* 現在の状態表示 */}
        {(isLoading || isPlaying) && (
          <div className="mt-2 p-2 bg-gray-100 rounded text-sm text-gray-600">
            {isLoading && "メッセージを送信中..."}
            {isPlaying &&
              !isLoading &&
              `リップシンク再生中: ${response.substring(0, 50)}${
                response.length > 50 ? "..." : ""
              }`}
          </div>
        )}
      </div>
    </div>
  );
}
