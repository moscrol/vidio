import test from "node:test";
import assert from "node:assert/strict";
import {
  buildCaptionBeats,
  buildEditDecision,
  normalizeTranscript,
  validateSceneTimeline,
} from "./aroll-broll-pipeline-lib.mjs";

test("normalizes whisper tokens and removes fillers", () => {
  const words = normalizeTranscript({
    transcription: [
      {
        tokens: [
          { text: "嗯", offsets: { from: 0, to: 120 } },
          { text: "真正", offsets: { from: 120, to: 620 } },
          { text: "门槛", offsets: { from: 620, to: 1100 } },
          { text: "，", offsets: { from: 1100, to: 1120 } },
          { text: "客户", offsets: { from: 1200, to: 1700 } },
        ],
      },
    ],
  });

  assert.deepEqual(words.map((word) => word.text), ["真正", "门槛", "客户"]);
  assert.equal(words[0].start, 0.12);
  assert.equal(words.at(-1).end, 1.7);
});

test("groups caption beats and creates a gapless scene decision", () => {
  const words = normalizeTranscript({
    transcription: [
      {
        tokens: [
          { text: "很多", offsets: { from: 0, to: 900 } },
          { text: "人", offsets: { from: 900, to: 1300 } },
          { text: "以为", offsets: { from: 1300, to: 2100 } },
          { text: "真正", offsets: { from: 5200, to: 5900 } },
          { text: "门槛", offsets: { from: 5900, to: 6600 } },
          { text: "客户", offsets: { from: 6600, to: 7300 } },
          { text: "验证", offsets: { from: 7300, to: 8100 } },
          { text: "良率", offsets: { from: 15000, to: 15700 } },
          { text: "下降", offsets: { from: 15700, to: 16600 } },
        ],
      },
    ],
  });
  const beats = buildCaptionBeats(words);
  const decision = buildEditDecision({
    arollPath: "aroll.mp4",
    transcriptPath: "transcript.json",
    words,
    duration: 22,
    slug: "fixture",
  });

  assert.ok(beats.length >= 3);
  assert.ok(decision.scenes.some((scene) => scene.type === "xiaoyan"));
  assert.ok(decision.scenes.some((scene) => scene.component === "XiaoyanGateLens"));
  assert.equal(validateSceneTimeline(decision.scenes, decision.duration), true);
});
