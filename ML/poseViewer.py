import cv2
import mediapipe as mp
mp_pose=mp.solutions.pose
mp_draw=mp.solutions.drawing_utils

#video capturing
cap=cv2.VideoCapture(0)
cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 360)

with mp_pose.Pose(model_complexity=1, enable_segmentation=False, min_detection_confidence=0.5, min_tracking_confidence=0.5) as pose:
    while True:  #infinite loop
        ok,frame=cap.read() #read frame from video capture
        if not ok:
            break
        frame=cv2.flip(frame,1)  #mirror view
        rgb=cv2.cvtColor(frame,cv2.COLOR_BGR2RGB)
        res=pose.process(rgb)  #prediction

        if res.pose_landmarks:
            mp_draw.draw_landmarks(frame, res.pose_landmarks, mp_pose.POSE_CONNECTIONS)

        cv2.imshow("Pose Test (q to quit)", frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

cap.release()
cv2.destroyAllWindows()        
