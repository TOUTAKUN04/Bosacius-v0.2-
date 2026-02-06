# Bosacius Discord Music Bot

Bosacius is a Discord music bot built on `discord.js` v12. It supports YouTube and SoundCloud playback, playlists, queue management, and basic playback controls.

**Features**
- Play audio from YouTube or SoundCloud
- Queue and playlist support
- Playback controls: pause, resume, skip, stop, loop
- Queue management: shuffle, remove, move
- Lyrics lookup and now playing info
- Motivational quotes and encouragement responses
- Simple web keep-alive server for hosting platforms

**Requirements**
- Node.js 12+ (matches `discord.js` v12)
- A Discord bot token
- YouTube Data API key (for search)
- Optional: SoundCloud client ID
- Encouragement features store data in memory (resets on bot restart).

**Setup**
1. Install dependencies: `npm install`
2. Configure credentials: edit `config.json` or set environment variables
3. Start the bot: `npm start`

**Configuration**
`config.json` supports the following fields (env vars with the same names also work):
- `TOKEN`: Discord bot token
- `PREFIX`: Command prefix
- `YOUTUBE_API_KEY`: YouTube Data API key
- `SOUNDCLOUD_CLIENT_ID`: SoundCloud client ID (optional)
- `MAX_PLAYLIST_SIZE`: Maximum items to add from a playlist
- `PRUNING`: Whether to delete bot messages after playback
- `STAY_TIME`: Seconds to stay in voice channel after queue ends
- `DEFAULT_VOLUME`: Default volume (0-100)

**Commands**
Use `PREFIX + help` to see the full command list in Discord. Common commands:
- `play`, `pause`, `resume`, `skip`, `stop`, `loop`
- `queue`, `nowplaying`, `shuffle`, `remove`, `move`
- `playlist`, `search`, `lyrics`, `ping`, `uptime`, `invite`
- `PREFIX + inspire`, `PREFIX + new <message>`, `PREFIX + del <index>`, `PREFIX + list`, `PREFIX + responding true|false`

**Notes**
- Keep your bot token private. Prefer environment variables in production.
- The keep-alive server in `alive.js` listens on port `3000`.

**License**
See `LICENSE`.
