# Changelog

All notable changes to this project will be documented in this file.

## 2026-02-06
### Fixed
- Corrected voice channel comparison for queue modification checks.
- Repaired broken emoji characters used for playback messages and reactions.
- Restored the queue add message template and cleaned the help footer text.
### Added
- Added motivation and encouragement features in `index.js` with Replit DB storage.
### Fixed
- Switched encouragement commands to use the main bot `PREFIX`.
- Disabled encouragement features gracefully when the database isn't configured.
### Changed
- Removed Replit Database dependency; encouragement data is now stored in memory.
