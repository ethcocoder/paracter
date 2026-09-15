# Projected AI Interface — TODO

## Legend

- [ ] Not started
- [~] In progress
- [x] Completed
- [!] Needs decision/investigation

## Phase 0 — Foundation

- [ ] Create repository.
- [ ] Create Python virtual environment.
- [ ] Define project package structure.
- [ ] Add logging system.
- [ ] Add configuration file.
- [ ] Add `.gitignore`.
- [ ] Add basic README.
- [ ] Decide license.
- [ ] Define minimum desktop hardware requirements.

## Phase 1 — Projector

- [x] Detect projector/secondary display.
- [x] Create fullscreen projected window.
- [x] Render test grid.
- [x] Render projected folder icons.
- [x] Add hover/highlight state.
- [x] Add visual touch feedback.

## Phase 2 — Camera

- [x] Implement generic `CameraSource`.
- [x] Add webcam source.
- [x] Measure FPS.
- [x] Measure frame latency.
- [x] Add camera reconnect behavior.

## Phase 3 — Phone Camera

- [ ] Choose Android/iOS first target.
- [ ] Create minimal camera-streaming app.
- [ ] Implement local-network discovery or manual IP connection.
- [ ] Stream frames to desktop.
- [ ] Add compression/resolution controls.
- [ ] Add connection monitoring.
- [ ] Test Wi-Fi latency.
- [ ] Investigate USB transport.
- [ ] Add USB mode if practical.

## Phase 4 — Vision

- [ ] Select hand-tracking library/model.
- [ ] Detect hand landmarks.
- [ ] Track index fingertip.
- [ ] Add confidence threshold.
- [ ] Add temporal smoothing.
- [ ] Detect touch/hover.
- [ ] Detect drag.
- [ ] Detect swipe.
- [ ] Test different lighting conditions.

## Phase 5 — Calibration

- [ ] Display four calibration points.
- [ ] Capture corresponding camera coordinates.
- [ ] Calculate homography.
- [ ] Save calibration profile.
- [ ] Load calibration on startup.
- [ ] Add recalibration command.
- [ ] Test different projector angles.

## Phase 6 — Interaction Engine

- [ ] Implement coordinate transform.
- [ ] Implement UI hit testing.
- [ ] Implement event schema.
- [ ] Implement touch debounce.
- [ ] Implement event confidence.
- [ ] Add event logger.
- [ ] Test folder touch.
- [ ] Test button touch.
- [ ] Test drag operation.

## Phase 7 — Skills

- [ ] Define `SKILL.md` format.
- [ ] Build skill loader.
- [ ] Build skill registry.
- [ ] Build tool registry.
- [ ] Create `open_folder` skill.
- [ ] Create `list_folder` skill.
- [ ] Create `open_app` skill.
- [ ] Create `create_folder` skill.
- [ ] Create `search_files` skill.
- [ ] Create `move_file` skill.
- [ ] Create `copy_file` skill.
- [ ] Add destructive-operation confirmation.

## Phase 8 — LLM

- [ ] Select initial existing small LLM.
- [ ] Run model locally.
- [ ] Define system prompt.
- [ ] Define structured tool-call format.
- [ ] Feed structured interaction events to model.
- [ ] Load relevant `SKILL.md` content.
- [ ] Validate model output.
- [ ] Add retry behavior.
- [ ] Measure inference latency.
- [ ] Test model with simple commands.
- [ ] Test model with ambiguous commands.

## Phase 9 — Tool Safety

- [ ] Build tool validation layer.
- [ ] Allowlist tools.
- [ ] Validate filesystem paths.
- [ ] Prevent path traversal.
- [ ] Separate read and write permissions.
- [ ] Add confirmation for delete.
- [ ] Add execution timeout.
- [ ] Log tool execution.
- [ ] Never directly execute arbitrary LLM shell text.

## Phase 10 — Integration

- [ ] Connect phone camera to vision.
- [ ] Connect vision to calibration.
- [ ] Connect calibration to projected UI.
- [ ] Connect events to agent runtime.
- [ ] Connect agent to skills.
- [ ] Connect skills to tools.
- [ ] Connect tools to Windows.
- [ ] Return tool results to UI.
- [ ] Build complete folder-touch demonstration.

## Phase 11 — Testing

- [ ] Test bright lighting.
- [ ] Test low lighting.
- [ ] Test different camera angles.
- [ ] Test different projector angles.
- [ ] Test network interruption.
- [ ] Test camera disconnect.
- [ ] Test false touch.
- [ ] Test slow LLM.
- [ ] Test malformed LLM output.
- [ ] Test unsafe tool call.
- [ ] Test destructive command confirmation.

## V1 Demo Checklist

- [ ] Phone is camera.
- [ ] Desktop receives phone video.
- [ ] Projector displays UI.
- [ ] Hand is detected.
- [ ] Fingertip is tracked.
- [ ] Calibration works.
- [ ] Projected folder can be touched.
- [ ] Folder action is generated.
- [ ] Tool is validated.
- [ ] Folder opens.
- [ ] Projected UI shows result.

## Future Ideas

- [ ] Voice + projected interaction.
- [ ] Multiple phones/cameras.
- [ ] Gesture-controlled window management.
- [ ] Projected keyboard.
- [ ] Natural-language projected workspace.
- [ ] Multi-agent skills.
- [ ] Automatic skill discovery.
- [ ] Sensor fusion.
