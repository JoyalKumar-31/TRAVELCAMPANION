import webbrowser
import threading
import time
import uvicorn

def open_browser():
    time.sleep(1.5)
    print("\n" + "=" * 70)
    print("🌍 TravelMate AI - Opening Web Interface in your default browser...")
    print("👉 URL: http://localhost:8000")
    print("=" * 70 + "\n")
    try:
        webbrowser.open("http://localhost:8000")
    except Exception as e:
        print(f"Could not open browser automatically: {e}")

if __name__ == "__main__":
    threading.Thread(target=open_browser, daemon=True).start()
    uvicorn.run("api:app", host="127.0.0.1", port=8000, reload=False)
