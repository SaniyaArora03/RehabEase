# pose_server.py
import cv2, time, threading, math
import numpy as np
from flask import Flask, Response, jsonify
from flask_cors import CORS
import mediapipe as mp

app = Flask(__name__)
CORS(app)  # allow browser calls from your frontend
mp_pose = mp.solutions.pose
mp_draw = mp.solutions.drawing_utils

# Shared state for status
state = {
    "status": "Waiting to start…",
    "reps": 0,
    "phase": "idle",  # idle -> bent -> straight
    "angle": 0.0
}

# Angle helper
def angle_3pts(a, b, c):
    # a, b, c are (x, y)
    ab = np.array([a[0]-b[0], a[1]-b[1]])
    cb = np.array([c[0]-b[0], c[1]-b[1]])
    radians = math.atan2(cb[1], cb[0]) - math.atan2(ab[1], ab[0])
    angle = abs(radians * 180.0 / math.pi)
    if angle > 180:
        angle = 360 - angle
    return angle

def camera_worker():
    cap = cv2.VideoCapture(0)
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 360)

    global last_frame
    last_frame = None

    with mp_pose.Pose(model_complexity=1, enable_segmentation=False,
                      min_detection_confidence=0.5, min_tracking_confidence=0.5) as pose:
        while True:
            ok, frame = cap.read()
            if not ok:
                time.sleep(0.01)
                continue

            frame = cv2.flip(frame, 1)
            rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            res = pose.process(rgb)

            if res.pose_landmarks:
                mp_draw.draw_landmarks(frame, res.pose_landmarks, mp_pose.POSE_CONNECTIONS)

                h, w = frame.shape[:2]
                lm = res.pose_landmarks.landmark

                # Left leg landmarks (use right_* if you prefer)
                hip   = lm[mp_pose.PoseLandmark.LEFT_HIP]
                knee  = lm[mp_pose.PoseLandmark.LEFT_KNEE]
                ankle = lm[mp_pose.PoseLandmark.LEFT_ANKLE]

                # convert to pixel coords
                hip_p   = (int(hip.x * w), int(hip.y * h))
                knee_p  = (int(knee.x * w), int(knee.y * h))
                ankle_p = (int(ankle.x * w), int(ankle.y * h))

                # Compute knee angle
                angle = angle_3pts(hip_p, knee_p, ankle_p)
                state["angle"] = round(angle, 1)

                # Simple rules for a "knee stretch"
                # tweak thresholds to taste
                bent_thresh = 110  # below this means bent enough
                straight_thresh = 160  # above this means straight enough

                if angle < bent_thresh:
                    state["status"] = "Bend and hold… "
                    state["phase"] = "bent"
                elif angle > straight_thresh:
                    if state["phase"] == "bent":
                        state["reps"] += 1
                    state["status"] = "Return to straight "
                    state["phase"] = "straight"
                else:
                    state["status"] = "Adjust posture…"
                
                # Draw angle + status on frame
                cv2.putText(frame, f"Left knee angle: {state['angle']:.1f}",
                            (10, 25), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (20, 220, 20), 2)
                cv2.putText(frame, f"Status: {state['status']}",
                            (10, 55), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 170, 255), 2)
                cv2.putText(frame, f"Reps: {state['reps']}",
                            (10, 85), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 150, 0), 2)

                # Visualize the angle at the knee
                cv2.circle(frame, knee_p, 8, (0, 0, 255), -1)
                cv2.line(frame, knee_p, hip_p, (255, 0, 0), 3)
                cv2.line(frame, knee_p, ankle_p, (255, 0, 0), 3)
            else:
                state["status"] = "No person detected…"
            
            # Encode frame as JPEG for streaming
            _, jpeg = cv2.imencode('.jpg', frame)
            last_frame = jpeg.tobytes()

    cap.release()

# Start the camera thread
t = threading.Thread(target=camera_worker, daemon=True)
t.start()

def mjpeg_generator():
    while True:
        if last_frame is None:
            time.sleep(0.01)
            continue
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + last_frame + b'\r\n')

@app.route("/pose_feed")
def pose_feed():
    return Response(mjpeg_generator(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route("/pose_status")
def pose_status():
    return jsonify(state)
@app.route("/")
def index():
    return """
    <h2>Pose Server Running ✅</h2>
    <p>Go to <a href='/pose_feed'>/pose_feed</a> to see webcam stream.</p>
    <p>Go to <a href='/pose_status'>/pose_status</a> to see JSON status.</p>
    """

if __name__ == "__main__":
    # run on 5001 to avoid clashing with your Node server (5000)
    app.run(host="0.0.0.0", port=5001, debug=False, threaded=True)

#exercise page updates
# Fake database
user_progress = {
    "streak": 5,
    "sessions": 12,
    "accuracy": 85,
    "improvement": "Good"
}
@app.route("/api/progress", methods=["GET"])
def get_progress():
    return jsonify(user_progress)
@app.route("/api/login", methods=["POST"])
def login():
    # When user logs in, streak increases
    user_progress["streak"] += 1
    return jsonify({"message": "Login successful", "streak": user_progress["streak"]})
