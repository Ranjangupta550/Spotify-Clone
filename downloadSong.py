import os
import yt_dlp
from moviepy.editor import VideoFileClip

def downloadSong(url):
    try:
        ydl_opts = {
            'format': 'bestaudio/best',
            'outtmpl': 'E:/Spotify-Clone/songs/%(title)s.%(ext)s',
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': '192',
            }],
        }

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([url])

        print("Song downloaded successfully!")
    except Exception as e:
        print("Error:", str(e))


url=input("Enter video url : ")
video_url =url
downloadSong(video_url)

audio_files = [file for file in os.listdir('E:/Spotify-Clone/songs') if file.endswith('.mp3')]


print("List of downloaded songs:")
for file in audio_files:
    print(file)
