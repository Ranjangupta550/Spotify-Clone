import os
import yt_dlp

def downloadSong(url):
    try:
        # Options for downloading
        ydl_opts = {
            'format': 'bestaudio/best',
            'outtmpl': 'E:/Spotify-Clone/songs/%(title)s.%(ext)s',  # Save as .webm first
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': '192',
            }],
            'prefer_ffmpeg': True,
            'keepvideo': False,
        }

        # Download the song using yt-dlp
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([url])

        print("Song downloaded and converted to MP3 successfully!")
    except Exception as e:
        print("Error:", str(e))

# Get the URL from the user
url = input("Enter video URL: ")
downloadSong(url)

# List the downloaded songs in the directory
audio_files = [file for file in os.listdir('E:/Spotify-Clone/songs') if file.endswith('.mp3')]

print("List of downloaded songs:")
for file in audio_files:
    print(file)
