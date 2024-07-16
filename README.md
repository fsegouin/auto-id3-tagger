# Auto ID3 Tagger

This Node.js script reads all MP3 files in a given directory, extracts artist and title information from the filenames, and writes ID3 tags accordingly. The filename should follow the format `Artist - Title`. Any value within square brackets in the filename will be removed.

## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/fsegouin/auto-id3-tagger.git
cd auto-id3-tagger
pnpm install

## Usage
```bash
pnpm run start

