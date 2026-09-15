# Projected AI Interface

> A local AI-powered projected computer interface using a mobile phone camera, computer vision, a projector, and an existing small LLM with tool skills.

## Team

- **Ethco Coder**
- **Natnael Ermiyas**

## Concept

The project turns a normal projected computer display into a physical interaction surface.

A mobile phone acts as the camera sensor. The phone sends camera frames to a desktop through a local network or, where practical, USB. The desktop detects the user's hand and fingertip, maps the camera coordinates to the projector coordinates, identifies projected UI objects, and generates structured interaction events.

An existing small local LLM — for example, a TinyLlama-class model — can then act as an agent using a system prompt and `SKILL.md` capability descriptions.

**No LLM fine-tuning is required for the initial design.**

## Architecture

```text
                 📱 MOBILE PHONE
                  Camera Sensor
                       |
                  Wi-Fi / USB
                       |
                       v
              ┌─────────────────┐
              │ Desktop Receiver│
              └────────┬────────┘
                       |
                       v
              ┌─────────────────┐
              │ Computer Vision │
              │ Hand/Fingertip  │
              └────────┬────────┘
                       |
                       v
              ┌─────────────────┐
              │  Calibration +  │
              │ Interaction     │
              └────────┬────────┘
                       |
                 Structured Event
                       |
                       v
              ┌─────────────────┐
              │   Small Local   │
              │       LLM       │
              │ System Prompt + │
              │    SKILL.md     │
              └────────┬────────┘
                       |
                       v
              ┌─────────────────┐
              │ Tool Validation │
              └────────┬────────┘
                       |
             ┌─────────┼─────────┐
             v         v         v
        PowerShell   CMD      Python/OS
             \         |         /
              \        |        /
               v       v       v
                  Windows
                     |
                     v
                 Projector
```

## Example

Imagine a projected folder named **Documents**.

The user places a finger on it.

```text
Camera
  ↓
Hand tracking
  ↓
Fingertip detected
  ↓
Coordinate transformation
  ↓
Projected object = Documents
  ↓
TOUCH(Documents)
  ↓
Agent selects open_folder skill
  ↓
Tool validation
  ↓
Windows opens Documents
  ↓
Projector displays feedback
```

## Why the LLM is not in the raw vision loop

Basic physical interaction should be fast.

Instead of sending camera images directly to the LLM:

```text
Camera → LLM → action
```

the system uses:

```text
Camera
  ↓
Vision
  ↓
Interaction engine
  ↓
Structured event
  ↓
LLM when reasoning/tool selection is needed
```

This reduces latency and allows a very small model to be useful.

## Skills

Capabilities are described using `SKILL.md`.

Example structure:

```text
skills/
├── filesystem/
│   ├── open_folder/
│   │   ├── SKILL.md
│   │   └── tool.py
│   ├── create_folder/
│   │   ├── SKILL.md
│   │   └── tool.py
│   └── search_files/
│       ├── SKILL.md
│       └── tool.py
└── applications/
    └── open_app/
        ├── SKILL.md
        └── tool.py
```

The LLM should select from registered skills rather than being given unrestricted access to the operating system.

## Safety Model

The LLM should **not** directly generate arbitrary PowerShell and have it executed automatically.

Use:

```text
LLM
 ↓
Structured tool call
 ↓
Tool allowlist
 ↓
Argument validation
 ↓
Permission / confirmation
 ↓
Execution
```

Destructive operations such as deleting files should require explicit confirmation.

## Camera Transport

### Wi-Fi

The first mobile-camera implementation should use the local Wi-Fi network:

```text
Phone ───── Wi-Fi ───── Desktop
```

This makes early development relatively simple and keeps the camera data local.

### USB

USB can be investigated later when lower latency or more reliable bandwidth is needed.

The application should use a common camera interface so that the vision engine does not care whether the frames come from a webcam, Wi-Fi phone, or USB phone.

## Suggested Technology Direction

- **Python** — desktop orchestration and vision integration.
- **OpenCV** — image processing and projector/camera calibration.
- **Hand-tracking model/library** — fingertip and hand landmarks.
- **Existing small local LLM** — agent reasoning and skill selection.
- **JSON** — structured events and tool calls.
- **PowerShell / Python / OS APIs** — controlled desktop tools.
- **Mobile application** — camera capture and local streaming.
- **Projector** — visual output and interface.

The exact libraries are intentionally left replaceable during the prototype stage.

## Repository Documents

- [`specification.md`](specification.md) — system requirements and architecture.
- [`implementation-plan.md`](implementation-plan.md) — technical implementation sequence.
- [`todo.md`](todo.md) — task checklist.
- [`roadmap.md`](roadmap.md) — project milestones and long-term direction.

## First Prototype

The recommended first demonstration is deliberately small:

1. Connect a projector.
2. Display a folder icon.
3. Use a webcam initially.
4. Detect a fingertip.
5. Calibrate camera → projector coordinates.
6. Detect a finger touching the folder.
7. Trigger `open_folder`.
8. Validate the requested path.
9. Open the folder.
10. Display success on the projector.

After this works, replace the webcam with the mobile phone.

## Development Philosophy

**Do not build everything at once.**

First prove:

```text
Hand → Projected UI
```

Then prove:

```text
Projected UI → Windows
```

Then prove:

```text
Event → Small LLM → Skill → Tool
```

Then combine:

```text
Phone Camera
      ↓
Vision
      ↓
Projected Interaction
      ↓
Small LLM Agent
      ↓
Skills
      ↓
Validated Tools
      ↓
Windows
```

## Status

**Stage:** Architecture / early implementation planning

**V1 objective:** A working projected folder interaction controlled by a hand, with the phone eventually serving as the camera sensor and a small local LLM providing optional agent/tool intelligence.

## Phase 1 Prototype

The first implementation milestone is available in `src/projected_ai_interface`. It provides a borderless Tk projected UI with a logical 4×3 test grid, responsive folder targets, hover highlighting, click/touch feedback, display selection, and a headless dry-run mode for machines without a projector or graphical session.

```bash
python3 -m pip install -e '.[test]'
python3 -m pytest -q
PYTHONPATH=src python3 -m projected_ai_interface.cli --dry-run
PYTHONPATH=src python3 -m projected_ai_interface.cli
```

Use `--display N` to select a detected display. When no display-detection library or graphical display is available, `--dry-run` uses a configurable fallback size (`--width` and `--height`) and prints the complete UI model as JSON. Press **Escape** to close the fullscreen UI.

## Phase 2 Camera Prototype

Phase 2 adds a transport-neutral `CameraSource` interface, an OpenCV webcam source, capture metrics, bounded reconnect support, and a deterministic synthetic source for testing without a camera. Install webcam support with `python3 -m pip install -e '.[camera]'`, then run `projected-camera --device 0 --frames 30`. For a headless smoke test, run `projected-camera --synthetic --frames 30`.

## Team

**Ethco Coder & Natnael Ermiyas**

This project is intended to evolve experimentally. Architecture and technology choices may change as measurements from the prototype reveal better approaches.
